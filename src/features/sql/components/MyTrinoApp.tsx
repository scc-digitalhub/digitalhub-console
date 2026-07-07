import { QueryEditor } from '@dslab/trino-query-ui';
import { useTheme } from '@mui/material/styles';
import useTrinoRequestHeaders from '../useTrinoRequestHeaders';
import { Alert } from '@mui/material';
import { StyledQueryEditorWrapper } from '../theme';

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
            <QueryEditor
                key={themeMode}
                theme={themeMode}
                height={800}
                requestHeaders={requestHeaders}
                baseUrl={trinoEndpoint}
            />
        </StyledQueryEditorWrapper>
    );
};

export default MyTrinoApp;