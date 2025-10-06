// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Box,
} from '@mui/material';
import {
    WidgetProps,
    getTemplate,
    RJSFSchema,
    FormContextType,
    StrictRJSFSchema,
    titleId,
} from '@rjsf/utils';
import { useTranslate } from 'react-admin';
import { JSONTree } from 'react-json-tree';

export const JsonParamsWidget = function <
    T = any,
    S extends StrictRJSFSchema = RJSFSchema,
    F extends FormContextType = any
>(props: WidgetProps<T, S, F>) {
    const { schema, idSchema, required, title, registry, options, formData } = props;
    const translate = useTranslate();
    const TitleFieldTemplate = getTemplate<'TitleFieldTemplate', T, S, F>(
        'TitleFieldTemplate',
        registry,
        options
    );

    return (
        //return  JsonTree
        <>
        {title &&
            <TitleFieldTemplate
                id={titleId<T>(idSchema)}
                title={translate(title)}
                required={required}
                registry={registry}
                schema={schema}
            />
        }
            <Box
                sx={{
                    backgroundColor: '#002b36',
                    px: 2,
                    py: 0,
                     minHeight: '20px',
                }}
            >
                <JSONTree data={formData} hideRoot />
            </Box>
        </>
    );
};
