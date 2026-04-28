// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Box,
    styled,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { Labeled, RecordContextProvider, useTranslate } from 'react-admin';
import { JSONTree } from 'react-json-tree';
import { HttpClientResponse } from '../HttpClientProvider';
import { StatusBadge } from '../HttpClient';

export const JsonResponseViewer = ({
    response,
}: {
    response: HttpClientResponse | undefined;
}) => {
    const translate = useTranslate();

    if (!response?.json) return null;

    return (
        <RecordContextProvider value={response}>
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
                    <CodeBlock>
                        <JSONTree
                            data={Object.fromEntries(
                                response?.headers?.entries() || []
                            )}
                            hideRoot
                        />
                    </CodeBlock>
                </AccordionDetails>
            </Accordion>
            <Labeled label={translate('pages.http-client.response')} fullWidth>
                <CodeBlock sx={{ minHeight: '20vw', px: 2 }}>
                    <JSONTree data={response.json} />
                </CodeBlock>
            </Labeled>
        </RecordContextProvider>
    );
};

const CodeBlock = styled(Box, {
    name: 'CodeBlock',
})(() => ({
    background: '#002b36',
    width: '100%',
    overflowX: 'auto',
    borderRadius: '4px',
}));
