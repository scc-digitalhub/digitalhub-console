// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useId, useRef, useState } from 'react';
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
    Divider,
    Box,
    Autocomplete,
    Chip,
    ChipProps,
} from '@mui/material';
import { Add, Delete, ExpandMore } from '@mui/icons-material';
import {
    RecordContextProvider,
    TabbedShowLayout,
    useRecordContext,
    useStore,
    useTheme,
    useTranslate,
} from 'react-admin';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-markdown';

import { useHttpClientProvider } from './HttpClientContext';
import {
    HttpClientRequest,
    HttpClientResponse,
} from './provider/HttpClientProvider';
import { HistoryBrowser, HistoryEntry } from './components/History';
import { JsonResponseViewer } from './components/JsonResponseViewer';
import { RawResponseViewer } from './components/RawResponseViewer';
import { HtmlResponseViewer } from './components/HtmlResponseViewer';

export const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;
export const CONTENT_TYPES = ['application/json', 'text/plain'] as const;

type Header = {
    key: string;
    value: string;
};

export interface HttpClientProps {
    urls: string[];
    allowedMethods?: (typeof METHODS)[number][];
    allowedContentTypes?: (typeof CONTENT_TYPES)[number][];
    allowHeaders?: boolean;
    showRequestBody?: boolean;
    historyKey?: string | false; // optional key to persist history in localStorage
}

export const HttpClient = (props: HttpClientProps) => {
    const {
        urls: availableUrls,
        allowedMethods = METHODS,
        allowedContentTypes = CONTENT_TYPES,
        showRequestBody = true,
        allowHeaders = true,
        historyKey,
    } = props;
    const methods: string[] = [...allowedMethods];
    const contentTypes: string[] = [...allowedContentTypes];

    const provider = useHttpClientProvider();
    const record = useRecordContext();
    const translate = useTranslate();
    const [theme] = useTheme();

    const [method, setMethod] = useState<string>(methods[0]);
    const [url, setUrl] = useState<string>(availableUrls[0] || '');
    const [body, setBody] = useState<string>('');
    const [headers, setHeaders] = useState<Header[]>([]);
    const [contentType, setContentType] = useState<string>(
        contentTypes?.[0] || 'text/plain'
    );
    const request = useRef<HttpClientRequest>();
    const [response, setResponse] = useState<HttpClientResponse | undefined>(
        undefined
    );
    const [loading, setLoading] = useState<boolean>(false);
    const instanceId = useId();
    const [localHistory, setLocalHistory] = useState<HistoryEntry[]>([]);
    const [storedHistory, setStoredHistory] = useStore<HistoryEntry[]>(
        historyKey || instanceId,
        []
    );
    const history = historyKey ? storedHistory : localHistory;
    const setHistory =
        historyKey == false
            ? () => []
            : historyKey
            ? setStoredHistory
            : setLocalHistory;

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
        setResponse(undefined);

        try {
            const reqHeaders = new Headers({});
            headers.forEach(e => {
                if (e.key?.trim()) reqHeaders.set(e.key, e.value);
            });
            const params = {
                headers: reqHeaders,
                body: body.trim(),
                contentType,
                meta: {
                    recordId: record?.id as string,
                },
            };

            request.current = {
                url,
                method,
                contentType,
                headers: reqHeaders,
                body,
            };
            const res = await provider[method.toLowerCase()](url, params);
            setResponse(res);

            // Save to history
            const newEntry: HistoryEntry = {
                request: {
                    url,
                    method,
                    contentType,
                    headers: Object.fromEntries(reqHeaders.entries()),
                    body,
                },
                response: {
                    ...res,
                    headers: res.headers
                        ? Object.fromEntries(res.headers.entries())
                        : undefined,
                },
                timestamp: new Date().toLocaleString(),
            };
            setHistory([newEntry, ...history.slice(0, 9)]); // keep max 10
        } catch (err: any) {
            setResponse({ error: err.message } as HttpClientResponse);
        } finally {
            setLoading(false);
        }
    };

    const loadHistory = (entry: HistoryEntry) => {
        //restore request context
        if (entry.request) {
            setMethod(
                methods.includes(entry.request.method)
                    ? entry.request.method
                    : methods[0]
            );
            setUrl(
                availableUrls.includes(entry.request.url)
                    ? entry.request.url
                    : availableUrls[0]
            );

            let headers: Header[] = [];

            Object.entries(entry.request.headers ?? {}).forEach(
                ([key, value]) => headers.push({ key, value })
            );

            setHeaders(headers);
            setBody(entry.request.body);
            setContentType(
                contentTypes.includes(entry.request.contentType)
                    ? entry.request.contentType
                    : contentTypes[0]
            );
        }

        //restore response context
        //rebuild Headers object from plain record
        let resHeaders = new Headers({});
        Object.entries(entry.response?.headers ?? {}).forEach(([key, value]) =>
            resHeaders.set(key, value)
        );

        setResponse({ ...entry.response, headers: resHeaders });
    };

    const clearHistory = () => {
        setHistory([]);
    };

    const removeHistoryEntry = (entry: HistoryEntry) => {
        const updated = history.filter(e => e !== entry);
        setHistory(updated);
    };

    const shouldShowRequestBody =
        showRequestBody && ['POST', 'PUT', 'PATCH'].includes(method);

    return (
        <>
            <Box mb={1}>
                <Typography variant="h6" mb={1}>
                    {translate('pages.http-client.request')}
                </Typography>

                {historyKey === false ? null : (
                    <HistoryBrowser
                        history={history}
                        onLoad={loadHistory}
                        onClear={clearHistory}
                        onRemove={removeHistoryEntry}
                    />
                )}

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
                    <TextField
                        select
                        value={method}
                        onChange={e => setMethod(e.target.value)}
                        sx={{ width: 120 }}
                        label="Method"
                        size="small"
                    >
                        {methods.map(m => (
                            <MenuItem key={m} value={m}>
                                {m}
                            </MenuItem>
                        ))}
                    </TextField>

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
                            translate('pages.http-client.send')
                        )}
                    </Button>
                </Box>

                {/* Headers (Collapsible) */}
                {allowHeaders && (
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
                                            label={translate(
                                                'fields.key.title'
                                            )}
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
                                            label={translate(
                                                'fields.value.title'
                                            )}
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
                                {translate('ra.action.add')}
                            </Button>
                        </AccordionDetails>
                    </Accordion>
                )}

                {/* Request Body Section */}
                {shouldShowRequestBody && (
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
                                    mode={
                                        contentType === 'application/json'
                                            ? 'json'
                                            : 'text'
                                    }
                                    theme={
                                        theme === 'dark' ? 'monokai' : 'github'
                                    }
                                    name="request_body_editor"
                                    value={body}
                                    onChange={newVal => setBody(newVal)}
                                    width="100%"
                                    minLines={10}
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
                <HttpResponseViewer
                    request={request.current}
                    response={response}
                />
            </Collapse>
        </>
    );
};

export const HttpResponseViewer = ({
    response,
    request,
}: {
    response: HttpClientResponse | undefined;
    request?: HttpClientRequest;
}) => {
    const translate = useTranslate();

    if (!response) return null;
    const contentType = response.headers?.get('content-type') || '';
    const isJson = contentType.includes('application/json') && response.json;
    const isHtml = contentType.includes('text/html') && response.body;
    return (
        <RecordContextProvider value={response}>
            <Typography variant="h6" mt={2}>
                {translate('pages.http-client.response')}
            </Typography>
            <TabbedShowLayout syncWithLocation={false}>
                {isJson && (
                    <TabbedShowLayout.Tab label={translate('fields.preview')}>
                        <JsonResponseViewer response={response} />
                    </TabbedShowLayout.Tab>
                )}

                {isHtml && (
                    <TabbedShowLayout.Tab label={translate('fields.preview')}>
                        <HtmlResponseViewer response={response} />
                    </TabbedShowLayout.Tab>
                )}

                <TabbedShowLayout.Tab label={translate('raw')}>
                    <RawResponseViewer response={response} />
                </TabbedShowLayout.Tab>
            </TabbedShowLayout>
        </RecordContextProvider>
    );
};

export const StatusBadge = ({
    status,
    size = 'small',
    ...props
}: { status: number | undefined } & Pick<ChipProps, 'size' | 'variant'>) => {
    if (!status) return null;

    const color = status >= 200 && status < 300 ? 'success' : 'error';

    return <Chip color={color} size={size} label={status} {...props} />;
};
