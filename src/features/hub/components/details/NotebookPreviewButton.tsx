// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    DialogContent,
    DialogTitle,
    IconButton,
    useTheme,
} from '@mui/material';
import {
    Download as DownloadIcon,
    Preview as PreviewIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { lazy, Suspense, useCallback, useState, MouseEvent } from 'react';
import { Button, TopToolbar, useTranslate } from 'react-admin';


// Lazy-load the notebook viewer (~1.8 MB) so it's only fetched when the
// preview dialog is first opened, not on initial page load.
const JupyterNotebookViewer = lazy(() =>
    import('react-jupyter-notebook-viewer').then(m => ({
        default: m.JupyterNotebookViewer,
    }))
);
import {
    StyledDialog,
    StyledDialogClasses,
} from '../../../../common/theme/StyledDialog';

export const NotebookPreviewButton = (props: NotebookPreviewButtonProps) => {
    const { onDownload, url, title } = props;
    const translate = useTranslate();
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    const handleDialogOpen = (e: MouseEvent<HTMLButtonElement>) => {
        setOpen(true);
        e.stopPropagation();
    };

    const handleDialogClose = (e: MouseEvent) => {
        e.stopPropagation();
        setOpen(false);
    };

    const handleClick = useCallback((e: MouseEvent) => {
        e.stopPropagation();
    }, []);

    return (
        <>
            <Button
                size="small"
                variant="text"
                color="primary"
                label="actions.download_notebook"
                onClick={handleDialogOpen}
            >
                <PreviewIcon fontSize="small" />
            </Button>
            <StyledDialog
                open={open}
                onClose={handleDialogClose}
                onClick={handleClick}
                fullWidth={true}
                maxWidth="lg"
                aria-labelledby="notebook-preview-dialog-title"
                className={StyledDialogClasses.dialog}
            >
                <div className={StyledDialogClasses.header}>
                    <DialogTitle
                        id="notebook-preview-dialog-title"
                        className={StyledDialogClasses.title}
                    >
                        {title ?? 'Notebook'}
                    </DialogTitle>
                    <IconButton
                        className={StyledDialogClasses.closeButton}
                        aria-label={translate('ra.action.close')}
                        title={translate('ra.action.close')}
                        onClick={handleDialogClose}
                        size="small"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </div>
                <DialogContent className={StyledDialogClasses.content}>
                    <TopToolbar>
                        <Button
                            size="small"
                            variant="text"
                            color="primary"
                            label="actions.download"
                            onClick={onDownload}
                        >
                            <DownloadIcon fontSize="small" />
                        </Button>
                    </TopToolbar>
                    <Suspense fallback={null}>
                        <JupyterNotebookViewer
                            filePath={url}
                            inputCodeDarkTheme={!(theme.palette.mode === 'dark')}
                            outputDarkTheme={!(theme.palette.mode === 'dark')}
                            inputMarkdownDarkTheme={
                                !(theme.palette.mode === 'dark')
                            }
                        />
                    </Suspense>
                </DialogContent>
            </StyledDialog>
        </>
    );
};

type NotebookPreviewButtonProps = {
    onDownload: () => void;
    url: string;
    title?: string;
};
