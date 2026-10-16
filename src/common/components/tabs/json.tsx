// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0
import { useRecordContext } from 'react-admin';
import { Box } from '@mui/material';
import { JSONTree } from 'react-json-tree';

export const JsonTab = (props: { record?: any }) => {
    const record = useRecordContext(props);

    return (
        <Box>
            <JSONTree data={record || {}} />
        </Box>
    );
};
