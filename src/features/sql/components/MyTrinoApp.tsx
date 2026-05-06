import { QueryEditor } from '@scc-digitalhub/trino-query-ui';
import '@scc-digitalhub/trino-query-ui/dist/index.css';
import { useTheme } from '@mui/material/styles';
import { useAuthProvider } from 'react-admin';

const MyTrinoApp = () => {
    const theme = useTheme();
    const themeMode = theme.palette.mode === 'dark' ? 'dark' : 'light';
    const authProvider = useAuthProvider();

    const getAuthorizationHeader = async (): Promise<string | null> => {
        try {
            const header = await (authProvider as any)?.getAuthorization?.();
            return typeof header === 'string' ? header : null;
        } catch {
            return null;
        }
    };

    return (
        <QueryEditor
            key={themeMode}
            theme={themeMode}
            height={800}
            getAuthorizationHeader={getAuthorizationHeader}
        />
    );
};

export default MyTrinoApp;
