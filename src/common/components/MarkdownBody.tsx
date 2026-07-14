// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useTheme } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// Imported as raw strings so we can inject only the active theme's CSS,
// avoiding the @media (prefers-color-scheme) limitation of github-markdown.css.
import lightCss from 'github-markdown-css/github-markdown-light.css?inline';
import darkCss from 'github-markdown-css/github-markdown-dark.css?inline';

interface MarkdownBodyProps {
    children: string;
    style?: React.CSSProperties;
}

export const MarkdownBody = ({ children, style }: MarkdownBodyProps) => {
    const theme = useTheme();
    const css = theme.palette.mode === 'dark' ? darkCss : lightCss;

    return (
        <>
            <style>{css}</style>
            <div className="markdown-body" style={style}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {children}
                </ReactMarkdown>
            </div>
        </>
    );
};
