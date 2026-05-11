import { QueryEditor } from '@scc-digitalhub/trino-query-ui';
import '@scc-digitalhub/trino-query-ui/dist/index.css';
import { useTheme } from '@mui/material/styles';
import useTrinoRequestHeaders from '../useTrinoRequestHeaders';

const MyTrinoApp = () => {
    const theme = useTheme();
    const themeMode = theme.palette.mode === 'dark' ? 'dark' : 'light';
    const requestHeaders = useTrinoRequestHeaders();

    return (
        <QueryEditor
            key={themeMode}
            theme={themeMode}
            height={800}
            requestHeaders={requestHeaders}
        />
    );
};

export default MyTrinoApp;
