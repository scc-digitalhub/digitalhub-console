import { lazy, Suspense, ComponentType } from 'react';
import { useTheme } from '@mui/material/styles';
import useTrinoRequestHeaders from '../useTrinoRequestHeaders';
import { Alert } from '@mui/material';
import { StyledQueryEditorWrapper } from '../theme';

// Lazy-load the Trino query editor — it pulls in monaco-editor + the full
// ANTLR4 SQL parser (~12 MB raw) and should only be fetched when the SQL
// page is actually visited.
const QueryEditor = lazy(() =>
    import('@dslab/trino-query-ui').then(m => ({
        default: m.QueryEditor as ComponentType<any>,
    }))
);

const trinoEndpoint: string =
    (globalThis as any).REACT_APP_TRINO_URL ||
    (process.env.REACT_APP_TRINO_URL as string) ||
    false;

// Local testing
// const trinoEndpoint = ' ';

const MyTrinoApp = () => {
    const theme = useTheme();
    const themeMode = theme.palette.mode === 'dark' ? 'dark' : 'light';
    const requestHeaders = useTrinoRequestHeaders();

    if (!trinoEndpoint) {
        return (
            <Alert severity="warning">Trino endpoint is not configured.</Alert>
        );
    }

    return (
        <StyledQueryEditorWrapper>
            <Suspense fallback={null}>
                <QueryEditor
                    key={themeMode}
                    theme={themeMode}
                    height={800}
                    requestHeaders={requestHeaders}
                    baseUrl={trinoEndpoint}
                />
            </Suspense>
        </StyledQueryEditorWrapper>
    );
};

export default MyTrinoApp;
