import { QueryEditor } from '@scc-digitalhub/trino-query-ui';
import '@scc-digitalhub/trino-query-ui/dist/index.css';

function MyTrinoApp() {
    return <QueryEditor theme="light" height={800} />;
}

export default MyTrinoApp;
