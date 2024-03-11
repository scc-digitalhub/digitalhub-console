import { JsonSchemaField } from '@dslab/ra-jsonschema-input';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Container, Grid, Typography } from '@mui/material';
import { memo } from 'react';
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
    useTranslate,
} from 'react-admin';
import { arePropsEqual } from '../../common/helper';
import { MetadataSchema } from '../../common/schemas';
import { FlatCard } from '../../components/FlatCard';
import { VersionsListWrapper } from '../../components/VersionsList';
import { ShowPageTitle } from '../../components/PageTitle';
import { PreviewTabComponent } from './preview-table/PreviewTabComponent';
import { SchemaTabComponent } from './schema-table/SchemaTabComponent';
import { DataItemSpecSchema, DataItemSpecUiSchema } from './types';
import { BackButton } from '@dslab/ra-back-button';
import { ExportRecordButton } from '@dslab/ra-export-record-button';
import { InspectButton } from '@dslab/ra-inspect-button';

const ShowComponent = () => {
    const record = useRecordContext();

    return <DataItemShowLayout record={record} />;
};

const DataItemShowLayout = memo(function DataItemShowLayout(props: {
    record: any;
}) {
    const { record } = props;
    const translate = useTranslate();

    if (!record) return <></>;
    return (
        <TabbedShowLayout syncWithLocation={false} record={record}>
            <TabbedShowLayout.Tab label="resources.dataitems.tab.summary">
                <Grid>

                    <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={6}>
                            <Labeled>
                                <TextField source="name" />
                            </Labeled>
                        </Grid>
                        <Grid item xs={6}>
                            <Labeled>
                                <TextField source="kind" />
                            </Labeled>
                        </Grid>
                    </Grid>

                    <JsonSchemaField
                        source="metadata"
                        schema={MetadataSchema}
                    />

                    <JsonSchemaField
                        source="spec"
                        schema={DataItemSpecSchema}
                        uiSchema={DataItemSpecUiSchema}
                        label="resources.dataitems.summary.spec.title"
                    />
                </Grid>
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="resources.dataitems.tab.schema">
                <SchemaTabComponent record={props.record} />
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="resources.dataitems.tab.preview">
                <PreviewTabComponent record={props.record} />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    );
},
arePropsEqual);

const Aside = () => {
    const record = useRecordContext();
    return <VersionsListWrapper record={record} />;
};

const ShowToolbar = () => (
    <TopToolbar>
        <BackButton />
        <EditButton style={{ marginLeft: 'auto' }} />
        <InspectButton color="primary" />
        <ExportRecordButton language="yaml" />
        <DeleteWithConfirmButton />
    </TopToolbar>
);

export const DataItemShow = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ShowBase>
                <>
                    <ShowPageTitle
                        icon={<VisibilityIcon fontSize={'large'} />}
                    />
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
                        aside={<Aside />}
                    >
                        <ShowComponent />
                    </ShowView>
                </>
            </ShowBase>
        </Container>
    );
};
