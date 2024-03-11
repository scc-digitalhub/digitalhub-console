import { JsonSchemaField } from '@dslab/ra-jsonschema-input';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Container, Grid, Typography } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import {
    DeleteWithConfirmButton,
    EditButton,
    Labeled,
    ShowBase,
    ShowView,
    TabbedShowLayout,
    TextField,
    TopToolbar,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { arePropsEqual } from '../../common/helper';
import { MetadataSchema } from '../../common/types';
import { FlatCard } from '../../components/FlatCard';
import { VersionsListWrapper } from '../../components/VersionsList';
import { ShowPageTitle } from '../../components/PageTitle';
import { PreviewTabComponent } from './preview-table/PreviewTabComponent';
import { SchemaTabComponent } from './schema-table/SchemaTabComponent';
import { DataItemSpecSchema, DataItemSpecUiSchema, getDataItemUiSpec } from './types';
import { BackButton } from '@dslab/ra-back-button';
import { ExportRecordButton } from '@dslab/ra-export-record-button';
import { InspectButton } from '@dslab/ra-inspect-button';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { DataItemIcon } from './icon';

const ShowComponent = () => {
     const resource = useResourceContext();
    const record = useRecordContext();
    const kind = record?.kind || undefined;
     const translate = useTranslate();
    const schemaProvider = useSchemaProvider();
    const [spec, setSpec] = useState<any>();

    useEffect(() => {
        if (!schemaProvider ) {
            return;
        }
        if (record) {
            schemaProvider.get(resource, record.kind).then(s => {
                console.log('spec', s);
                setSpec(s);
            });
        }
    }, [record, schemaProvider]);

    if (!record) return <></>;
    return (
        <TabbedShowLayout syncWithLocation={false} record={record}>
            <TabbedShowLayout.Tab label="resources.dataitem.tab.summary">
                <Grid>
                    <Typography variant="h6" gutterBottom>
                        {translate('resources.dataitem.summary.title')}
                    </Typography>

                    <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={6}>
                            <Labeled label="resources.dataitem.name">
                                <TextField source="name" />
                            </Labeled>
                        </Grid>
                        <Grid item xs={6}>
                            <Labeled label="resources.dataitem.kind">
                                <TextField source="kind" />
                            </Labeled>
                        </Grid>
                    </Grid>

                    <JsonSchemaField
                        source="metadata"
                        schema={MetadataSchema}
                    />
                    {spec && (
                        <JsonSchemaField
                            source="spec"
                            schema={spec.schema}
                            uiSchema={getDataItemUiSpec(kind)}
                            label={false}
                        />
                    )}
                </Grid>
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="resources.dataitem.tab.schema">
                <SchemaTabComponent record={record} />
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="resources.dataitem.tab.preview">
                <PreviewTabComponent record={record} />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    );
}


const ShowToolbar = () => (
    <TopToolbar>
        <BackButton />
        <EditButton style={{ marginLeft: 'auto' }} />
        <InspectButton />
        <ExportRecordButton language="yaml" />
        <DeleteWithConfirmButton />
    </TopToolbar>
);

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
                    component={FlatCard}
                    aside={<VersionsListWrapper />}
                >
                    <ShowComponent />
                </ShowView>
            </>
        </ShowBase>
    </Container>
    );
};
