// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Switch,
    Typography,
    styled,
} from '@mui/material';
import { Labeled, RecordContextProvider, useTranslate } from 'react-admin';
import { HttpClientResponse } from '../HttpClientProvider';
import { StatusBadge } from '../HttpClient';
import { useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import { JSONTree } from 'react-json-tree';
import { ExpandMore } from '@mui/icons-material';

export const HtmlResponseViewer = ({
    response,
}: {
    response: HttpClientResponse | undefined;
}) => {
    const translate = useTranslate();
    const [trusted, setTrusted] = useState(false);
    const [iframeHeight, setIframeHeight] = useState(200);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const handleIframeLoad = () => {
        const doc = iframeRef.current?.contentDocument;
        if (doc) {
            setIframeHeight(doc.documentElement.scrollHeight);
        }
    };

    if (!response) return null;

    //check content type
    const contentType = response.headers?.get('content-type') || '';
    if (!contentType.includes('text/html')) return null;

    return (
        <RecordContextProvider value={response}>
            <div style={{ marginTop: '16px' }}>
                {response?.error && (
                    <Typography color="error">{response.error}</Typography>
                )}
                <Labeled label={translate('pages.http-client.status')}>
                    <StatusBadge status={response.status} />
                </Labeled>
                <Accordion
                    defaultExpanded={false}
                    sx={{ width: '100%', mb: 2, mt: 1 }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="headers-content"
                        id="headers-header"
                    >
                        <Typography variant="subtitle1">
                            {translate('pages.http-client.headers')}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Pre>
                            <JSONTree
                                data={Object.fromEntries(
                                    response?.headers?.entries() || []
                                )}
                                hideRoot
                            />
                        </Pre>
                    </AccordionDetails>
                </Accordion>

                <Labeled label="pages.preview.trustContent">
                    <Switch
                        checked={trusted === true}
                        onChange={() => {
                            setTrusted(!trusted);
                        }}
                    />
                </Labeled>

                <Labeled
                    label={translate('pages.http-client.response')}
                    fullWidth
                >
                    <iframe
                        ref={iframeRef}
                        title="preview-ext"
                        srcDoc={
                            trusted
                                ? response.body
                                : DOMPurify.sanitize(response.body || '')
                        }
                        width={'100%'}
                        height={iframeHeight}
                        onLoad={handleIframeLoad}
                        style={{
                            border: '1px solid #dedede',
                            display: 'block',
                        }}
                    ></iframe>
                </Labeled>
            </div>
        </RecordContextProvider>
    );
};

const Pre = styled('pre', {
    name: 'StyledPre',
})(({ theme }) => ({
    background: theme.palette.background.default,
    padding: '8px',
    borderRadius: '4px',
    overflow: 'auto',
}));
