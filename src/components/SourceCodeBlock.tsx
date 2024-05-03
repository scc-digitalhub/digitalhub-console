import React from 'react';
import { Container, ContainerOwnProps } from '@mui/material';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import hlJson from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import hlYaml from 'react-syntax-highlighter/dist/esm/languages/hljs/yaml';
import hlPython from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import hlPythonRepl from 'react-syntax-highlighter/dist/esm/languages/hljs/python-repl';
import hlSql from 'react-syntax-highlighter/dist/esm/languages/hljs/sql';
import hlJava from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import hlJavascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import hlTypescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import hlShell from 'react-syntax-highlighter/dist/esm/languages/hljs/shell';
import hlBash from 'react-syntax-highlighter/dist/esm/languages/hljs/bash';
import { AceEditorField } from '@dslab/ra-ace-editor';
import themeVS2015 from 'react-syntax-highlighter/dist/esm/styles/hljs/vs2015';
import themeGithub from 'react-syntax-highlighter/dist/esm/styles/hljs/github';
import { TopToolbar } from 'react-admin';
import { CopyToClipboardButton } from '@dslab/ra-inspect-button';

SyntaxHighlighter.registerLanguage('json', hlJson);
SyntaxHighlighter.registerLanguage('yaml', hlYaml);
SyntaxHighlighter.registerLanguage('python', hlPython);
SyntaxHighlighter.registerLanguage('python-repl', hlPythonRepl);
SyntaxHighlighter.registerLanguage('sql', hlSql);
SyntaxHighlighter.registerLanguage('java', hlJava);
SyntaxHighlighter.registerLanguage('javascript', hlJavascript);
SyntaxHighlighter.registerLanguage('typescript', hlTypescript);
SyntaxHighlighter.registerLanguage('shell', hlShell);
SyntaxHighlighter.registerLanguage('bash', hlBash);

export const SourceCodeBlock = (props: SourceCodeBlockProps) => {
    const {
        code,
        language = 'json',
        theme = 'dark',
        showLineNumbers = false,
        showCopyButton = true,
        onCopyButtonSuccess,
        ...rest
    } = props;

    const style = theme === 'dark' ? themeVS2015 : themeGithub;

    return (
        <Container {...rest} disableGutters>
            {showCopyButton && (
                <TopToolbar
                    variant="dense"
                    sx={{ padding: 0, minHeight: '32px' }}
                >
                    <CopyToClipboardButton
                        value={code}
                        onSuccess={onCopyButtonSuccess}
                    />
                </TopToolbar>
            )}

            <AceEditorField mode={language} source="code" theme="monokai" />

            {/* <SyntaxHighlighter
                language={language}
                style={style}
                showLineNumbers={showLineNumbers}
                wrapLongLines
            >
                {code}
            </SyntaxHighlighter> */}
        </Container>
    );
};

export type SourceCodeBlockProps = ContainerOwnProps & {
    /**
     * Source code as string. Required.
     */
    code: string;
    /**
     * (Optional) language for syntax highlighter
     */
    language?: 
    | 'java'
    | 'javascript'
    | 'markdown'
    | 'drools'
    | 'html'
    | 'python'
    | 'json'
    | 'sql'
    | 'typescript'
    | 'css'
    | 'yaml'
    | 'text';
    /**
     * Theme. Defaults to `dark`
     */
    theme?: 'light' | 'dark';
    /**
     * Show or hide the line numbers. Defaults to `false`
     */
    showLineNumbers?: boolean;
    /**
     * Show or hide the copy button. Default to `true`
     */
    showCopyButton?: boolean;
    /**
     * (Optional) handler for copy button success
     */
    onCopyButtonSuccess?: (e: Event) => void;
};
