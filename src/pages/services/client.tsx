// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import {
    Typography,
    Button,
    TextField,
    MenuItem,
    CircularProgress,
    Collapse,
    IconButton,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
    Divider,
    Box,
    ListItemButton,
    styled,
    Autocomplete,
} from '@mui/material';
import { Add, Delete, ExpandMore } from '@mui/icons-material';
import {
    Labeled,
    RecordContextProvider,
    TabbedShowLayout,
    useDataProvider,
    useTranslate,
} from 'react-admin';
import AceEditor from 'react-ace';
import { JSONTree } from 'react-json-tree';

interface HttpClientProps {
    proxy?: string;
    urls: string[];
    fixedMethod?: string;
    fixedUrl?: string;
    fixedContentType?: string;
    showRequestBody?: boolean;
}

export const HttpClient = (props: HttpClientProps) => {
    const {
        proxy: proxyUrl = '/proxy',
        urls: availableUrls,
        fixedMethod,
        fixedUrl,
        fixedContentType,
        showRequestBody = true,
    } = props;

    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const [method, setMethod] = useState(fixedMethod || 'GET');
    const [url, setUrl] = useState(fixedUrl || availableUrls[0] || '');
    const [body, setBody] = useState('');
    const [headers, setHeaders] = useState([{ key: '', value: '' }]);
    const [contentType, setContentType] = useState(
        fixedContentType || 'application/json'
    );
    const [response, setResponse] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<any[]>([]);

    const handleHeaderChange = (
        index: number,
        field: string,
        value: string
    ) => {
        const updated = [...headers];
        updated[index][field] = value;
        setHeaders(updated);
    };
    const addHeader = () => setHeaders([...headers, { key: '', value: '' }]);

    const removeHeader = (index: number) => {
        setHeaders(headers.filter((_, i) => i !== index));
    };

    const sendRequest = async () => {
        if (!url) return alert('Please provide a URL');

        setLoading(true);
        setResponse(null);

        try {
            const fullHeaders = new Headers({
                'Content-Type': 'application/json',
            });

            headers.forEach(e => {
                if (e.key?.trim()) fullHeaders.set(e.key, e.value);
            });

            let fullBody = '';
            if (['POST', 'PUT', 'PATCH'].includes(method)) {
                if (body.trim()) {
                    if (contentType === 'application/json') {
                        try {
                            fullBody = JSON.stringify(JSON.parse(body));
                        } catch {
                            fullBody = body;
                            fullHeaders.set('Content-Type', 'text/plain');
                        }
                    } else {
                        fullBody = body;
                        fullHeaders.set('Content-Type', 'text/plain');
                    }
                }
            }

            fullHeaders.set('X-Proxy-URL', url);
            fullHeaders.set('X-Proxy-Method', method);

            // const res = await fetch(fullUrl, options);
            const fullUrl = (await dataProvider.apiUrl()) + proxyUrl;
            const res = await dataProvider.client(fullUrl, {
                method: 'POST',
                headers: fullHeaders,
                body: fullBody,
            });

            const contentTypeRes = res.headers.get('content-type') || '';
            let parsedBody;

            if (contentTypeRes.includes('application/json')) {
                parsedBody = res.json;
            } else {
                parsedBody = res.body;
            }

            //extract proxied headers
            let responseHeaders = {};
            if (res.headers) {
                const rh = Object.fromEntries(res.headers.entries());
                Object.keys(rh)
                    .filter(k => k.toLowerCase().startsWith('x-proxy-'))
                    .forEach(k => {
                        responseHeaders[k.substring(8)] = rh[k];
                    });
            }

            const responseObj = {
                status: res.status,
                statusText: res.statusText,
                headers: responseHeaders,
                body: parsedBody,
            };

            setResponse(responseObj);

            // Save to history
            const newEntry = {
                method,
                url,
                headers: [...headers],
                body,
                contentType,
                timestamp: new Date().toLocaleTimeString(),
            };
            setHistory([newEntry, ...history.slice(0, 9)]); // keep max 10
        } catch (err: any) {
            setResponse({ error: err.message });
        } finally {
            setLoading(false);
        }
    };

    const loadHistory = (entry: any) => {
        if (!fixedMethod) setMethod(entry.method);
        if (!fixedUrl) setUrl(entry.url);
        setHeaders(entry.headers);
        setBody(entry.body);
        if (!fixedContentType) setContentType(entry.contentType);
    };

    const shouldShowRequestBody =
        showRequestBody && ['POST', 'PUT', 'PATCH'].includes(method);

    return (
        <>
            <Box mb={1}>
                <Typography variant="h6" mb={1}>
                    {translate('pages.http-client.request')}
                </Typography>

                {/* History */}
                <Accordion sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography>
                            {translate('pages.http-client.history')}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {history.length === 0 ? (
                            <Typography color="text.secondary">
                                {translate('pages.http-client.noRequests')}
                            </Typography>
                        ) : (
                            <List dense>
                                {history.map((entry, idx) => (
                                    <React.Fragment key={idx}>
                                        <ListItem
                                            onClick={() => loadHistory(entry)}
                                            disablePadding
                                            disableGutters
                                        >
                                            <ListItemButton>
                                                <ListItemText
                                                    primary={`${entry.method} ${entry.url}`}
                                                    secondary={`${entry.timestamp}`}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                    </AccordionDetails>
                </Accordion>

                <div
                    style={{
                        display: 'flex',
                        gap: '8px',
                        marginBottom: '16px',
                    }}
                >
                    {fixedMethod ? (
                        <TextField
                            value={fixedMethod}
                            disabled
                            sx={{ width: 120 }}
                            label="Method"
                            size="small"
                        />
                    ) : (
                        <TextField
                            select
                            value={method}
                            onChange={e => setMethod(e.target.value)}
                            sx={{ width: 120 }}
                            label="Method"
                            size="small"
                        >
                            {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map(
                                m => (
                                    <MenuItem key={m} value={m}>
                                        {m}
                                    </MenuItem>
                                )
                            )}
                        </TextField>
                    )}

                    {fixedUrl ? (
                        <TextField
                            value={fixedUrl}
                            disabled
                            label={translate('pages.http-client.requestUrl')}
                            size="small"
                            fullWidth
                        />
                    ) : (
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
                    )}
                    <Button
                        variant="contained"
                        onClick={sendRequest}
                        disabled={loading}
                        sx={{ minWidth: 100 }}
                    >
                        {loading ? (
                            <CircularProgress size={20} />
                        ) : (
                            translate('pages.http-client.send')
                        )}
                    </Button>
                </div>

                {/* Headers (Collapsible) */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography>
                            {translate('pages.http-client.headers')}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {headers.map((h, index) => (
                            <Grid
                                container
                                spacing={1}
                                key={index}
                                sx={{ mb: 1 }}
                            >
                                <Grid size={5}>
                                    <TextField
                                        label={translate('fields.key.title')}
                                        value={h.key}
                                        onChange={e =>
                                            handleHeaderChange(
                                                index,
                                                'key',
                                                e.target.value
                                            )
                                        }
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                                <Grid size={5}>
                                    <TextField
                                        label={translate('fields.value.title')}
                                        value={h.value}
                                        onChange={e =>
                                            handleHeaderChange(
                                                index,
                                                'value',
                                                e.target.value
                                            )
                                        }
                                        fullWidth
                                        size="small"
                                    />
                                </Grid>
                                <Grid
                                    size={2}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <IconButton
                                        color="error"
                                        onClick={() => removeHeader(index)}
                                        disabled={headers.length === 1}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}
                        <Button
                            startIcon={<Add />}
                            onClick={addHeader}
                            size="small"
                            variant="outlined"
                        >
                            {translate('pages.http-client.addHeader')}
                        </Button>
                    </AccordionDetails>
                </Accordion>

                {/* Request Body Section */}
                {shouldShowRequestBody && (
                    <>
                        {fixedContentType ? (
                            <TextField
                                label="Content-Type"
                                value={fixedContentType}
                                disabled
                                sx={{ mt: 2, mb: 2 }}
                                size="small"
                            />
                        ) : (
                            <TextField
                                select
                                label="Content-Type"
                                value={contentType}
                                onChange={e => setContentType(e.target.value)}
                                sx={{ mt: 2, mb: 2 }}
                                size="small"
                            >
                                <MenuItem value="application/json">
                                    {translate(
                                        'pages.http-client.contentType.appjson'
                                    )}
                                </MenuItem>
                                <MenuItem value="text/plain">
                                    {translate(
                                        'pages.http-client.contentType.textplain'
                                    )}
                                </MenuItem>
                            </TextField>
                        )}
                        <Box sx={{ width: '100%', mb: 2 }}>
                            <Typography
                                variant="caption"
                                color="textSecondary"
                                sx={{ mb: 0.5, display: 'block' }}
                            >
                                {translate('pages.http-client.requestBody')}
                            </Typography>

                            <Box
                                sx={{
                                    border: '1px solid #c4c4c4',
                                    borderRadius: 1,
                                }}
                            >
                                <AceEditor
                                    mode="json"
                                    theme="github"
                                    name="request_body_editor"
                                    value={body}
                                    onChange={newVal => setBody(newVal)}
                                    width="100%"
                                    minLines={5}
                                    maxLines={25}
                                    placeholder={translate(
                                        'pages.http-client.jsonOrRaw'
                                    )}
                                />
                            </Box>
                        </Box>
                    </>
                )}
            </Box>
            <Divider />
            {/* Response */}
            <Collapse in={!!response}>
                <RecordContextProvider value={response}>
                    <Typography variant="h6" mt={2}>
                        {translate('pages.http-client.response')}
                    </Typography>
                    <TabbedShowLayout syncWithLocation={false}>
                        {typeof response?.body === 'object' && (
                            <TabbedShowLayout.Tab
                                label={translate('fields.preview')}
                            >
                                <Accordion
                                    defaultExpanded={false}
                                    sx={{ width: '100%', mb: 2 }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMore />}
                                        aria-controls="headers-content"
                                        id="headers-header"
                                    >
                                        <Typography variant="subtitle1">
                                            {translate(
                                                'pages.http-client.headers'
                                            )}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Box
                                            sx={{
                                                backgroundColor: '#002b36',
                                                px: 2,
                                                py: 1,
                                                width: '100%',
                                                overflowX: 'auto',
                                            }}
                                        >
                                            <JSONTree
                                                data={response.headers}
                                                hideRoot
                                            />
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                                <Labeled
                                    label={translate(
                                        'pages.http-client.response'
                                    )}
                                    fullWidth
                                >
                                    <Box
                                        sx={{
                                            backgroundColor: '#002b36',
                                            px: 2,
                                            py: 0,
                                            minHeight: '20vw',
                                        }}
                                    >
                                        <JSONTree data={response.body} />
                                    </Box>
                                </Labeled>
                            </TabbedShowLayout.Tab>
                        )}
                        <TabbedShowLayout.Tab label={translate('raw')}>
                            <div style={{ marginTop: '16px' }}>
                                {response?.error ? (
                                    <Typography color="error">
                                        {response.error}
                                    </Typography>
                                ) : (
                                    <>
                                        <Typography>
                                            Status:{' '}
                                            {response?.headers?.status ||
                                                response?.status +
                                                    '' +
                                                    response?.statusText}
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{ mt: 2 }}
                                        >
                                            Headers
                                        </Typography>
                                        <Pre>
                                            {JSON.stringify(
                                                response?.headers,
                                                null,
                                                2
                                            )}
                                        </Pre>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{ mt: 2 }}
                                        >
                                            Body
                                        </Typography>
                                        <Pre>
                                            {typeof response?.body === 'object'
                                                ? JSON.stringify(
                                                      response.body,
                                                      null,
                                                      2
                                                  )
                                                : response?.body}
                                        </Pre>
                                    </>
                                )}
                            </div>
                        </TabbedShowLayout.Tab>
                    </TabbedShowLayout>
                </RecordContextProvider>
            </Collapse>
        </>
    );
};

const Pre = styled('pre', {
    name: 'StyledPre',
})(({ theme }) => ({
    background: theme.palette['paper'],
    padding: '8px',
    borderRadius: '4px',
    maxHeight: '200px',
    overflow: 'auto',
}));
