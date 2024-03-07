import { JsonSchemaField } from '@dslab/ra-jsonschema-input';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Container, Grid, Typography } from '@mui/material';
import { memo } from 'react';
import {
    Labeled,
    ShowBase,
    ShowView,
    TabbedShowLayout,
    TextField,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { arePropsEqual } from '../../common/helper';
import { MetadataSchema } from '../../common/types';
import { ShowOutlinedCard } from '../../components/OutlinedCard';
import { Aside, PostShowActions } from '../../components/helper';
import { ShowPageTitle } from '../../components/pageTitle';
import { PreviewTabComponent } from './preview-table/PreviewTabComponent';
import { SchemaTabComponent } from './schema-table/SchemaTabComponent';
import { DataItemSpecSchema, DataItemSpecUiSchema } from './types';

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

                    <JsonSchemaField
                        source="spec"
                        schema={DataItemSpecSchema}
                        uiSchema={DataItemSpecUiSchema}
                        label="resources.dataitem.summary.spec.title"
                    />
                </Grid>
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="resources.dataitem.tab.schema">
                <SchemaTabComponent record={props.record} />
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="resources.dataitem.tab.preview">
                <PreviewTabComponent record={props.record} />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    );
},
arePropsEqual);

export const DataItemShow = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ShowBase>
                <>
                    <ShowPageTitle
                        icon={<VisibilityIcon fontSize={'large'} />}
                    />
                    <ShowView
                        actions={<PostShowActions />}
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
                        component={ShowOutlinedCard}
                        aside={<Aside />}
                    >
                        <ShowComponent />
                    </ShowView>
                </>
            </ShowBase>
        </Container>
    );
};
