// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Stack, Typography } from '@mui/material';
import { ObjectFieldTemplateProps } from '@rjsf/utils';
import { ReactElement, JSXElementConstructor } from 'react';
import { useTranslate } from 'react-admin';
export const CoreResourceFieldTemplate = (props: ObjectFieldTemplateProps) => {
    const translate = useTranslate();

    function childrenTranslated(
        children: ReactElement<any, string | JSXElementConstructor<any>>
    ): import('react').ReactNode {
        const title = children.props.schema.title || '';
        const description = children.props.schema.description || '';
        children.props.schema.title = translate(title);
        children.props.schema.description = translate(description);
        return children;
    }

    return (
        <>
            <Typography variant="h6" sx={{ margin: '4px 0px' }}>
                {translate(props.title)}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                {props.properties.map(element =>
                    childrenTranslated(element.content)
                )}
            </Stack>
        </>
    );
};
