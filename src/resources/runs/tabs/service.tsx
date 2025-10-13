// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { ArrayField, Labeled, RecordContextProvider } from 'react-admin';
import { Box } from '@mui/material';
import { Stack } from '@mui/system';
import { IdField } from '../../../components/IdField';
import { OpenAIDetails } from './openai';

export const ServiceDetails = (props: { record: any }) => {
    const { record } = props;

    const service = record?.status?.service || {};
    const urls = record?.status?.service?.urls || [];

    return (
        <Stack spacing={2}>
            {record?.status?.openai && <OpenAIDetails record={record} />}
            <RecordContextProvider value={service}>
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
