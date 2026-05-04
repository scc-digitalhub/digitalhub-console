// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { QueryEditor } from 'trino-query-ui';
import trinoStyles from 'trino-query-ui/dist/index.css?inline';
import { Box, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import StorageIcon from '@mui/icons-material/Storage';
import { PageTitle } from '../../../common/components/layout/PageTitle';
import { scopeCss } from '../utils';
import trinoOverrides from '../sql.css?inline';
import { TRINO_DARK_VARS, TRINO_LIGHT_VARS } from '../theme';

const SCOPE = 'sql-editor-scope';
const BASE_STYLES = scopeCss(trinoStyles, SCOPE) + trinoOverrides;

const MyTrinoApp = () => {
    const { palette } = useTheme();
    const isDark = palette.mode === 'dark';

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100vh - 48px)',
                overflow: 'hidden',
            }}
        >
            <PageTitle
                text="SQL Editor"
                secondaryText="Query your data with Trino"
                icon={<StorageIcon fontSize="large" />}
            />
            <Paper
                variant="outlined"
                sx={{
                    flex: 1,
                    minHeight: 0,
                    overflow: 'hidden',
                    mx: 1,
                    mb: 1,
                    borderRadius: '5px',
                    borderColor: 'divider',
                }}
            >
                <style>{BASE_STYLES}</style>
                <div
                    className={SCOPE}
                    style={isDark ? TRINO_DARK_VARS : TRINO_LIGHT_VARS}
                >
                    <QueryEditor theme={isDark ? 'dark' : 'light'} />
                </div>
            </Paper>
        </Box>
    );
};

export default MyTrinoApp;