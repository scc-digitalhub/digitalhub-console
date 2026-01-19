// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0
import {
    Labeled,
    RecordContextProvider,
    TextField,
    RaRecord,
    Identifier,
    useTranslate,
    ArrayField,
} from 'react-admin';
import { Box, Chip, Divider, Stack } from '@mui/material';
import { IdField } from '../../../../../common/components/fields/IdField';
import { ChipsField } from '../../../../../common/components/fields/ChipsField';

type OpenAIDetailsProps = {
    record?: RaRecord<Identifier>;
};

export const OpenAIDetails = ({ record }: OpenAIDetailsProps) => {
    const openAIDetails = record?.status?.openai || {};
    const modelDetails = record?.status?.k8s?.Model || {};
    const urls = record?.status?.service?.urls || [];
    const translate = useTranslate();

    return (
        <Stack spacing={2}>
            <RecordContextProvider value={openAIDetails || {}}>
                <Labeled>
                    <IdField
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
                    <ChipsField source="features" />
                </Labeled>

                <Divider />

                <Stack direction={'row'} spacing={10} alignItems="center">
                    <Labeled>
                        <TextField
                            source="engine"
                            label="fields.kubeai.engine.title"
                        />
                    </Labeled>
                    <Labeled>
                        <IdField
                            source="modelUrl"
                            label="fields.kubeai.url.title"
                        />
                    </Labeled>
                </Stack>
            </RecordContextProvider>

            <RecordContextProvider value={modelDetails?.spec || {}}>
                <Labeled>
                    <TextField
                        source="resourceProfile"
                        label="fields.kubeai.resourceProfile.title"
                    />
                </Labeled>
                <Labeled label="fields.kubeai.replicas.title">
                    <Stack direction="row" spacing={2}>
                        <Chip
                            label={`${translate(
                                'fields.kubeai.replicas.ready.title'
                            )}: ${modelDetails?.status?.replicas?.ready ?? 0}`}
                            color={
                                modelDetails?.status?.replicas?.ready > 0
                                    ? 'success'
                                    : 'default'
                            }
                            size="small"
                        />
                    </Stack>
                </Labeled>
            </RecordContextProvider>
            <RecordContextProvider value={record?.status?.service}>
                {urls.length > 0 && (
                    <Labeled label="fields.service.urls.title">
                        <ArrayField source="urls">
                            <Stack spacing={1}>
                                {urls.map((url, index) => (
                                    <Box key={index} sx={{ ml: 2 }}>
                                        <IdField
                                            source="url"
                                            record={{ url }}
                                        />
                                    </Box>
                                ))}
                            </Stack>
                        </ArrayField>
                    </Labeled>
                )}
            </RecordContextProvider>
        </Stack>
    );
};
