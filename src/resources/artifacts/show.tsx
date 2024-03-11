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
import { Container, Stack, Typography } from '@mui/material';
import { JsonSchemaField } from '@dslab/ra-jsonschema-input';
import {
    MetadataSchema,
} from '../../common/types';
import { getArtifactUiSpec } from './types';
import { useEffect, useState } from 'react';
import { FlatCard } from '../../components/FlatCard';
import { ShowPageTitle } from '../../components/PageTitle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { BackButton } from '@dslab/ra-back-button';
import { ExportRecordButton } from '@dslab/ra-export-record-button';
import { InspectButton } from '@dslab/ra-inspect-button';
import { VersionsListWrapper } from '../../components/VersionsList';
import { useSchemaProvider } from '../../provider/schemaProvider';

const ShowComponent = () => {
      const resource = useResourceContext();
    const record = useRecordContext();
    const translate = useTranslate();
    const kind = record?.kind || undefined;
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
        <SimpleShowLayout record={record}>
            <Typography variant="h6" gutterBottom>
                {translate('resources.artifact.title')}
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
            />{spec && (
                        <JsonSchemaField
                            source="spec"
                            schema={spec.schema}
                            uiSchema={getArtifactUiSpec(kind)}
                            label={false}
                        />
                    )}
        </SimpleShowLayout>
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
                        aside={<VersionsListWrapper />}
                    >
                        <ShowComponent />
                    </ShowView>
                </>
            </ShowBase>
        </Container>
    );
};
