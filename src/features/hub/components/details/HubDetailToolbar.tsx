// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Button as RaButton,
    TopToolbar,
} from 'react-admin';
import {
    Code as CodeIcon,
    Add as ContentAdd,
    ArrowBack as ArrowBackIcon,
    Download as DownloadIcon,
} from '@mui/icons-material';

interface HubDetailToolbarProps {
    template: any;
    onBack: () => void;
    onImport: (template: any) => void;
    onNotebookDownload: () => void;
}

export const HubDetailToolbar = ({
    template,
    onBack,
    onImport,
    onNotebookDownload,
}: HubDetailToolbarProps) => (
    <TopToolbar>
        <RaButton
            size="small"
            color="primary"
            label="ra.action.back"
            onClick={onBack}
        >
            <ArrowBackIcon fontSize="small" />
        </RaButton>

        <RaButton
            size="small"
            variant="text"
            color="primary"
            label="actions.import_one"
            onClick={() => onImport(template)}
            sx={{ marginLeft: 'auto' }}
        >
            <ContentAdd />
        </RaButton>

        {template?.metadata?.repository && (
            <>
                <RaButton
                    size="small"
                    variant="text"
                    color="info"
                    label="Notebook"
                    onClick={onNotebookDownload}
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
);