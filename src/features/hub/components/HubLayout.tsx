// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import { useCreatePath, useListContext, useTranslate } from 'react-admin';
import { Container } from '@mui/material';
import { DataObject } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { PageTitle } from '../../../common/components/layout/PageTitle';
import { FlatCard } from '../../../common/components/layout/FlatCard';
import { HubDetailView } from './details/HubDetailView';
import { HubDetailToolbar } from './details/HubDetailToolbar';
import { HubListView } from './list/HubListView';
import { toRepositoryAssetUrl } from '../utils';

interface HubLayoutProps {
    showTypeFilter?: boolean; 
    resourceName?: string;
    icon?: React.ReactElement;
}

export const HubLayout = ({
    showTypeFilter = false,
    resourceName,            
    icon = <DataObject fontSize="large" />,
}: HubLayoutProps) => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const createPath = useCreatePath();
    const { selectedTemplate, setSelectedTemplate } = useListContext() as any;

    const pageTitle = useMemo(() => {
        if (resourceName) {
            return translate(`pages.hub.title_${resourceName}`, {
                _: translate('pages.hub.title'),
            });
        }
        return translate('pages.hub.title');
    }, [resourceName, translate]);

    const pageSubtitle = useMemo(() => {
        if (resourceName) {
            return translate(`pages.hub.subtitle_${resourceName}`, {
                _: translate('pages.hub.subtitle'),
            });
        }
        return translate('pages.hub.subtitle');
    }, [resourceName, translate]);

    const handleImport = (template: any) => {
        const type = template.resourceType;
        const resource = template.resourceName;

        if (type === 'projects') {
            const path =
                createPath({ resource: 'projects', type: 'list' }) +
                '/projectimport';
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
                icon={icon}
            />

            {/* toolbar contestuale: detail o list */}
            {selectedTemplate ? (
                <HubDetailToolbar
                    template={selectedTemplate}
                    onBack={() => setSelectedTemplate(null)}
                    onImport={handleImport}
                    onNotebookDownload={handleNotebookDownload}
                />
            ) : null}

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
                    <HubDetailView template={selectedTemplate} />
                ) : (
                    <HubListView showTypeFilter={showTypeFilter} />
                )}
            </FlatCard>
        </Container>
    );
};