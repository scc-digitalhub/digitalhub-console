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
import { Labeled, useTranslate } from 'react-admin';

import { Fragment, useState } from 'react';
import DOMPurify from 'dompurify';
import { Box, Divider, Switch } from '@mui/material';
import { PreviewButton } from '../../../components/PreviewButton';

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
    const [trusted, setTrusted] = useState(false);

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

        if (trusted === true) {
            source = code;
        } else {
            source = DOMPurify.sanitize(code);
        }
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

            {source?.length > 1024 ? (
                <PreviewButton
                    title={label ? translate(label) : undefined}
                    maxWidth="xl"
                    fullWidth
                    color="secondary"
                >
                    <Box p={1}>
                        <Labeled label="pages.preview.trustContent">
                            <Switch
                                checked={trusted === true}
                                onChange={() => {
                                    setTrusted(!trusted);
                                }}
                            />
                        </Labeled>
                        <Divider />
                        <iframe
                            title="preview-ext"
                            srcDoc={source}
                            width={'100%'}
                            height={'100%'}
                            style={{ border: 'none', minHeight: '70vh' }}
                        ></iframe>
                    </Box>
                </PreviewButton>
            ) : (
                <>
                    <Labeled label="pages.preview.trustContent">
                        <Switch
                            checked={trusted === true}
                            onChange={() => {
                                setTrusted(!trusted);
                            }}
                        />
                    </Labeled>
                    <iframe
                        title="preview-ext"
                        srcDoc={source}
                        width={'100%'}
                        height={'auto'}
                        style={{ border: 'none' }}
                    ></iframe>
                </>
            )}
        </Fragment>
    );
};
