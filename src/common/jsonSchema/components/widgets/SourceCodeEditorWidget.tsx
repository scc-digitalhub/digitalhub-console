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
import { Fragment, useEffect, useState } from 'react';

export const SourceCodeEditorWidget = function (props: WidgetProps) {
    const { id, value, readonly, onChange, formContext } = props;

    //extract language hint from context
    const lang = formContext.sourceLang ? formContext.sourceLang : undefined;

    const decodeValue = (encodedValue?: string): string => {
        if (!encodedValue) return '';
        try {
            const decoded = atob(encodedValue);
            const bytes = Uint8Array.from(decoded, c => c.charCodeAt(0));
            return new TextDecoder().decode(bytes);
        } catch {
            return '';
        }
    };

    const encodeValue = (plainValue: string): string => {
        if (!plainValue) return '';
        const bytes = new TextEncoder().encode(plainValue);
        const binary = Array.from(bytes, b => String.fromCharCode(b)).join('');
        return btoa(binary);
    };

    const [code, setCode] = useState(() => decodeValue(value));
    useEffect(() => {
        const decodedValue = decodeValue(value);
        setCode(prevCode =>
            decodedValue !== prevCode ? decodedValue : prevCode
        );
    }, [value]);

    const handleChange = (data: string) => {
        setCode(data);
        onChange(encodeValue(data));
    };

    return (
        <Fragment key={id}>
            <AceEditor
                mode={lang}
                readOnly={readonly}
                theme={'monokai'}
                wrapEnabled={false}
                width={'50vw'}
                setOptions={{
                    showPrintMargin: false,
                    minLines: 16,
                    maxLines: Math.max(code.split('\n').length, 25),
                }}
                value={code}
                onChange={handleChange}
            />
        </Fragment>
    );
};
