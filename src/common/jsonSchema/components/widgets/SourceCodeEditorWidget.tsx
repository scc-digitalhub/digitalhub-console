// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { WidgetProps } from '@rjsf/utils';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/mode-drools';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/theme-solarized_light';
import { Fragment } from 'react';

export const SourceCodeEditorWidget = function (props: WidgetProps) {
    const { id, value, readonly, onChange, formContext } = props;

    //extract language hint from context
    const lang = formContext.sourceLang ? formContext.sourceLang : undefined;

    const handleChange = (data: string) => {
        const encodedValue = btoa(data);
        onChange(encodedValue);
    };

    let code = '';
    let lineCount = 0;
    try {
        code = atob(value);
        lineCount = code.split('\n').length;
    } catch (e: any) {
        code = '';
    }

    return (
        <Fragment key={id}>
            <AceEditor
                mode={lang}
                readOnly={readonly}
                theme={'monokai'}
                wrapEnabled
                width={'50vw'}
                setOptions={{
                    showPrintMargin: false,
                    minLines: 16,
                    maxLines: Math.max(lineCount, 25),
                }}
                value={code}
                onChange={handleChange}
            />
        </Fragment>
    );
};
