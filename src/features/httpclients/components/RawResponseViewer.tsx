// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Typography, styled } from '@mui/material';
import { Labeled, RecordContextProvider, useTranslate } from 'react-admin';
import { HttpClientResponse } from '../HttpClientProvider';
import { StatusBadge } from '../HttpClient';

export const RawResponseViewer = ({
    response,
}: {
    response: HttpClientResponse | undefined;
}) => {
    const translate = useTranslate();
    if (!response) return null;

    return (
        <RecordContextProvider value={response}>
            <div style={{ marginTop: '16px' }}>
                {response?.error && (
                    <Typography color="error">{response.error}</Typography>
                )}
                <Labeled label={translate('pages.http-client.status')}>
                    <StatusBadge status={response.status} />
                </Labeled>
                <Labeled
                    label={translate('pages.http-client.headers')}
                    fullWidth
                >
                    <Pre>
                        {JSON.stringify(
                            Object.fromEntries(
                                response?.headers?.entries() || []
                            ),
                            null,
                            2
                        )}
                    </Pre>
                </Labeled>
                <Labeled
                    label={translate('pages.http-client.response')}
                    fullWidth
                >
                    <Pre>{response?.body || ''}</Pre>
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
