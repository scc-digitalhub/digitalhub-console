// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    WidgetProps,
    FormContextType,
    RJSFSchema,
    StrictRJSFSchema,
    getTemplate,
    titleId,
} from '@rjsf/utils';
import { useTranslate } from 'react-admin';

// import 'ace-builds/esm-resolver';
import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/theme-solarized_light';
import 'ace-builds/src-noconflict/worker-base.js';
import 'ace-builds/src-noconflict/worker-css.js';
import 'ace-builds/src-noconflict/worker-html.js';
import 'ace-builds/src-noconflict/worker-javascript.js';
import 'ace-builds/src-noconflict/worker-json.js';
import 'ace-builds/src-noconflict/worker-xml.js';
import 'ace-builds/src-noconflict/worker-yaml.js';

import { Fragment } from 'react';

const lightTheme = ['yaml', 'json', 'text', 'markdown', 'css'];

export const AceEditorWidget = function <
    T = any,
    S extends StrictRJSFSchema = RJSFSchema,
    F extends FormContextType = any
>(props: WidgetProps<T, S, F>) {
    const {
        id,
        value,
        readonly,
        options,
        onChange,
        schema,
        label,
        hideLabel,
        registry,
        required,
    } = props;
    const translate = useTranslate();

    const TitleFieldTemplate = getTemplate<'TitleFieldTemplate', T, S, F>(
        'TitleFieldTemplate',
        registry,
        options
    );

    //extract language hint from format
    const format = schema?.format ? schema.format.split('+')[0] : null;
    const lang = format || 'text';
    const useBase64 =
        schema?.format && schema.format.split('+').length > 1
            ? schema.format.split('+')[1] == 'base64'
            : false;
    const theme = lightTheme.includes(lang) ? 'github' : 'monokai';

    const handleChange = (data: string) => {
        const encodedValue = useBase64 ? btoa(data) : data;
        onChange(encodedValue);
    };

    let code = '';
    try {
        code = useBase64 ? atob(value || '') : value || '';
    } catch (e: any) {
        code = '';
    }

    return (
        <Fragment key={id}>
            {label && !hideLabel && (
                <TitleFieldTemplate
                    id={titleId<T>(id)}
                    schema={schema}
                    title={translate(label)}
                    required={required}
                    registry={registry}
                />
            )}
            <AceEditor
                mode={lang}
                readOnly={readonly}
                theme={theme}
                wrapEnabled
                height="20vh"
                setOptions={{ showPrintMargin: false, useWorker: false }} //disable workers due to issue with esm module loading
                value={code}
                onChange={handleChange}
            />
        </Fragment>
    );
};
