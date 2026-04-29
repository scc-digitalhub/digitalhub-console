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
} from 'react-admin';
import { Chip, Stack } from '@mui/material';
import { IdField } from '../../../common/components/fields/IdField';
import { ChipsField } from '../../../common/components/fields/ChipsField';

type OpenAIDetailsProps = {
    record?: RaRecord<Identifier>;
};

export const OpenAIDetails = ({ record }: OpenAIDetailsProps) => {
    const openAIDetails = record?.status?.openai || {};
    const modelDetails = record?.status?.k8s?.Model || {};
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

                <Stack direction={'row'} spacing={10} alignItems="center">
                    <Labeled>
                        <TextField
                            source="model"
                            label="fields.openai.model.title"
                        />
                    </Labeled>
                    <Labeled>
                        <IdField
                            source="modelUrl"
                            label="fields.kubeai.url.title"
                        />
                    </Labeled>
                </Stack>

                <Labeled label="fields.openai.features.title">
                    <ChipsField source="features" />
                </Labeled>
                <Labeled>
                    <TextField
                        source="engine"
                        label="fields.kubeai.engine.title"
                    />
                </Labeled>
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
        </Stack>
    );
};
