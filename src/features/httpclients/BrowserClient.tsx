// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRef, useState } from 'react';
import {
    Typography,
    Button,
    TextField,
    CircularProgress,
    Divider,
    Box,
    Autocomplete,
} from '@mui/material';
import { Labeled, useTranslate } from 'react-admin';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-markdown';

import { useHttpClientProvider } from './HttpClientContext';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

export const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;
export const CONTENT_TYPES = ['application/json', 'text/plain'] as const;

export interface BrowserClientProps {
    urls: string[];
}

export const BrowserClient = (props: BrowserClientProps) => {
    const { urls: availableUrls } = props;

    const provider = useHttpClientProvider();
    const translate = useTranslate();

    const [url, setUrl] = useState<string>(availableUrls[0] || '');
    const [loading, setLoading] = useState<boolean>(false);
    const [src, setSrc] = useState<string | undefined>();
    const [authorize, setAuthorize] = useState<boolean>(false);
    const [iframeHeight, setIframeHeight] = useState(400);
    const [iframeKey, setIframeKey] = useState(0);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const handleIframeLoad = () => {
        const doc = iframeRef.current?.contentDocument;
        if (doc) {
            setIframeHeight(doc.documentElement.scrollHeight);
        }
    };

    const sendRequest = async () => {
        if (!url) return alert('Please provide a URL');

        setLoading(true);

        if (!authorize) {
            //call authorize to set cookies if needed, then load
            try {
                const authorized = await provider.authorize?.(url);
                setAuthorize(authorized || false);
            } catch (err: any) {
                setAuthorize(false);
            }
        }

        try {
            const res = await provider.embed(url);
            setSrc(res);
            setIframeKey(k => k + 1);
        } catch (err: any) {
            setSrc(undefined);
        } finally {
            setLoading(false);
        }
    };

    const openAsNew = async () => {
        if (!url) return alert('Please provide a URL');

        setLoading(true);
        try {
            // Submit a hidden form POST to the auth endpoint targeting _blank.
            // This is a top-level browser navigation, so the cookie is set
            // first-party and is not subject to cookie partitioning (dFPI).
            await provider.openNew?.(url);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Box mb={1}>
                <Typography variant="h6" mb={1}>
                    {translate('pages.http-client.request')}
                </Typography>

                <Box
                    style={{
                        display: 'flex',
                        gap: '8px',
                        marginBottom: '16px',
                    }}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && !loading) sendRequest();
                    }}
                >
                    <Autocomplete
                        freeSolo
                        options={availableUrls}
                        value={url}
                        onChange={(event, newValue) => {
                            setUrl(newValue || '');
                        }}
                        onInputChange={(event, newInputValue) => {
                            setUrl(newInputValue);
                        }}
                        renderInput={params => (
                            <TextField
                                {...params}
                                label={translate(
                                    'pages.http-client.requestUrl'
                                )}
                                size="small"
                                fullWidth
                            />
                        )}
                    />

                    <Button
                        variant="contained"
                        onClick={sendRequest}
                        disabled={loading}
                        sx={{ minWidth: 100 }}
                    >
                        {loading ? (
                            <CircularProgress size={20} />
                        ) : (
                            translate('ra.action.open')
                        )}
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={openAsNew}
                        disabled={loading}
                    >
                        <OpenInNewIcon />
                    </Button>
                </Box>
            </Box>
            <Divider />
            {/* Response */}
            <Labeled label={translate('pages.http-client.response')} fullWidth>
                <iframe
                    key={iframeKey}
                    ref={iframeRef}
                    title="preview-ext"
                    src={src}
                    width={'100%'}
                    height={iframeHeight}
                    onLoad={handleIframeLoad}
                    style={{
                        border: '1px solid #dedede',
                        display: 'block',
                    }}
                ></iframe>
            </Labeled>
        </>
    );
};
