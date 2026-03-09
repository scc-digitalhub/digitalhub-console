// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler

// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useState } from 'react';
import {
    Button as RaButton,
    Error as RaError,
    useListContext,
    useTranslate,
} from 'react-admin';
import { Box, Container, Divider } from '@mui/material';
import {
    DataObject,
    Code as CodeIcon,
    Add as ContentAdd,
    ArrowBack as ArrowBackIcon,
    Download as DownloadIcon,
} from '@mui/icons-material';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { PageTitle } from '../../../common/components/layout/PageTitle';
import { FlatCard } from '../../../common/components/layout/FlatCard';
import { HubFilterBar } from './HubFilterBar';
import { HubCardList, HubTemplateSummary } from './HubCardList';
import { toRepositoryAssetUrl } from '../utils';
import { Spinner } from '../../../common/components/layout/Spinner';

const HubTemplateDetail = ({ template }: { template: any }) => {
    const [readme, setReadme] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

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
            <HubTemplateSummary template={template} variant="header" />
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
                    <MarkdownPreview source={readme} />
                </Box>
            )}
        </Box>
    );
};

export const HubLayout = () => {
    const translate = useTranslate();

    const { availableFilters, hubInfo, selectedTemplate, setSelectedTemplate } =
        useListContext() as any;

    const pageTitle = hubInfo?.name || translate('pages.hub.title');
    const pageSubtitle =
        hubInfo?.description || translate('pages.hub.subtitle');

    const handleNotebookDownload = async () => {
        const url = toRepositoryAssetUrl(
            selectedTemplate?.metadata?.repository,
            'notebook.ipynb'
        );
        if (!url) return;

        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error();

            const blobUrl = window.URL.createObjectURL(await res.blob());
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `${selectedTemplate?.name || 'notebook'}.ipynb`;
            a.click();
            window.URL.revokeObjectURL(blobUrl);
        } catch {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <Container maxWidth={false} sx={{ pb: 2, overflowX: 'hidden' }}>
            <PageTitle
                text={pageTitle}
                secondaryText={pageSubtitle}
                icon={<DataObject fontSize="large" />}
            />

            {selectedTemplate && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', md: 'center' },
                        gap: 1,
                        flexWrap: 'wrap',
                        mb: 1,
                        px: 1,
                        width: '100%',
                    }}
                >
                    <RaButton
                        size="small"
                        color="primary"
                        label="ra.action.back"
                        onClick={() => setSelectedTemplate(null)}
                    >
                        <ArrowBackIcon fontSize="small" />
                    </RaButton>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <RaButton
                            size="small"
                            variant="text"
                            color="primary"
                            label="actions.import_one"
                        >
                            <ContentAdd />
                        </RaButton>

                        {selectedTemplate.metadata?.repository && (
                            <>
                                <RaButton
                                    size="small"
                                    variant="text"
                                    color="info"
                                    label="Notebook"
                                    onClick={handleNotebookDownload}
                                >
                                    <DownloadIcon />
                                </RaButton>
                                <RaButton
                                    size="small"
                                    variant="text"
                                    color="primary"
                                    label="Repository"
                                    onClick={() =>
                                        window.open(
                                            selectedTemplate.metadata
                                                .repository,
                                            '_blank',
                                            'noopener,noreferrer'
                                        )
                                    }
                                >
                                    <CodeIcon fontSize="small" />
                                </RaButton>
                            </>
                        )}
                    </Box>
                </Box>
            )}

            <FlatCard
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    p: 2,
                    width: '100%',
                    overflowX: 'hidden',
                    boxSizing: 'border-box',
                }}
            >
                {selectedTemplate ? (
                    <HubTemplateDetail template={selectedTemplate} />
                ) : (
                    <>
                        <HubFilterBar availableFilters={availableFilters} />
                        <HubCardList
                            onSelectTemplate={setSelectedTemplate}
                            selectedTemplate={selectedTemplate}
                        />
                    </>
                )}
            </FlatCard>
        </Container>
    );
};
