import { useMemo } from 'react';
import { QueryEditor } from 'trino-query-ui';
import trinoStyles from 'trino-query-ui/dist/index.css?inline';
import { Box, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import StorageIcon from '@mui/icons-material/Storage';
import { PageTitle } from '../../../common/components/layout/PageTitle';
import { scopeCss } from '../utils';
import {
    TRINO_DARK_VARS,
    TRINO_LIGHT_VARS,
    TRINO_LAYOUT,
    TRINO_COMPONENTS,
} from '../theme';

const SCOPE = 'sql-editor-scope';

const MyTrinoApp = () => {
    const { palette } = useTheme();
    const isDark = palette.mode === 'dark';

    const styles = useMemo(
        () =>
            scopeCss(trinoStyles, SCOPE) +
            TRINO_LAYOUT(SCOPE) +
            TRINO_COMPONENTS(SCOPE) +
            (isDark ? TRINO_DARK_VARS(SCOPE) : TRINO_LIGHT_VARS(SCOPE)),
        [isDark]
    );

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
                <style>{styles}</style>
                <div
                    className={SCOPE}
                    style={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    <QueryEditor theme={isDark ? 'dark' : 'light'} />
                </div>
            </Paper>
        </Box>
    );
};

export default MyTrinoApp;
