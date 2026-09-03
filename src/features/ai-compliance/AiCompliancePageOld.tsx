// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { Box, Container, Divider, Tab, Tabs } from '@mui/material';
import {
    Button,
    EditBase,
    EditView,
    ResourceContextProvider,
    ShowBase,
    ShowView,
    SimpleForm,
    TopToolbar,
    useBasename,
    useNotify,
    useRecordContext,
    useRedirect,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { useRootSelector } from '@dslab/ra-root-selector';
import { PageTitle } from '../../common/components/layout/PageTitle';
import { FlatCard } from '../../common/components/layout/FlatCard';
import { EditToolbar } from '../../common/components/toolbars/EditToolbar';
import { CustomTabbedShowLayout } from '../../common/components/CustomTabbedShowLayout';
import { FilteredJsonSchemaField } from '../../common/jsonSchema/components/FilteredJsonSchemaField';
import { JsonSchemaInput } from '../../common/jsonSchema/components/JsonSchema';
import { EmptyMessage } from '../../common/components/layout/EmptyMessage';
import { ComplianceIcon } from './icon';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import { useGetExtensions } from '../extensions/utils';


const OVERVIEW_FIELDS = [
    'domain',
    'ai_task',
    'ai_task_value',
    'goal',
    'purpose',
    'audience',
    'scope',
    'deployment',
];
const STATUS_FIELDS = ['compliance_status'];
const CONTEXT_FIELDS = ['context'];
const OBJECTIVES_FIELDS = ['objectives'];
const DOCUMENTATION_FIELDS = ['documentation'];

const ALL_SPEC_FIELDS = [
    ...OVERVIEW_FIELDS,
    ...STATUS_FIELDS,
    ...CONTEXT_FIELDS,
    ...OBJECTIVES_FIELDS,
    ...DOCUMENTATION_FIELDS,
];

const TAB_FIELDS: Record<string, string[]> = {
    overview: OVERVIEW_FIELDS,
    status: STATUS_FIELDS,
    context: CONTEXT_FIELDS,
    objectives: OBJECTIVES_FIELDS,
    documentation: DOCUMENTATION_FIELDS,
};

const buildTabUiSchema = (activeTab: string): Record<string, any> => {
    const visibleFields = TAB_FIELDS[activeTab] || [];
    const uiSchema: Record<string, any> = {};
    ALL_SPEC_FIELDS.forEach(f => {
        if (!visibleFields.includes(f)) {
            uiSchema[f] = { 'ui:widget': 'hidden' };
        }
    });
    return uiSchema;
};

// ── Show page ─────────────────────────────────────────────────────────────────

const ShowToolbar = () => {
    const basename = useBasename();
    const navigate = useNavigate();
    const record = useRecordContext();
    const extension = record?.extensions?.find(
        (e: any) => e.kind === 'ai-compliance'
    );

    return (
        <TopToolbar>
            {extension ? (
                <Button
                    label="ra.action.edit"
                    onClick={() => navigate(`${basename}/compliance/edit`)}
                >
                    <EditIcon />
                </Button>
            ) : (
                <Button
                    label="pages.compliance.create"
                    onClick={() => navigate(`${basename}/compliance/edit`)}
                >
                    <AddIcon />
                </Button>
            )}
        </TopToolbar>
    );
};

const AiComplianceShowLayout = () => {
    const record = useRecordContext();
    const { data: extensionSchemas } = useGetExtensions('project');

    const extension = record?.extensions?.find(
        (e: any) => e.kind === 'ai-compliance'
    );
    const schema = extensionSchemas?.find(
        (s: any) => s.kind === 'ai-compliance'
    )?.schema;

    if (!schema) return <></>;

    if (!extension) {
        return <EmptyMessage message="pages.compliance.empty" />;
    }

    return (
        <CustomTabbedShowLayout syncWithLocation={false} record={extension}>
            <CustomTabbedShowLayout.Tab
                value="overview"
                label="pages.compliance.tabs.overview"
            >
                <FilteredJsonSchemaField
                    record={extension}
                    sourceName="spec"
                    fields={OVERVIEW_FIELDS}
                    schema={schema}
                />
            </CustomTabbedShowLayout.Tab>
            <CustomTabbedShowLayout.Tab
                value="status"
                label="pages.compliance.tabs.status"
            >
                <FilteredJsonSchemaField
                    record={extension}
                    sourceName="spec"
                    fields={STATUS_FIELDS}
                    schema={schema}
                />
            </CustomTabbedShowLayout.Tab>
            <CustomTabbedShowLayout.Tab
                value="context"
                label="pages.compliance.tabs.context"
            >
                <FilteredJsonSchemaField
                    record={extension}
                    sourceName="spec"
                    fields={CONTEXT_FIELDS}
                    schema={schema}
                />
            </CustomTabbedShowLayout.Tab>
            <CustomTabbedShowLayout.Tab
                value="objectives"
                label="pages.compliance.tabs.objectives"
            >
                <FilteredJsonSchemaField
                    record={extension}
                    sourceName="spec"
                    fields={OBJECTIVES_FIELDS}
                    schema={schema}
                />
            </CustomTabbedShowLayout.Tab>
            <CustomTabbedShowLayout.Tab
                value="documentation"
                label="pages.compliance.tabs.documentation"
            >
                <FilteredJsonSchemaField
                    record={extension}
                    sourceName="spec"
                    fields={DOCUMENTATION_FIELDS}
                    schema={schema}
                />
            </CustomTabbedShowLayout.Tab>
        </CustomTabbedShowLayout>
    );
};

export const AiCompliancePage = () => {
    const { root: projectId } = useRootSelector();
    const translate = useTranslate();

    return (
        <ResourceContextProvider value="projects">
            <Container maxWidth={false} sx={{ pb: 2 }}>
                <ShowBase id={projectId}>
                    <>
                        <PageTitle
                            text={translate('pages.compliance.title')}
                            secondaryText={translate(
                                'pages.compliance.description'
                            )}
                            icon={<ComplianceIcon fontSize="large" />}
                        />
                        <ShowView
                            actions={<ShowToolbar />}
                            component={FlatCard}
                        >
                            <AiComplianceShowLayout />
                        </ShowView>
                    </>
                </ShowBase>
            </Container>
        </ResourceContextProvider>
    );
};

// ── Edit page ─────────────────────────────────────────────────────────────────

const AiComplianceTabbedEdit = ({
    extensionIndex,
    schema,
}: {
    extensionIndex: number;
    schema: any;
}) => {
    const [tab, setTab] = useState('overview');
    const translate = useTranslate();
    const source = `extensions.${extensionIndex}.spec`;

    return (
        <Box sx={{ '& .hidden-tab-field': { display: 'none' } }}>
            <Tabs
                value={tab}
                onChange={(_, v) => setTab(v as string)}
                indicatorColor="primary"
                textColor="primary"
            >
                <Tab
                    value="overview"
                    label={translate('pages.compliance.tabs.overview')}
                />
                <Tab
                    value="status"
                    label={translate('pages.compliance.tabs.status')}
                />
                <Tab
                    value="context"
                    label={translate('pages.compliance.tabs.context')}
                />
                <Tab
                    value="objectives"
                    label={translate('pages.compliance.tabs.objectives')}
                />
                <Tab
                    value="documentation"
                    label={translate('pages.compliance.tabs.documentation')}
                />
            </Tabs>
            <Divider />
            <Box sx={{ pt: 1 }}>
                {/* key=tab forces remount on tab change so RJSF reinitialises
                    with the current full spec; hidden fields keep their values
                    in the schema-based formData and are preserved through onChange */}
                <JsonSchemaInput
                    key={tab}
                    source={source}
                    schema={{ ...schema, title: '' }}
                    uiSchema={buildTabUiSchema(tab)}
                />
            </Box>
        </Box>
    );
};

const AiComplianceEditContent = ({ schema }: { schema: any }) => {
    const { getValues, setValue } = useFormContext();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const exts: any[] = getValues('extensions') || [];
        if (exts.findIndex((e: any) => e.kind === 'ai-compliance') === -1) {
            setValue(
                'extensions',
                [
                    ...exts,
                    { kind: 'ai-compliance', name: 'ai-compliance', spec: {} },
                ],
                { shouldDirty: true }
            );
        }
        setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!ready) return <></>;

    const idx = (getValues('extensions') || []).findIndex(
        (e: any) => e.kind === 'ai-compliance'
    );

    if (idx === -1) return <EmptyMessage message="pages.compliance.empty" />;

    return <AiComplianceTabbedEdit extensionIndex={idx} schema={schema} />;
};

const EditPageTitle = () => {
    const record = useRecordContext();
    const translate = useTranslate();
    const hasExtension = record?.extensions?.some(
        (e: any) => e.kind === 'ai-compliance'
    );
    return (
        <PageTitle
            text={translate(
                hasExtension
                    ? 'pages.compliance.editTitle'
                    : 'pages.compliance.createTitle'
            )}
            icon={<ComplianceIcon fontSize="large" />}
        />
    );
};

export const AiComplianceEditPage = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const resource = useResourceContext();

    const { root: projectId } = useRootSelector();
    const { data: extensionSchemas } = useGetExtensions('project');

    const schema = extensionSchemas?.find(
        (s: any) => s.kind === 'ai-compliance'
    )?.schema;

    const onSuccess = () => {};
    const onSettled = data => {
        notify('ra.notification.updated', {
            type: 'info',
            messageArgs: { smart_count: 1 },
        });
        redirect('../compliance');
    };

    return (
        <ResourceContextProvider value="projects">
            <Container maxWidth={false} sx={{ pb: 2 }}>
                <EditBase id={projectId} 
                    mutationMode="optimistic"
                    mutationOptions={{
                        onSuccess: onSuccess,
                        onSettled: onSettled,
                    }}>
                    <>
                        <EditPageTitle />
                        <EditView component={FlatCard}>
                            <SimpleForm toolbar={<EditToolbar />}>
                                {schema && (
                                    <AiComplianceEditContent schema={schema} />
                                )}
                            </SimpleForm>
                        </EditView>
                    </>
                </EditBase>
            </Container>
        </ResourceContextProvider>
    );
};
