// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { DialogContent, DialogTitle, IconButton } from '@mui/material';
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
    ButtonProps,
    Error as RaError,
    TopToolbar,
    useTranslate,
} from 'react-admin';
import { StyledDialog, StyledDialogClasses } from '../../theme/StyledDialog';

// Lazy-load the notebook viewer so it's only fetched when the
// preview dialog is first opened, not on initial page load.
const NotebookViewer = lazy(
    () => import('../../../features/jupyter-notebooks/notebook-viewer')
);
/**
 * Button for a preview dialog of a Jupyter notebook.
 */
export const NotebookPreviewButton = (props: NotebookPreviewButtonProps) => {
    const {
        onDownload,
        url,
        title,
        readOnly = false,
        onClick,
        ...rest
    } = props;
    const translate = useTranslate();
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
        if (onClick) onClick(e);
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
                {...rest}
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
                            <NotebookViewer
                                ipynb={notebookContent}
                                readOnly={readOnly}
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

type NotebookPreviewButtonProps = ButtonProps & {
    onDownload: () => void;
    url: string;
    title?: string;
    readOnly?: boolean;
};
