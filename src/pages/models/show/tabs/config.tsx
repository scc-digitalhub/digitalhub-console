// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0
import {
    Labeled,
    RecordContextProvider,
    TextField,
    RaRecord,
    Identifier,
} from 'react-admin';
import { Stack } from '@mui/material';
import { JSONTree } from 'react-json-tree';

export const ConfigJson = ({ record }: { record?: RaRecord<Identifier> }) => {
    const huggingface = record?.status?.huggingface || {};
    const config = huggingface?.config || {};

    return (
        <Stack spacing={2}>
            <RecordContextProvider value={huggingface || {}}>
                <Labeled label="fields.huggingface.modelid.title">
                    <TextField source="model_id" />
                </Labeled>
                <Labeled label="fields.config.title">
                    <JSONTree data={config} />
                </Labeled>
            </RecordContextProvider>
        </Stack>
    );
};
