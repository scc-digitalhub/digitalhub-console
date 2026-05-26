// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    styled,
    useTheme,
} from '@mui/material';
import {
    Download as DownloadIcon,
    Preview as PreviewIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { useCallback, useState } from 'react';
import { Button, TopToolbar, useTranslate } from 'react-admin';
import { JupyterNotebookViewer } from 'react-jupyter-notebook-viewer';
import { MouseEvent } from 'react';

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
            <PreviewDialog
                open={open}
                onClose={handleDialogClose}
                onClick={handleClick}
                fullWidth={true}
                maxWidth="lg"
                aria-labelledby="notebook-preview-dialog-title"
                className={NotebookPreviewButtonClasses.dialog}
            >
                <div className={NotebookPreviewButtonClasses.header}>
                    <DialogTitle
                        id="notebook-preview-dialog-title"
                        className={NotebookPreviewButtonClasses.title}
                    >
                        {title ?? 'Notebook'}
                    </DialogTitle>
                    <IconButton
                        className={NotebookPreviewButtonClasses.closeButton}
                        aria-label={translate('ra.action.close')}
                        title={translate('ra.action.close')}
                        onClick={handleDialogClose}
                        size="small"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </div>
                <DialogContent>
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
                    <JupyterNotebookViewer
                        filePath={url}
                        inputCodeDarkTheme={!(theme.palette.mode === 'dark')}
                        outputDarkTheme={!(theme.palette.mode === 'dark')}
                        inputMarkdownDarkTheme={
                            !(theme.palette.mode === 'dark')
                        }
                    />
                </DialogContent>
            </PreviewDialog>
        </>
    );
};

type NotebookPreviewButtonProps = {
    onDownload: () => void;
    url: string;
    title?: string;
};

const PREFIX = 'NotebookPreviewButton';

const NotebookPreviewButtonClasses = {
    button: `${PREFIX}-button`,
    dialog: `${PREFIX}-dialog`,
    header: `${PREFIX}-header`,
    title: `${PREFIX}-title`,
    closeButton: `${PREFIX}-close-button`,
};

const PreviewDialog = styled(Dialog, {
    name: PREFIX,
    overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${NotebookPreviewButtonClasses.title}`]: {
        padding: theme.spacing(0),
    },
    [`& .${NotebookPreviewButtonClasses.header}`]: {
        padding: theme.spacing(2, 2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    [`& .${NotebookPreviewButtonClasses.closeButton}`]: {
        height: 'fit-content',
    },
}));
