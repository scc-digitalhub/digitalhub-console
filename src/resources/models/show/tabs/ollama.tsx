import {
    BooleanField,
    FunctionField,
    Labeled,
    NumberField,
    RecordContextProvider,
    TextField,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Chip,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { JSONTree } from 'react-json-tree';
import humanFormat from 'human-format';

const byteScale = humanFormat.Scale.create(['B', 'KB', 'MB', 'GB', 'TB'], 1000);

const formatBytes = (bytes?: number) =>
    typeof bytes === 'number'
        ? humanFormat(bytes, { scale: byteScale, maxDecimals: 1 })
        : '-';

export const OllamaModel = props => {
    const translate = useTranslate();
    const record = useRecordContext(props);
    const ollama = record?.status?.ollama || {};
    const capabilities = Array.isArray(ollama.capabilities)
        ? ollama.capabilities
        : [];
    const sizes = Array.isArray(ollama.sizes) ? ollama.sizes : [];
    const tagDetails = Array.isArray(ollama.tag_details)
        ? ollama.tag_details
        : [];
    const sizeEntries = Object.entries(ollama.size_bytes || {});

    return (
        <RecordContextProvider value={ollama}>
            <Stack spacing={2}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    {ollama.name && (
                        <Labeled label="fields.ollama.name.title">
                            <TextField source="name" />
                        </Labeled>
                    )}
                    {ollama.url && (
                        <Labeled label="fields.ollama.url.title">
                            <TextField source="url" />
                        </Labeled>
                    )}
                    {typeof ollama.cloud === 'boolean' && (
                        <Labeled label="fields.ollama.cloud.title">
                            <BooleanField source="cloud" />
                        </Labeled>
                    )}
                </Stack>

                {ollama.description && (
                    <Labeled label="fields.ollama.description.title">
                        <TextField source="description" />
                    </Labeled>
                )}

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    {capabilities.length > 0 && (
                        <Labeled label="fields.ollama.capabilities.title">
                            <Stack direction="row" useFlexGap flexWrap="wrap" gap={1}>
                                {capabilities.map((capability: string) => (
                                    <Chip key={capability} label={capability} size="small" />
                                ))}
                            </Stack>
                        </Labeled>
                    )}
                    {sizes.length > 0 && (
                        <Labeled label="fields.ollama.sizes.title">
                            <Stack direction="row" useFlexGap flexWrap="wrap" gap={1}>
                                {sizes.map((size: string) => (
                                    <Chip key={size} label={size} size="small" />
                                ))}
                            </Stack>
                        </Labeled>
                    )}
                </Stack>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    {typeof ollama.pulls === 'number' && (
                        <Labeled label="fields.ollama.pulls.title">
                            <TextField source="pulls_label" />
                        </Labeled>
                    )}
                    {typeof ollama.tags === 'number' && (
                        <Labeled label="fields.ollama.tags.title">
                            <NumberField source="tags" />
                        </Labeled>
                    )}
                    {ollama.updated_label && (
                        <Labeled label="fields.ollama.updated.title">
                            <TextField source="updated_label" />
                        </Labeled>
                    )}
                </Stack>

                {sizeEntries.length > 0 && (
                    <Labeled label="fields.ollama.model_sizes.title">
                        <Stack direction="row" useFlexGap flexWrap="wrap" gap={1}>
                            {sizeEntries.map(([tag, bytes]) => (
                                <Chip
                                    key={tag}
                                    label={`${tag}: ${formatBytes(Number(bytes))}`}
                                    size="small"
                                    variant="outlined"
                                />
                            ))}
                        </Stack>
                    </Labeled>
                )}

                {tagDetails.length > 0 && (
                    <Labeled label="fields.ollama.tag_details.title">
                        <TableContainer component={Paper} variant="outlined">
                            <Table
                                size="small"
                                aria-label={translate('fields.ollama.tag_details.title')}
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{translate('fields.ollama.tag.title')}</TableCell>
                                        <TableCell>{translate('fields.ollama.digest.title')}</TableCell>
                                        <TableCell>{translate('fields.ollama.context.title')}</TableCell>
                                        <TableCell>{translate('fields.ollama.input.title')}</TableCell>
                                        <TableCell>{translate('fields.ollama.cloud.title')}</TableCell>
                                        <TableCell>{translate('fields.ollama.size.title')}</TableCell>
                                        <TableCell>{translate('fields.ollama.updated.title')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tagDetails.map((tag: any) => (
                                        <RecordContextProvider
                                            key={`${tag.tag}-${tag.digest}`}
                                            value={tag}
                                        >
                                            <TableRow>
                                                <TableCell>
                                                    <TextField source="tag" />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField source="digest" />
                                                </TableCell>
                                                <TableCell>
                                                    <NumberField source="context" />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField source="input" />
                                                </TableCell>
                                                <TableCell>
                                                    <BooleanField source="cloud" />
                                                </TableCell>
                                                <TableCell>
                                                    <FunctionField
                                                        render={tagRecord => {
                                                            const size = formatBytes(
                                                                tagRecord.size_bytes
                                                            );
                                                            if (
                                                                tagRecord.size_bytes_max ===
                                                                tagRecord.size_bytes
                                                            ) {
                                                                return size;
                                                            }
                                                            return `${size} (${translate('fields.ollama.max.title')}: ${formatBytes(tagRecord.size_bytes_max)})`;
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField source="updated_label" />
                                                </TableCell>
                                            </TableRow>
                                        </RecordContextProvider>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Labeled>
                )}

                <Accordion disableGutters elevation={0} square>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6">
                            {translate('fields.ollama.metadata.title')}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box
                            sx={{
                                maxWidth: '100%',
                                minWidth: 0,
                                overflowX: 'auto',
                            }}
                        >
                            <JSONTree data={ollama} hideRoot />
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Stack>
        </RecordContextProvider>
    );
};
