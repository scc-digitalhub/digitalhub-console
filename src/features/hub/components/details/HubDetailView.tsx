// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useState } from 'react';
import { Error as RaError } from 'react-admin';
import { Box, Chip, Divider, Stack, useTheme } from '@mui/material';
import { MarkdownBody } from '../../../../common/components/MarkdownBody';
import { Spinner } from '../../../../common/components/layout/Spinner';
import { toRepositoryAssetUrl } from '../../utils';
import { HubDetailHeader } from './HubDetailHeader';

interface HubDetailViewProps {
    template: any;
}

export const HubDetailView = ({ template }: HubDetailViewProps) => {
    const [readme, setReadme] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const theme = useTheme();

    const readmeUrl = useMemo(
        () => toRepositoryAssetUrl(template?.metadata?.repository, 'README.md'),
        [template?.metadata?.repository]
    );

    useEffect(() => {
        if (!readmeUrl) {
            setReadme('');
            setLoading(false);
            setError(null);
            return;
        }

        const controller = new AbortController();
        setLoading(true);
        setError(null);

        fetch(readmeUrl, { signal: controller.signal })
            .then(res =>
                res.ok ? res.text() : Promise.reject(new Error('Not Found'))
            )
            .then(text => {
                if (!controller.signal.aborted) {
                    setReadme(text);
                    setLoading(false);
                }
            })
            .catch(err => {
                if (err.name !== 'AbortError' && !controller.signal.aborted) {
                    setReadme('');
                    setLoading(false);
                    setError(
                        err instanceof Error
                            ? err
                            : new Error('README fetch failed')
                    );
                }
            });

        return () => controller.abort();
    }, [readmeUrl]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                width: '100%',
                minWidth: 0,
                overflowX: 'hidden',
            }}
        >
            {template && (
                <Stack direction="row" spacing={1} mb={0}>
                    <Chip
                        label={template.resourceName}
                        size="small"
                        color={'primary'}
                        variant="outlined"
                        sx={{ mb: 1, fontSize: '0.7rem' }}
                    />
                    {template.kind &&
                        template.kind != template.resourceName &&
                        template.kind + 's' != template.resourceName && (
                            <Chip
                                label={template.kind}
                                size="small"
                                color={'secondary'}
                                variant="outlined"
                                sx={{ mb: 1, fontSize: '0.7rem' }}
                            />
                        )}
                </Stack>
            )}
            <HubDetailHeader template={template} />
            <Divider />
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <Spinner />
                </Box>
            ) : error ? (
                <RaError
                    error={error}
                    resetErrorBoundary={() => setError(null)}
                />
            ) : (
                <Box
                    sx={{
                        width: '100%',
                        minWidth: 0,
                        '& .wmde-markdown': {
                            maxWidth: '100%',
                            overflow: 'hidden',
                            '& p, & pre, & code': {
                                whiteSpace: 'pre-wrap !important',
                                overflowWrap: 'anywhere !important',
                                wordBreak: 'break-word !important',
                            },
                            '& pre': {
                                overflowX: 'auto',
                            },
                            '& .copied': {
                                visibility: 'visible !important',
                            },
                        },
                    }}
                >
                    <MarkdownBody
                        style={{
                            padding: 16,
                            borderRadius: 10,
                            backgroundColor:
                                theme.palette.mode === 'dark'
                                    ? 'rgba(255, 255, 255, 0.08)'
                                    : 'rgba(0, 0, 0, 0.04)',
                        }}
                    >
                        {readme}
                    </MarkdownBody>
                </Box>
            )}
        </Box>
    );
};
