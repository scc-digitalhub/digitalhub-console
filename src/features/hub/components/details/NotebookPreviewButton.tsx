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
import {
    lazy,
    Suspense,
    useCallback,
    useState,
    MouseEvent,
    useEffect,
} from 'react';
import {
    Button,
    Error as RaError,
    TopToolbar,
    useTranslate,
} from 'react-admin';

import { python } from '@jupyter-kit/core/langs/python';
import light from '@jupyter-kit/theme-default/default.css?inline';
import dark from '@jupyter-kit/theme-dark/dark.css?inline';
import lightSyntax from '@jupyter-kit/theme-default/syntax/one-light.css?inline';
import darkSyntax from '@jupyter-kit/theme-default/syntax/one-dark.css?inline';

// Lazy-load the notebook viewer so it's only fetched when the
// preview dialog is first opened, not on initial page load.
const Notebook = lazy(() =>
    import('@jupyter-kit/react').then(m => ({
        default: m.Notebook,
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
    const [notebookContent, setNotebookContent] = useState<any | null>(null);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (open && url) {
            fetch(url)
                .then(res =>
                    res.ok
                        ? res.json()
                        : Promise.reject(
                              new Error('Failed to load notebook content')
                          )
                )
                .then(json => {
                    setNotebookContent(json);
                    setError(null);
                })
                .catch(err => {
                    console.error(err);
                    setNotebookContent(null);
                    setError(
                        err instanceof Error
                            ? err
                            : new Error('Notebook fetch failed')
                    );
                });
        }
    }, [open, url]);

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
                    {notebookContent && (
                        <Suspense fallback={null}>
                            <style>
                                {theme.palette.mode === 'dark' ? dark : light}
                            </style>
                            <style>
                                {theme.palette.mode === 'dark'
                                    ? darkSyntax
                                    : lightSyntax}
                            </style>
                            <Notebook
                                ipynb={notebookContent}
                                languages={[python]}
                            />
                        </Suspense>
                    )}
                    {error && (
                        <RaError
                            error={error}
                            resetErrorBoundary={() => setError(null)}
                        />
                    )}
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
