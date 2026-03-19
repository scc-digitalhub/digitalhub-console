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

import { Fragment } from 'react';
import DOMPurify from 'dompurify';

export const HtmlPreview = function <
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

    let source = '';
    if (lang !== 'html' && lang !== 'text') {
        source = 'Unsupported format: ' + lang;
    } else {
        let code = '';
        try {
            code = useBase64 ? atob(value || '') : value || '';
        } catch (e: any) {
            code = '';
        }
        if (lang === 'text') {
            code = '<pre>' + code + '</pre>';
        }

        source = DOMPurify.sanitize(code);
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
            {/* <div dangerouslySetInnerHTML={{ __html: source }} /> */}
            <iframe
                title="preview-ext"
                srcDoc={source}
                width={'100%'}
                height={'auto'}
                style={{ border: 'none' }}
            ></iframe>
        </Fragment>
    );
};
