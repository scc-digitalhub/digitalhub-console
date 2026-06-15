import { QueryEditor } from 'trino-query-ui';
import trinoCSS from 'trino-query-ui/dist/index.css?raw';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '@mui/material/styles';
import useTrinoRequestHeaders from '../useTrinoRequestHeaders';
import { Alert } from '@mui/material';

const trinoEndpoint: string =
    (globalThis as any).REACT_APP_TRINO_ENDPOINT ||
    (process.env.REACT_APP_TRINO_ENDPOINT as string) ||
    false;

const ShadowQueryEditor = ({
    themeMode,
    requestHeaders,
    endpoint,
}: {
    themeMode: 'dark' | 'light';
    requestHeaders: Record<string, string>;
    endpoint: string;
}) => {
    const hostRef = useRef<HTMLDivElement>(null);
    const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);

    useEffect(() => {
        if (hostRef.current && !hostRef.current.shadowRoot) {
            const shadow = hostRef.current.attachShadow({ mode: 'open' });
            const style = document.createElement('style');
            style.textContent = trinoCSS;
            shadow.appendChild(style);
            setShadowRoot(shadow);
        }
    }, []);

    return (
        <div ref={hostRef}>
            {shadowRoot &&
                createPortal(
                    <QueryEditor
                        key={themeMode}
                        theme={themeMode}
                        height={800}
                        requestHeaders={requestHeaders}
                        endpoint={endpoint}
                    />,
                    shadowRoot
                )}
        </div>
    );
};

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
        <ShadowQueryEditor
            themeMode={themeMode}
            requestHeaders={requestHeaders}
            endpoint={trinoEndpoint}
        />
    );
};

export default MyTrinoApp;
