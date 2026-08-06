// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { createPyodideExecutor } from '@jupyter-kit/executor-pyodide';
import { Ipynb, Notebook } from '@jupyter-kit/react';
import dark from '@jupyter-kit/theme-dark/dark.css?inline';
import light from '@jupyter-kit/theme-default/default.css?inline';
import darkSyntax from '@jupyter-kit/theme-default/syntax/one-dark.css?inline';
import lightSyntax from '@jupyter-kit/theme-default/syntax/one-light.css?inline';
import { useTheme } from '@mui/material';
import { createEditorPlugin } from '../editor-monaco';

export const NotebookViewer = (props: NotebookViewerProps) => {
    const { ipynb, readOnly = false } = props;
    const theme = useTheme();

    return (
        <>
            <style>{theme.palette.mode === 'dark' ? dark : light}</style>
            <style>
                {theme.palette.mode === 'dark' ? darkSyntax : lightSyntax}
            </style>
            <Notebook
                ipynb={ipynb}
                executor={
                    readOnly
                        ? undefined
                        : createPyodideExecutor({
                              packages: ['digitalhub'],
                              onStatus: (s, d) => console.log('pyodide:', s, d),
                          })
                }
                plugins={[
                    createEditorPlugin({
                        languages: { python: 'python' },
                    }),
                ]}
            />
        </>
    );
};

type NotebookViewerProps = {
    ipynb: Ipynb;
    readOnly?: boolean;
};

export default NotebookViewer;
