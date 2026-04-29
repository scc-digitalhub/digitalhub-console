// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box, Divider } from '@mui/material';
import { K8sServiceDetails } from './k8sServiceDetails';
import { OpenAIDetails } from './openai';
import { InferenceV2Details } from './inferenceV2';

export const ServiceDetails = (props: { record: any }) => {
    const { record } = props;

    return (
        <Box>
            {record?.status?.openai && (
                <Box mb={2}>
                    <OpenAIDetails record={record} />
                    <Divider sx={{ mt: 2 }} />
                </Box>
            )}
            {record?.status?.inference_v2 && (
                <Box mb={2}>
                    <InferenceV2Details record={record} />
                    <Divider sx={{ mt: 2 }} />
                </Box>
            )}
            <K8sServiceDetails record={record} />
        </Box>
    );
};
