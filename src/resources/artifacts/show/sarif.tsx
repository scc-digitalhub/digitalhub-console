import { useEffect, useState } from 'react';
import {
    Alert,
    Badge,
    Box,
    Button,
    Chip,
    FormControl,
    InputLabel,
    LinearProgress,
    Link as MuiLink,
    MenuItem,
    Select,
    Stack,
    Typography,
} from '@mui/material';
import {
    ColumnsButton,
    DataTable,
    FunctionField,
    ListContextProvider,
    Pagination,
    ResourceContextProvider,
    TopToolbar,
    useList,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { DownloadButton } from '../../../features/files/download/components/DownloadButton';
import { useDownload } from '../../../features/files/download/useDownload';

interface SarifReport {
    runs?: SarifRun[];
}

interface SarifRun {
    tool?: { driver?: SarifDriver };
    results?: SarifResult[];
}

interface SarifDriver {
    name?: string;
    fullName?: string;
    informationUri?: string;
    version?: string;
    semanticVersion?: string;
    rules?: SarifRule[];
}

interface SarifRule {
    id?: string;
    shortDescription?: { text?: string };
    helpUri?: string;
    properties?: Record<string, unknown>;
}

interface SarifResult {
    ruleId?: string;
    level?: string;
    message?: { text?: string };
    properties?: Record<string, unknown>;
    locations?: Array<{
        physicalLocation?: {
            artifactLocation?: { uri?: string };
        };
    }>;
}

interface SarifFinding {
    id: string;
    package: string;
    vulnerability: string;
    severity: string;
    status: string;
    installedVersion: string;
    fixedVersion: string;
    description: string;
    url?: string;
}

interface LibrarySummary {
    package: string;
    count: number;
}

export const SarifTab = () => {
    const record = useRecordContext();
    const download = useDownload();
    const extensions = Array.isArray(record?.extensions)
        ? record.extensions
        : [];
    const reportExtension = extensions.find(
        (extension: any) => extension?.kind === 'secops-report'
    );
    const path = reportExtension?.spec?.path;
    const [findings, setFindings] = useState<SarifFinding[] | null>(null);
    const [scanDriver, setScanDriver] = useState<SarifDriver>();
    const [error, setError] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);
    const [libraryFilter, setLibraryFilter] = useState('');
    const [severityFilter, setSeverityFilter] = useState('');
    const allFindings = findings || [];
    const libraryOptions = Array.from(
        new Set(
            allFindings.map(finding => finding.package || 'Unknown library')
        )
    ).sort((left, right) => left.localeCompare(right));
    const severityOptions = Array.from(
        new Set(allFindings.map(finding => finding.severity))
    ).sort((left, right) => severityRank(left) - severityRank(right));
    const filteredFindings = allFindings.filter(
        finding =>
            (!libraryFilter ||
                (finding.package || 'Unknown library') === libraryFilter) &&
            (!severityFilter || finding.severity === severityFilter)
    );
    const hasFilters = Boolean(libraryFilter || severityFilter);
    const listContext = useList({ data: filteredFindings, perPage: 25 });

    useEffect(() => {
        if (typeof path !== 'string' || !path) return;

        let active = true;
        setIsLoading(true);
        setError(undefined);
        setFindings(null);
        setScanDriver(undefined);

        const loadReport = async () => {
            try {
                const downloadInfo = await download({ path });
                if (!downloadInfo?.url) {
                    throw new Error(
                        'The security report could not be downloaded.'
                    );
                }

                const response = await fetch(downloadInfo.url);
                if (!response.ok) {
                    throw new Error(
                        `Unable to load the security report (${response.status}).`
                    );
                }

                const report = (await response.json()) as SarifReport;
                if (active) {
                    setFindings(parseSarifFindings(report));
                    setScanDriver(
                        report.runs?.find(run => run.tool?.driver)?.tool?.driver
                    );
                }
            } catch (loadError) {
                if (active) {
                    setError(
                        loadError instanceof Error
                            ? loadError.message
                            : String(loadError)
                    );
                }
            } finally {
                if (active) setIsLoading(false);
            }
        };

        void loadReport();
        return () => {
            active = false;
        };
    }, [download, path]);

    if (typeof path !== 'string' || !path) {
        return <Alert severity="info">No SARIF report is attached.</Alert>;
    }

    const downloadToolbar = (
        <TopToolbar>
            <DownloadButton path={path} fileName={path.split('/').pop()} />
        </TopToolbar>
    );

    if (isLoading) {
        return (
            <Stack spacing={1}>
                {downloadToolbar}
                <LinearProgress />
            </Stack>
        );
    }
    if (error) {
        return (
            <Stack spacing={1}>
                {downloadToolbar}
                <Alert severity="error">{error}</Alert>
            </Stack>
        );
    }
    if (findings === null) {
        return (
            <Stack spacing={1}>
                {downloadToolbar}
                <LinearProgress />
            </Stack>
        );
    }
    if (findings.length === 0) {
        return (
            <Stack spacing={1}>
                {downloadToolbar}
                <ScanSummary driver={scanDriver} />
                <Alert severity="success">No vulnerabilities found.</Alert>
            </Stack>
        );
    }

    const librarySummaries = Object.values(
        findings.reduce<Record<string, LibrarySummary>>(
            (libraries, finding) => {
                const packageName = finding.package || 'Unknown library';
                const summary = libraries[packageName] || {
                    package: packageName,
                    count: 0,
                };
                summary.count += 1;
                libraries[packageName] = summary;
                return libraries;
            },
            {}
        )
    ).sort((left, right) => left.package.localeCompare(right.package));

    return (
        <Stack spacing={0}>
            {downloadToolbar}
            <ScanSummary driver={scanDriver} />
            <Box
                component="section"
                aria-labelledby="library-summary-title"
                mt={2}
            >
                <Typography id="library-summary-title" variant="h6">
                    Libraries ({librarySummaries.length})
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1.5} py={2}>
                    {librarySummaries.map(library => (
                        <Badge
                            key={library.package}
                            badgeContent={library.count}
                            color="error"
                            overlap="rectangular"
                            sx={{ mr: 1, mb: 1 }}
                        >
                            <Chip label={library.package} />
                        </Badge>
                    ))}
                </Stack>
            </Box>
            <Box
                component="section"
                aria-labelledby="vulnerability-list-title"
                mt={2}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 1 }}
                >
                    <Typography id="vulnerability-list-title" variant="h6">
                        Vulnerabilities ({filteredFindings.length})
                    </Typography>
                    <ColumnsButton
                        storeKey="security-findings"
                        color="secondary"
                    />
                </Stack>
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                    spacing={1.5}
                    component="section"
                    aria-label="Filter vulnerabilities"
                >
                    <FormControl size="small" sx={{ minWidth: 190 }}>
                        <InputLabel id="sarif-library-filter-label">
                            Library
                        </InputLabel>
                        <Select<string>
                            labelId="sarif-library-filter-label"
                            value={libraryFilter}
                            label="Library"
                            onChange={event =>
                                setLibraryFilter(event.target.value)
                            }
                        >
                            <MenuItem value="">All libraries</MenuItem>
                            {libraryOptions.map(library => (
                                <MenuItem key={library} value={library}>
                                    {library}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel id="sarif-severity-filter-label">
                            Severity
                        </InputLabel>
                        <Select<string>
                            labelId="sarif-severity-filter-label"
                            value={severityFilter}
                            label="Severity"
                            onChange={event =>
                                setSeverityFilter(event.target.value)
                            }
                        >
                            <MenuItem value="">All severities</MenuItem>
                            {severityOptions.map(severity => (
                                <MenuItem key={severity} value={severity}>
                                    {severity}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {hasFilters && (
                        <Button
                            size="small"
                            onClick={() => {
                                setLibraryFilter('');
                                setSeverityFilter('');
                            }}
                        >
                            Clear filters
                        </Button>
                    )}
                </Stack>
                {filteredFindings.length === 0 ? (
                    <Alert severity="info">
                        No vulnerabilities match the selected filters.
                    </Alert>
                ) : (
                    <ResourceContextProvider value="security-findings">
                        <ListContextProvider value={listContext}>
                            <DataTable
                                resource="security-findings"
                                storeKey="security-findings"
                                bulkActionButtons={false}
                                rowClick={false}
                                hiddenColumns={[
                                    'installedVersion',
                                    'fixedVersion',
                                    'status',
                                ]}
                            >
                                <DataTable.Col
                                    source="package"
                                    label="Library"
                                />
                                <DataTable.Col
                                    source="vulnerability"
                                    label="Vulnerability"
                                />
                                <DataTable.Col
                                    source="severity"
                                    label="Severity"
                                >
                                    <FunctionField
                                        render={(finding: SarifFinding) => (
                                            <Chip
                                                size="small"
                                                color={severityColor(
                                                    finding.severity
                                                )}
                                                label={finding.severity}
                                            />
                                        )}
                                    />
                                </DataTable.Col>
                                <DataTable.Col source="status" label="Status" />
                                <DataTable.Col
                                    source="installedVersion"
                                    label="Installed Version"
                                />
                                <DataTable.Col
                                    source="fixedVersion"
                                    label="Fixed Version"
                                />
                                <DataTable.Col
                                    source="description"
                                    label="Description"
                                    disableSort
                                >
                                    <FunctionField
                                        render={(finding: SarifFinding) => (
                                            <>
                                                {finding.description}
                                                {finding.url && (
                                                    <>
                                                        {' '}
                                                        <MuiLink
                                                            href={finding.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            {finding.url}
                                                        </MuiLink>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    />
                                </DataTable.Col>
                            </DataTable>
                            <Pagination rowsPerPageOptions={[10, 25, 50]} />
                        </ListContextProvider>
                    </ResourceContextProvider>
                )}
            </Box>
        </Stack>
    );
};

const ScanSummary = (props: { driver?: SarifDriver }) => {
    const { driver } = props;
    const translate = useTranslate();
    if (!driver) return null;

    return (
        <Box component="section" aria-labelledby="scan-summary-title">
            <Typography id="scan-summary-title" variant="h6" mb={1}>
                {translate('fields.summary')}
            </Typography>
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                flexWrap="wrap"
                columnGap={3}
                rowGap={0.5}
            >
                {(driver.fullName || driver.name) && (
                    <Typography>
                        <strong>Scanner:</strong>{' '}
                        {driver.fullName || driver.name}
                    </Typography>
                )}
                {driver.name && driver.fullName && (
                    <Typography>
                        <strong>Tool:</strong> {driver.name}
                    </Typography>
                )}
                {(driver.semanticVersion || driver.version) && (
                    <Typography>
                        <strong>Version:</strong>{' '}
                        {driver.semanticVersion || driver.version}
                    </Typography>
                )}
                {driver.informationUri && (
                    <Typography>
                        <strong>Information:</strong>{' '}
                        <MuiLink
                            href={driver.informationUri}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {driver.informationUri}
                        </MuiLink>
                    </Typography>
                )}
            </Stack>
        </Box>
    );
};

const parseSarifFindings = (report: SarifReport): SarifFinding[] =>
    (report.runs || []).flatMap((run, runIndex) => {
        const rules = run.tool?.driver?.rules || [];
        return (run.results || []).map((result, resultIndex) => {
            const rule = rules.find(
                candidate => candidate.id === result.ruleId
            );
            const properties = result.properties || {};
            const ruleProperties = rule?.properties;
            const artifactUri =
                result.locations?.[0]?.physicalLocation?.artifactLocation?.uri;
            const packageMatch = artifactUri
                ? /^pkg:[^/]+\/([^@?#]+)@([^?#]+)/.exec(artifactUri)
                : undefined;
            const fixedVersion = getProperty(properties, [
                'FixedVersion',
                'fixedVersion',
                'fixVersion',
            ]);
            const severity = getSeverity(
                getProperty(properties, ['Severity', 'severity']) ||
                    getProperty(ruleProperties, ['Severity', 'severity']) ||
                    getTagSeverity(properties.tags) ||
                    getTagSeverity(ruleProperties?.tags),
                getProperty(properties, [
                    'security-severity',
                    'cvssv3_baseScore',
                    'cvssv2_score',
                ]) ||
                    getProperty(ruleProperties, [
                        'security-severity',
                        'cvssv3_baseScore',
                        'cvssv2_score',
                    ]),
                result.level
            );

            return {
                id: `${runIndex}-${resultIndex}`,
                package:
                    getProperty(properties, [
                        'PkgName',
                        'packageName',
                        'package',
                        'component',
                    ]) ||
                    packageMatch?.[1] ||
                    artifactUri?.split('/').pop() ||
                    '',
                vulnerability:
                    getProperty(properties, [
                        'VulnerabilityID',
                        'vulnerabilityId',
                    ]) ||
                    result.ruleId ||
                    '',
                severity,
                status:
                    getProperty(properties, ['Status', 'status']) ||
                    (fixedVersion ? 'fixed' : 'affected'),
                installedVersion:
                    getProperty(properties, [
                        'InstalledVersion',
                        'installedVersion',
                        'packageVersion',
                    ]) ||
                    packageMatch?.[2] ||
                    '',
                fixedVersion: fixedVersion || '',
                description:
                    getProperty(properties, ['Title', 'title']) ||
                    rule?.shortDescription?.text ||
                    result.message?.text ||
                    '',
                url:
                    getProperty(properties, [
                        'PrimaryURL',
                        'primaryUrl',
                        'url',
                    ]) ||
                    getReferenceUrl(properties.references) ||
                    rule?.helpUri,
            };
        });
    });

const getProperty = (
    properties: Record<string, unknown> | undefined,
    names: string[]
): string | undefined => {
    if (!properties) return undefined;
    for (const name of names) {
        const entry = Object.entries(properties).find(
            ([key]) => key.toLowerCase() === name.toLowerCase()
        );
        if (typeof entry?.[1] === 'string') return entry[1];
        if (typeof entry?.[1] === 'number' && Number.isFinite(entry[1])) {
            return String(entry[1]);
        }
    }
    return undefined;
};

const getTagSeverity = (tags: unknown): string | undefined => {
    if (!Array.isArray(tags)) return undefined;
    return tags.find(
        (tag): tag is string =>
            typeof tag === 'string' &&
            ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'UNKNOWN'].includes(
                tag.toUpperCase()
            )
    );
};

const getReferenceUrl = (references: unknown): string | undefined => {
    if (!Array.isArray(references)) return undefined;
    const reference = references.find(
        item => item && typeof item === 'object' && 'url' in item
    ) as { url?: unknown } | undefined;
    return typeof reference?.url === 'string' ? reference.url : undefined;
};

const getSeverity = (
    namedSeverity?: string,
    securitySeverity?: string,
    level?: string
): string => {
    const normalizedSeverity = namedSeverity?.toUpperCase();
    if (
        normalizedSeverity &&
        ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'UNKNOWN'].includes(
            normalizedSeverity
        )
    ) {
        return normalizedSeverity;
    }
    const score = Number(securitySeverity || namedSeverity);
    if (Number.isFinite(score) && score > 0) {
        if (score >= 9) return 'CRITICAL';
        if (score >= 7) return 'HIGH';
        if (score >= 4) return 'MEDIUM';
        return 'LOW';
    }
    const normalizedLevel = level?.toUpperCase();
    return ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'UNKNOWN'].includes(
        normalizedLevel || ''
    )
        ? normalizedLevel || 'UNKNOWN'
        : 'UNKNOWN';
};

const severityColor = (
    severity: string
): 'default' | 'error' | 'warning' | 'info' => {
    if (severity === 'CRITICAL' || severity === 'HIGH') return 'error';
    if (severity === 'MEDIUM') return 'warning';
    if (severity === 'LOW') return 'info';
    return 'default';
};

const severityRank = (severity: string): number => {
    const order = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'UNKNOWN'];
    const index = order.indexOf(severity);
    return index === -1 ? order.length : index;
};
