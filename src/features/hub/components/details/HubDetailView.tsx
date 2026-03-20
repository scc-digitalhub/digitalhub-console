// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useState } from 'react';
import { Error as RaError } from 'react-admin';
import { Box, Divider, useTheme } from '@mui/material';
import MarkdownPreview from '@uiw/react-markdown-preview';
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
                        '& .wmde-markdown': {
                            '& pre, & code': {
                                whiteSpace: 'pre-wrap !important',
                            },
                            '& .copied': {
                                visibility: 'visible !important',
                            },
                        },
                    }}
                >
                    <MarkdownPreview
                        source={readme}
                        style={{
                            padding: 16,
                            borderRadius: 10,
                            backgroundColor:
                                theme.palette.mode === 'dark'
                                    ? 'rgba(255, 255, 255, 0.08)'
                                    : 'rgba(0, 0, 0, 0.04)',
                        }}
                        wrapperElement={{
                            'data-color-mode': theme.palette.mode,
                        }}
                    />
                </Box>
            )}
        </Box>
    );
};
