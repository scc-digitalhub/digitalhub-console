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
import { IdField } from '../../../common/components/fields/IdField';

export const InferenceV2Details = ({
    record,
}: {
    record?: RaRecord<Identifier>;
}) => {
    const inferenceV2 = record?.status?.inference_v2 || {};

    return (
        <Stack spacing={2}>
            <RecordContextProvider value={inferenceV2 || {}}>
                <Labeled>
                    <IdField
                        source="baseUrl"
                        label="fields.openinference.baseUrl.title"
                    />
                </Labeled>

                <Stack direction={'row'} spacing={10} alignItems="center">
                    <Labeled>
                        <TextField
                            source="model"
                            label="fields.openinference.model.title"
                        />
                    </Labeled>
                </Stack>
            </RecordContextProvider>
        </Stack>
    );
};
