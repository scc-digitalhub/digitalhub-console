import { Container, Stack } from '@mui/material';
import { ReactNode, memo, useEffect, useState } from 'react';
import {
    Labeled,
    ShowBase,
    ShowView,
    TabbedShowLayout,
    TextField,
    useRecordContext,
    useResourceContext,
} from 'react-admin';
import { arePropsEqual } from '../../common/helper';
import { JsonSchemaField } from '../../components/JsonSchema';
import { ShowPageTitle } from '../../components/PageTitle';
import { VersionsListWrapper } from '../../components/VersionsList';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { DataItemIcon } from './icon';
import { PreviewTabComponent } from './preview-table/PreviewTabComponent';
import { SchemaTabComponent } from './schema-table/SchemaTabComponent';
import { getDataItemSpecUiSchema } from './types';
import { FlatCard } from '../../components/FlatCard';
import { MetadataField } from '../../components/MetadataField';
import { FileInfo } from '../../components/FileInfo';
import { IdField } from '../../components/IdField';
import { LineageTabComponent } from '../../components/lineage/LineageTabComponent';
import { ShowToolbar } from '../../components/toolbars/ShowToolbar';

const ShowComponent = () => {
    const record = useRecordContext();

    return <DataItemShowLayout record={record} />;
};

const DataItemShowLayout = memo(function DataItemShowLayout(props: {
    record: any;
}) {
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
                        uiSchema={getDataItemSpecUiSchema(kind)}
                        label={false}
                    />
                )}
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="fields.files.tab">
                <FileInfo />
            </TabbedShowLayout.Tab>
            {kind && kind === 'table' && (
                <TabbedShowLayout.Tab label="resources.dataitems.tab.schema">
                    <SchemaTabComponent record={props.record} />
                </TabbedShowLayout.Tab>
            )}
            {kind && kind === 'table' && (
                <TabbedShowLayout.Tab label="resources.dataitems.tab.preview">
                    <PreviewTabComponent record={props.record} />
                </TabbedShowLayout.Tab>
            )}
            <TabbedShowLayout.Tab label="pages.lineage.title">
                <LineageTabComponent />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    );
},
arePropsEqual);

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

export const DataItemShow = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ShowBase>
                <>
                    <ShowPageTitle icon={<DataItemIcon fontSize={'large'} />} />
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
