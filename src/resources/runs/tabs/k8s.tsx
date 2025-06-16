// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Labeled } from 'react-admin';
import { Box } from '@mui/material';
import { JSONTree } from 'react-json-tree';

export const K8sDetails = (props: { record: any }) => {
    const { record } = props;

    const json = record?.status?.k8s || {};

    return (
        <Labeled label="fields.k8s.title" fullWidth>
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
