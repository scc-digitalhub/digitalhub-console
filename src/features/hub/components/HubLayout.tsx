// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler

// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useState } from 'react';
import {
    Button as RaButton,
    Error as RaError,
    useCreatePath,
    useListContext,
    
    useTranslate,
} from 'react-admin';
import { Box, Container, Divider, useTheme } from '@mui/material';
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
import { useNavigate } from 'react-router';

const HubTemplateDetail = ({ template }: { template: any }) => {
    const [readme, setReadme] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const theme= useTheme();
    const readmeUrl = useMemo(
        () => toRepositoryAssetUrl(template?.metadata?.repository, 'README.md'),
        [template?.metadata?.repository]
    );

    // Fetch README content when template or its repository changes
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

//show type filter in the filter bar
//resource type used for set title, subtitle and description
export const HubLayout = ({
    showTypeFilter = false,
    resourceType

}: {
    showTypeFilter?: boolean;
    resourceType?: string;

}) => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const createPath = useCreatePath();
    const { availableFilters, hubInfo, selectedTemplate, setSelectedTemplate } =
        useListContext() as any;
        //set title, subtitle and description based on resource type if provided
        // otherwise use hubInfo (?) or default translation
        const pageTitle = useMemo(() => {
            if (resourceType) {
                return translate(`pages.hub.title_${resourceType}`, {
                    _: translate('pages.hub.title', { _: resourceType }),
                });
            }
            return hubInfo?.name || translate('pages.hub.title');
        }, [resourceType, hubInfo, translate]);
    
        const pageSubtitle = useMemo(() => {
            if (resourceType) {
                return translate(`pages.hub.subtitle_${resourceType}`, {
                    _: translate('pages.hub.subtitle'),
                });
            }
            return hubInfo?.description || translate('pages.hub.subtitle');
        }, [resourceType, hubInfo, translate]);

        //function to handle import
        // if resourceType is projects, navigate to projectimport
        // otherwise navigate to create of the resource with the template in state
        const handleImport = (template: any) => {
            const resource = template.resourceType || 'functions';
    
            if (template.resourceType === 'projects') {
                const path = createPath({ resource: 'projects', type: 'list' }) + '/projectimport';
                navigate(path, { state: { hubTemplate: template } });
                return;
            }
    
            const path = createPath({ resource, type: 'create' });
            navigate(path, { state: { hubTemplate: template } });
        };
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
                            onClick={() => handleImport(selectedTemplate)}
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
                {/* Show template details if a template is selected, 
                otherwise show the list and filters */}

                {selectedTemplate ? (
                    <HubTemplateDetail template={selectedTemplate} />
                ) : (
                    <>
                        <HubFilterBar
                            availableFilters={availableFilters}
                            showTypeFilter={showTypeFilter}
                        />{' '}
                        <HubCardList
                            onSelectTemplate={setSelectedTemplate}
                            selectedTemplate={selectedTemplate}
                            showType={showTypeFilter}
                        />
                    </>
                )}
            </FlatCard>
        </Container>
    );
};
