// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import {
    Confirm,
    Button as RaButton,
    useTranslate,
    TopToolbar,
    useDataProvider,
    useNotify,
} from 'react-admin';
import { useRootSelector } from '@dslab/ra-root-selector';
import {
    Code as CodeIcon,
    Add as ContentAdd,
    ArrowBack as ArrowBackIcon,
    Download as DownloadIcon,
} from '@mui/icons-material';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { useNavigate } from 'react-router';
import { useHubResources } from '../../useHubResources';
import { createItemWithChildren, loadProjectItems } from '../../utils';

interface HubDetailToolbarProps {
    template: any;
    onBack: () => void;
    onImport: (template: any) => void;
    onNotebookDownload: () => void;
    redirectPath?: string;
}

export const HubDetailToolbar = ({
    template,
    onBack,
    onImport,
    onNotebookDownload,
    redirectPath,
}: HubDetailToolbarProps) => {
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const { root } = useRootSelector();
    const navigate = useNavigate();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const hubResources = useHubResources();
    const catalogKeyToResource = Object.fromEntries(
        hubResources.map(r => [r.catalogKey, r.name])
    );
    const handleAddDirect = async () => {
        setConfirmOpen(false);
        setLoading(true);
        try {
            if (template.resourceName === 'projects') {
                // Scarica il YAML del progetto e usa i suoi item
                const items = template.metadata?.repository
                    ? await loadProjectItems(
                          template.metadata.repository,
                          catalogKeyToResource
                      )
                    : [];

                await Promise.all(
                    items.map(({ item, resourceName }) =>
                        createItemWithChildren(
                            item,
                            resourceName,
                            root || '',
                            dataProvider
                        )
                    )
                );
            } else {
                await createItemWithChildren(
                    template,
                    template.resourceName,
                    root || '',
                    dataProvider
                );
            }

            notify('pages.hub.add_direct_success', { type: 'info' });
            if (redirectPath) navigate(redirectPath);
        } catch (err: any) {
            notify('pages.hub.add_direct_error', {
                type: 'error',
                messageArgs: { error: err?.message || 'Error' },
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TopToolbar>
                <RaButton
                    size="small"
                    color="primary"
                    label="ra.action.back"
                    onClick={onBack}
                >
                    <ArrowBackIcon fontSize="small" />
                </RaButton>

                {/* import via stepper */}
                <RaButton
                    size="small"
                    variant="text"
                    color="primary"
                    label="actions.customize"
                    onClick={() => onImport(template)}
                    sx={{ marginLeft: 'auto' }}
                >
                    <ContentAdd />
                </RaButton>

                {/* add direct: salta lo stepper */}
                <RaButton
                    size="small"
                    variant="text"
                    color="primary"
                    label="actions.import"
                    onClick={() => setConfirmOpen(true)}
                    disabled={loading}
                >
                    <FlashOnIcon fontSize="small" />
                </RaButton>

                {template?.metadata?.repository && (
                    <>
                        <RaButton
                            size="small"
                            variant="text"
                            color="primary"
                            label="actions.download_notebook"
                            onClick={onNotebookDownload}
                        >
                            <DownloadIcon fontSize="small" />
                        </RaButton>
                        <RaButton
                            size="small"
                            variant="text"
                            color="primary"
                            label="Repository"
                            onClick={() =>
                                window.open(
                                    template.metadata.repository,
                                    '_blank',
                                    'noopener,noreferrer'
                                )
                            }
                        >
                            <CodeIcon fontSize="small" />
                        </RaButton>
                    </>
                )}
            </TopToolbar>

            <Confirm
                isOpen={confirmOpen}
                title={translate('pages.hub.add_direct_confirm_title')}
                content={translate('pages.hub.add_direct_confirm_content', {
                    name: template?.metadata?.name || template?.name,
                })}
                onConfirm={handleAddDirect}
                onClose={() => setConfirmOpen(false)}
            />
        </>
    );
};
