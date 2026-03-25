// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import {
    Button as RaButton,
    useTranslate,
    useDataProvider,
    useNotify,
} from 'react-admin';
import { useRootSelector } from '@dslab/ra-root-selector';
import {
    TopToolbar,
    Confirm,
} from 'react-admin';
import {
    Code as CodeIcon,
    Add as ContentAdd,
    ArrowBack as ArrowBackIcon,
    Download as DownloadIcon,
} from '@mui/icons-material';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { useNavigate } from 'react-router';

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

    const handleAddDirect = async () => {
        setConfirmOpen(false);
        setLoading(true);
        try {
            const payload = {
                ...template,
                project: root || '',
                metadata: {
                    ...template.metadata,
                    project: root || '',
                },
            };
            await dataProvider.create(template.resourceName, {
                data: payload,
                meta: { root },
            });
            notify('pages.hub.add_direct_success', { type: 'success' });
                        if (redirectPath) {
                navigate(redirectPath);
                        }
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