// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useCallback } from 'react';
import { TopToolbar, Button as RaButton } from 'react-admin';
import { useTutorialsContext } from '../TutorialsContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CodeIcon from '@mui/icons-material/Code';
import { NotebookPreviewButton } from '../../../common/components/buttons/NotebookPreviewButton';

export const TutorialToolbar = () => {
    const { selectedTutorial, selectTutorial } = useTutorialsContext();

    const handleNotebookDownload = useCallback(async () => {
        if (!selectedTutorial.notebook) return;

        try {
            const res = await fetch(selectedTutorial.notebook);
            if (!res.ok) throw new Error();
            const blobUrl = window.URL.createObjectURL(await res.blob());
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `${selectedTutorial.name || 'notebook'}.ipynb`;
            a.click();
            window.URL.revokeObjectURL(blobUrl);
        } catch {
            window.open(
                selectedTutorial.notebook,
                '_blank',
                'noopener,noreferrer'
            );
        }
    }, [selectedTutorial]);

    return (
        <TopToolbar>
            <RaButton
                size="small"
                color="primary"
                label="ra.action.back"
                onClick={() => selectTutorial(null)}
                sx={{ marginRight: 'auto' }}
            >
                <ArrowBackIcon fontSize="small" />
            </RaButton>
            {selectedTutorial.notebook && (
                <NotebookPreviewButton
                    onDownload={handleNotebookDownload}
                    url={selectedTutorial.notebook}
                    title={selectedTutorial.name}
                />
            )}
            {selectedTutorial.repository && (
                <RaButton
                    size="small"
                    variant="text"
                    color="primary"
                    label="Repository"
                    onClick={() =>
                        window.open(
                            selectedTutorial.repository,
                            '_blank',
                            'noopener,noreferrer'
                        )
                    }
                >
                    <CodeIcon fontSize="small" />
                </RaButton>
            )}
        </TopToolbar>
    );
};
