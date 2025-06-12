// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Labeled } from 'react-admin';
import { Box } from '@mui/material';
import { JSONTree } from 'react-json-tree';

export const OpenAIDetails = (props: { record: any }) => {
    const { record } = props;

    const json = record?.status?.openai || {};

    return (
        <Labeled label="fields.openai.title" fullWidth>
            <Box
                sx={{
                    backgroundColor: '#002b36',
                    px: 2,
                    py: 0,
                    minHeight: '20vw',
                }}
            >
                <JSONTree data={json} hideRoot />
            </Box>
        </Labeled>
    );
};
