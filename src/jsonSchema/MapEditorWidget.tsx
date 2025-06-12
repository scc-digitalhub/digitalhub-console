// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    ObjectFieldTemplateProps,
    WidgetProps,
    descriptionId,
    getTemplate,
    getUiOptions,
    titleId,
} from '@rjsf/utils';
import { Grid } from '@mui/material';
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
import { Fragment, JSXElementConstructor, ReactElement } from 'react';
import { useTranslate } from 'react-admin';

export const MapEditorFieldTemplate = (props: ObjectFieldTemplateProps) => {
    const {
        description,
        title,
        properties,
        required,
        uiSchema,
        idSchema,
        schema,
        registry,
    } = props;
    const translate = useTranslate();
    const uiOptions = getUiOptions(uiSchema);
    const TitleFieldTemplate = getTemplate(
        'TitleFieldTemplate',
        registry,
        uiOptions
    );
    const DescriptionFieldTemplate = getTemplate(
        'DescriptionFieldTemplate',
        registry,
        uiOptions
    );

    const titleText = title || '';
    const descriptionText = description || '';
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
            {title && (
                <TitleFieldTemplate
                    id={titleId(idSchema)}
                    title={translate(titleText)}
                    required={required}
                    schema={schema}
                    uiSchema={uiSchema}
                    registry={registry}
                />
            )}
            {description && (
                <DescriptionFieldTemplate
                    id={descriptionId(idSchema)}
                    description={translate(descriptionText)}
                    schema={schema}
                    uiSchema={uiSchema}
                    registry={registry}
                />
            )}
            <Grid container={true} spacing={2} style={{ marginTop: '10px' }}>
                {properties.map((element, index) =>
                    // Remove the <Grid> if the inner element is hidden as the <Grid>
                    // itself would otherwise still take up space.
                    element.hidden ? (
                        element.content
                    ) : (
                        <Grid
                            item={true}
                            xs={12}
                            key={index}
                            style={{ marginBottom: '10px' }}
                        >
                            {childrenTranslated(element.content)}
                        </Grid>
                    )
                )}
            </Grid>
        </>
    );
};

export const MapEditorWidget = function (props: WidgetProps) {
    const { id, value, readonly, onChange } = props;

    const handleChange = (data: string) => {
        const json = JSON.parse(data);
        onChange(json);
    };

    const code = value ? JSON.stringify(value) : '{}';

    return (
        <Fragment key={id}>
            <AceEditor
                mode={'json'}
                readOnly={readonly}
                theme={'github'}
                wrapEnabled
                width={'50vw'}
                setOptions={{ showPrintMargin: false }}
                value={code}
                onChange={handleChange}
            />
        </Fragment>
    );
};
