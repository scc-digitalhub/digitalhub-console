import {
    Labeled,
    RecordContextProvider,
    TextField,
    RaRecord,
    Identifier,
    useTranslate,
} from 'react-admin';
import { Chip, Divider, Stack } from '@mui/material';
import { TypeChips } from '../../../components/TypeChips';

type OpenAIDetailsProps = {
    record?: RaRecord<Identifier>;
};

export const OpenAIDetails = ({ record }: OpenAIDetailsProps) => {
    const openAIDetails = record?.status || {};
    const modelDetails = record?.status?.k8s?.Model || {};
    const translate = useTranslate(); // <--- hook for translations

    return (
        <Stack spacing={1}>
            <RecordContextProvider value={openAIDetails?.openai || {}}>
                <Labeled>
                    <TextField
                        source="baseUrl"
                        label="fields.openai.baseUrl.title"
                    />
                </Labeled>

                <Labeled>
                    <TextField
                        source="model"
                        label="fields.openai.model.title"
                    />
                </Labeled>

                <Labeled label="fields.openai.features.title">
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ flexWrap: 'wrap', alignItems: 'center' }}
                    >
                        {openAIDetails.openai.features.map((f, i) => (
                            <TypeChips
                                key={i}
                                record={{ id: `feature-${i}`, feature: f }}
                                source="feature"
                            />
                        ))}
                    </Stack>
                </Labeled>
            </RecordContextProvider>

            <RecordContextProvider value={openAIDetails?.service || {}}>
                <Labeled>
                    <TextField source="urls" label="fields.openai.urls.title" />
                </Labeled>
            </RecordContextProvider>

            <Divider />

            <RecordContextProvider value={modelDetails?.spec || {}}>
                <Labeled>
                    <TextField
                        source="engine"
                        label="fields.kubeai.engine.title"
                    />
                </Labeled>
                <Labeled>
                    <TextField source="url" label="fields.kubeai.url.title" />
                </Labeled>
                <Labeled>
                    <TextField
                        source="resourceProfile"
                        label="fields.kubeai.resourceProfile.title"
                    />
                </Labeled>
            </RecordContextProvider>

            <RecordContextProvider value={modelDetails?.status?.replicas || {}}>
                <Labeled label="fields.kubeai.replicas.title">
                    <Stack direction="row" spacing={2}>
                        <Chip
                            label={`${translate(
                                'fields.kubeai.replicas.all.title'
                            )}: ${modelDetails?.status?.replicas?.all ?? 0}`}
                            color="primary"
                            size="small"
                        />
                        <Chip
                            label={`${translate(
                                'fields.kubeai.replicas.ready.title'
                            )}: ${modelDetails?.status?.replicas?.ready ?? 0}`}
                            color="success"
                            size="small"
                        />
                    </Stack>
                </Labeled>
            </RecordContextProvider>
        </Stack>
    );
};
