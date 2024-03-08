import {
    DeleteWithConfirmButton,
    EditButton,
    Labeled,
    Show,
    ShowBase,
    ShowView,
    SimpleShowLayout,
    TextField,
    TopToolbar,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import { Container, Grid, Typography } from '@mui/material';
import { JsonSchemaField } from '@dslab/ra-jsonschema-input';
import { MetadataSchema } from '../../common/types';
import { getArtifactSpec, getArtifactUiSpec } from './types';
import { memo, useEffect, useState } from 'react';
import { arePropsEqual } from '../../common/helper';
import { ShowOutlinedCard } from '../../components/OutlinedCard';
import { ShowPageTitle } from '../../components/PageTitle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { BackButton } from '@dslab/ra-back-button';
import { ExportRecordButton } from '@dslab/ra-export-record-button';
import { InspectButton } from '@dslab/ra-inspect-button';
import { VersionsListWrapper } from '../../components/VersionsList';

const ShowComponent = () => {
    const record = useRecordContext();

    return <ArtifactShowLayout record={record} />;
};

const ShowToolbar = () => (
    <TopToolbar>
        <BackButton />
        <EditButton style={{ marginLeft: 'auto' }} />
        <InspectButton />
        <ExportRecordButton language="yaml" />
        <DeleteWithConfirmButton />
    </TopToolbar>
);

export const ArtifactShowLayout = memo(function ArtifactShowLayout(props: {
    record: any;
}) {
    const translate = useTranslate();
    const { record } = props;
    const kind = record?.kind || undefined;

    if (!record) return <></>;
    return (
        <SimpleShowLayout record={record}>
            <Typography variant="h6" gutterBottom>
                {translate('resources.artifact.title')}
            </Typography>
            <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item xs={6}>
                    <Labeled label="My Label">
                        <TextField source="name" />
                    </Labeled>
                </Grid>
                <Grid item xs={6}>
                    <Labeled label="My Label">
                        <TextField source="kind" />
                    </Labeled>
                </Grid>
            </Grid>
            <JsonSchemaField source="metadata" schema={MetadataSchema} />
            <JsonSchemaField
                source="spec"
                schema={getArtifactSpec(kind)}
                uiSchema={getArtifactUiSpec(kind)}
                label={false}
            />
        </SimpleShowLayout>
    );
},
arePropsEqual);

const Aside = () => {
    const record = useRecordContext();
    return <VersionsListWrapper record={record} />;
};

export const ArtifactShow = () => {
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
