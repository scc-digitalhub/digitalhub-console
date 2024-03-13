import { BackButton } from '@dslab/ra-back-button';
import { ExportRecordButton } from '@dslab/ra-export-record-button';
import { InspectButton } from '@dslab/ra-inspect-button';
import { JsonSchemaField } from '@dslab/ra-jsonschema-input';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Container, Stack, Typography } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import {
    DeleteWithConfirmButton,
    EditButton,
    Labeled,
    ShowBase,
    ShowView,
    SimpleShowLayout,
    TextField,
    TopToolbar,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { arePropsEqual } from '../../common/helper';
import {
    MetadataSchema,
    createMetadataViewUiSchema,
} from '../../common/schemas';
import { FlatCard } from '../../components/FlatCard';
import { ShowPageTitle } from '../../components/PageTitle';
import { VersionsListWrapper } from '../../components/VersionsList';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { getArtifactSpecUiSchema } from './types';

const ShowComponent = () => {
    const record = useRecordContext();

    return <ArtifactShowLayout record={record} />;
};

const ShowToolbar = () => (
    <TopToolbar>
        <BackButton />
        <EditButton style={{ marginLeft: 'auto' }} />
        <InspectButton />
        <ExportRecordButton language="yaml" color="info" />
        <DeleteWithConfirmButton />
    </TopToolbar>
);

const ArtifactShowLayout = memo(function ArtifactShowLayout(props: {
    record: any;
}) {
    const { record } = props;
    const translate = useTranslate();
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
        <SimpleShowLayout record={record}>
            <Typography variant="h6" gutterBottom>
                {translate('resources.artifacts.fields.summary')}
            </Typography>

            <TextField source="name" />

            <Stack direction={'row'} spacing={3}>
                <Labeled>
                    <TextField source="kind" />
                </Labeled>

                <Labeled>
                    <TextField source="id" />
                </Labeled>
            </Stack>

            <TextField source="key" />

            <JsonSchemaField
                source="metadata"
                schema={MetadataSchema}
                uiSchema={createMetadataViewUiSchema(record?.metadata)}
                label={false}
            />

            {spec && (
                <JsonSchemaField
                    source="spec"
                    schema={spec.schema}
                    uiSchema={getArtifactSpecUiSchema(kind)}
                    label={false}
                />
            )}
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
