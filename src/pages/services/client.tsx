import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
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
} from '@mui/material';
import { Add, Delete, ExpandMore } from '@mui/icons-material';
import {
    Labeled,
    RecordContextProvider,
    TabbedShowLayout,
    useDataProvider,
    useTranslate,
} from 'react-admin';
import { JSONTree } from 'react-json-tree';

export const HttpClient = (props: { url?: string; proxy?: string }) => {
    const { url: urlProps = '', proxy: proxyUrl = '/proxy' } = props;
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const [method, setMethod] = useState('GET');
    const [url, setUrl] = useState(urlProps);
    const [body, setBody] = useState('');
    const [headers, setHeaders] = useState([{ key: '', value: '' }]);
    const [contentType, setContentType] = useState('application/json');
    const [response, setResponse] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<any[]>([]);

    const handleHeaderChange = (index, field, value) => {
        const updated = [...headers];
        updated[index][field] = value;
        setHeaders(updated);
    };
    const addHeader = () => setHeaders([...headers, { key: '', value: '' }]);

    const removeHeader = index => {
        setHeaders(headers.filter((_, i) => i !== index));
    };

    const sendRequest = async () => {
        if (!url) return alert('Please provide a URL');

        setLoading(true);
        setResponse(null);

        try {
            // const customHeaders = headers.reduce((acc, h) => {
            //     if (h.key.trim()) acc[h.key] = h.value;
            //     return acc;
            // }, {});

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

            const responseObj = {
                status: res.status,
                statusText: res.statusText,
                headers: Object.fromEntries(res.headers.entries()),
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
        } catch (err) {
            setResponse({ error: err.message });
        } finally {
            setLoading(false);
        }
    };

    const loadHistory = entry => {
        setMethod(entry.method);
        setUrl(entry.url);
        setHeaders(entry.headers);
        setBody(entry.body);
        setContentType(entry.contentType);
    };

    return (
        <>
            <Box mb={1}>
                <Typography variant="h6" mb={1}>
                    {translate("pages.http-client.request")}
                </Typography>

                {/* History */}
                <Accordion sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography>{translate("pages.http-client.history")}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {history.length === 0 ? (
                            <Typography color="text.secondary">
                                No requests yet.
                            </Typography>
                        ) : (
                            <List dense>
                                {history.map((entry, idx) => (
                                    <React.Fragment key={idx}>
                                        <ListItem
                                            button
                                            onClick={() => loadHistory(entry)}
                                            sx={{ py: 1 }}
                                        >
                                            <ListItemText
                                                primary={`${entry.method} ${entry.url}`}
                                                secondary={`${entry.timestamp}`}
                                            />
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
                    <TextField
                        select
                        value={method}
                        onChange={e => setMethod(e.target.value)}
                        sx={{ width: 120 }}
                        label="Method"
                        size="small"
                    >
                        {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map(m => (
                            <MenuItem key={m} value={m}>
                                {m}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Request URL"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        fullWidth
                        size="small"
                    />
                    <Button
                        variant="contained"
                        onClick={sendRequest}
                        disabled={loading}
                        sx={{ minWidth: 100 }}
                    >
                        {loading ? <CircularProgress size={20} /> : 'Send'}
                    </Button>
                </div>

                {/* Headers (Collapsible) */}
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography>Headers</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {headers.map((h, index) => (
                            <Grid
                                container
                                spacing={1}
                                key={index}
                                sx={{ mb: 1 }}
                            >
                                <Grid item xs={5}>
                                    <TextField
                                        label="Key"
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
                                <Grid item xs={5}>
                                    <TextField
                                        label="Value"
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
                                    item
                                    xs={2}
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
                            Add Header
                        </Button>
                    </AccordionDetails>
                </Accordion>

                {/* Request Body + Content-Type Selector */}
                {['POST', 'PUT', 'PATCH'].includes(method) && (
                    <>
                        <TextField
                            select
                            label="Content-Type"
                            value={contentType}
                            onChange={e => setContentType(e.target.value)}
                            sx={{ mt: 2, mb: 2 }}
                            size="small"
                        >
                            <MenuItem value="application/json">
                                application/json
                            </MenuItem>
                            <MenuItem value="text/plain">text/plain</MenuItem>
                        </TextField>
                        <TextField
                            label="Request Body"
                            multiline
                            minRows={6}
                            value={body}
                            onChange={e => setBody(e.target.value)}
                            fullWidth
                            placeholder="JSON or raw text"
                        />
                    </>
                )}
            </Box>
            <Divider />
            {/* Response */}
            <Collapse in={!!response}>
                <RecordContextProvider value={response}>
                    <Typography variant="h6" mt={2}>
                        {translate("pages.http-client.response")}
                    </Typography>

                    <TabbedShowLayout syncWithLocation={false}>
                        <TabbedShowLayout.Tab label={translate('raw')}>
                            <div style={{ marginTop: '16px' }}>
                                {response?.error ? (
                                    <Typography color="error">
                                        {response.error}
                                    </Typography>
                                ) : (
                                    <>
                                        <Typography>
                                            Status: {response?.status}{' '}
                                            {response?.statusText}
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{ mt: 2 }}
                                        >
                                            Headers
                                        </Typography>
                                        <pre
                                            style={{
                                                background: '#f5f5f5',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                maxHeight: '200px',
                                                overflow: 'auto',
                                            }}
                                        >
                                            {JSON.stringify(
                                                response?.headers,
                                                null,
                                                2
                                            )}
                                        </pre>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{ mt: 2 }}
                                        >
                                            Body
                                        </Typography>
                                        <pre
                                            style={{
                                                background: '#f5f5f5',
                                                padding: '8px',
                                                borderRadius: '4px',
                                                maxHeight: '400px',
                                                overflow: 'auto',
                                            }}
                                        >
                                            {typeof response?.body === 'object'
                                                ? JSON.stringify(
                                                      response.body,
                                                      null,
                                                      2
                                                  )
                                                : response?.body}
                                        </pre>
                                    </>
                                )}
                            </div>
                        </TabbedShowLayout.Tab>
                        {typeof response?.body === 'object' && (
                            <TabbedShowLayout.Tab
                                label={translate('fields.preview')}
                            >
                                <Labeled label="headers" fullWidth>
                                    <Box
                                        sx={{
                                            backgroundColor: '#002b36',
                                            px: 2,
                                            py: 0,
                                            minHeight: '2vw',
                                        }}
                                    >
                                        <JSONTree
                                            data={response.headers}
                                            hideRoot
                                        />
                                    </Box>
                                </Labeled>
                                <Labeled label="response" fullWidth>
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
                    </TabbedShowLayout>
                </RecordContextProvider>
            </Collapse>
        </>
    );
};
