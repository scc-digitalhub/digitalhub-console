import { BackButton } from '@dslab/ra-back-button';
import { ExportRecordButton } from '@dslab/ra-export-record-button';
import { InspectButton } from '@dslab/ra-inspect-button';
import { Container, Stack } from '@mui/material';
import { ReactNode, memo, useEffect, useState } from 'react';
import {
    DateField,
    DeleteWithConfirmButton,
    EditButton,
    Labeled,
    ShowBase,
    ShowView,
    TabbedShowLayout,
    TextField,
    TextInput,
    TopToolbar,
    useRecordContext,
    useResourceContext,
} from 'react-admin';
import { arePropsEqual } from '../../common/helper';
import { JsonSchemaField } from '../../components/JsonSchema';
import { ShowPageTitle } from '../../components/PageTitle';
import { VersionsListWrapper } from '../../components/VersionsList';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { ModelIcon } from './icon';
import { getModelSpecUiSchema } from './types';
import { FlatCard } from '../../components/FlatCard';
import { MetadataField } from '../../components/MetadataField';
import { FileInfo } from '../../components/FileInfo';
import { DownloadButton } from '../../components/DownloadButton';
import { IdField } from '../../components/IdField';
import { JsonParamsWidget } from '../../jsonSchema/JsonParamsWidget';
import { LineageTabComponent } from '../../components/lineage/LineageTabComponent';
import { MetricsGrid } from '../../components/MetricsGrid';
import { ChipsField } from '../../components/ChipsField';

const ShowComponent = () => {
    const record = useRecordContext();

    return <ModelShowLayout record={record} />;
};

const ShowToolbar = () => {
    const record = useRecordContext();
    return (
    <TopToolbar>
        <BackButton />
        <EditButton style={{ marginLeft: 'auto' }} />
        {record?.status?.files?.length === 1 && (
            <DownloadButton source="spec.path" />
        )}
        <InspectButton fullWidth />
        <ExportRecordButton language="yaml" color="info" />
        <DeleteWithConfirmButton />
    </TopToolbar>
    )}
;
const getUiSpec = (kind: string) => {
    const uiSpec = getModelSpecUiSchema(kind) || {};
    //hide metrics field
    uiSpec['metrics'] = {
        'ui:widget': 'hidden',
    };
    uiSpec['parameters'] = {
        'ui:ObjectFieldTemplate': JsonParamsWidget,
        'ui:title': 'fields.parameters.title',
    };
    return uiSpec;
};
const ModelShowLayout = memo(function ModelShowLayout(props: { record: any }) {
    const { record } = props;
    const schemaProvider = useSchemaProvider();
    const resource = useResourceContext();
    const [spec, setSpec] = useState<any>();
    const kind = record?.kind || undefined;

    useEffect(() => {
        if (!schemaProvider) {
            return;
        }

        if (record) {
            schemaProvider.get(resource, record.kind).then(s => {
                setSpec(s);
            });
        }
    }, [record, schemaProvider, resource]);

    const metricsComparisonFilters = [
        <TextInput
            label="fields.name.title"
            source="q"
            alwaysOn
            resettable
            key={1}
        />,
    ];

    const metricsDatagridFields = [
        <TextField
            source="id"
            label="fields.name.id"
            sortable={false}
            key={'df1'}
        />,
        <DateField
            source="metadata.created"
            showTime
            label="fields.metadata.created"
            key={'df2'}
        />,
        <ChipsField
            label="fields.labels.title"
            source="metadata.labels"
            sortable={false}
            key={'df3'}
        />,
    ];

    if (!record) return <></>;
    return (
        <TabbedShowLayout
            syncWithLocation={false}
            record={record}
            sx={{
                '& .RaTabbedShowLayout-content': {
                    pb: 2,
                },
            }}
        >
            <TabbedShowLayout.Tab label="fields.summary">
                <Stack direction={'row'} spacing={3}>
                    <Labeled>
                        <TextField source="kind" />
                    </Labeled>

                    <Labeled>
                        <IdField source="id" />
                    </Labeled>
                </Stack>

                <IdField source="key" />

                <MetadataField />

                {spec && (
                    <JsonSchemaField
                        source="spec"
                        schema={{ ...spec.schema, title: 'Spec' }}
                        uiSchema={getUiSpec(kind)}
                        label={false}
                    />
                )}
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="fields.files.tab">
                <FileInfo />
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label={'fields.metrics.title'}>
                <MetricsGrid
                    record={record}
                    filter={{ name: record?.name, versions: 'all' }}
                    filters={metricsComparisonFilters}
                    datagridFields={metricsDatagridFields}
                />
            </TabbedShowLayout.Tab>
             <TabbedShowLayout.Tab label="pages.lineage.title">
                <LineageTabComponent  />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    );
}, arePropsEqual);

/**
 * This component overrides ShowView's default main area container.
 *
 * The max-width and min-width CSS properties play a critical role in determining
 * the width of the data grids contained within the schema and preview tabs.
 */
const StyledFlatCard = (props: { children: ReactNode }) => {
    const { children } = props;

    return (
        <FlatCard
            // Set the max width to 70vw and min width to 100%
            sx={{ maxWidth: '70vw', minWidth: '100%' }}
        >
            {children}
        </FlatCard>
    );
};

export const ModelShow = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ShowBase>
                <>
                    <ShowPageTitle icon={<ModelIcon fontSize={'large'} />} />
                    <ShowView
                        actions={<ShowToolbar />}
                        sx={{
                            width: '100%',
                            '& .RaShow-main': {
                                display: 'grid',
                                gridTemplateColumns: { lg: '1fr 350px' },
                                gridTemplateRows: {
                                    xs: 'repeat(1, 1fr)',
                                    lg: '',
                                },
                                gap: 2,
                            },
                        }}
                        component={StyledFlatCard}
                        aside={<VersionsListWrapper />}
                    >
                        <ShowComponent />
                    </ShowView>
                </>
            </ShowBase>
        </Container>
    );
};
