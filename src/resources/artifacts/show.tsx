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
import { Container, Grid, Stack, Typography } from '@mui/material';
import { JsonSchemaField } from '@dslab/ra-jsonschema-input';
import {
    MetadataSchema,
    MetadataViewUiSchema,
    createMetadataViewUiSchema,
} from '../../common/schemas';
import { getArtifactSpec, getArtifactUiSpec } from './types';
import { memo, useEffect, useState } from 'react';
import { arePropsEqual } from '../../common/helper';
import { FlatCard } from '../../components/FlatCard';
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

const ArtifactShowLayout = memo(function ArtifactShowLayout(props: {
    record: any;
}) {
    const translate = useTranslate();
    const { record } = props;
    const kind = record?.kind || undefined;

    if (!record) return <></>;
    return (
        <SimpleShowLayout record={record}>
            <Typography variant="h6" gutterBottom>
                {translate('resources.artifacts.title')}
            </Typography>
            <Labeled>
                <TextField source="name" />
            </Labeled>
            <Stack direction={'row'} spacing={3}>
                <Labeled>
                    <TextField source="kind" />
                </Labeled>

                <Labeled>
                    <TextField source="id" />
                </Labeled>
            </Stack>

            <Labeled>
                <TextField source="key" />
            </Labeled>

            <JsonSchemaField
                source="metadata"
                schema={MetadataSchema}
                uiSchema={createMetadataViewUiSchema(record.metadata)}
            />

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
