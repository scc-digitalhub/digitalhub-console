// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import Grid from '@mui/material/Grid';
import {
    FormContextType,
    ObjectFieldTemplateProps,
    RJSFSchema,
    StrictRJSFSchema,
    canExpand,
    descriptionId,
    getTemplate,
    getUiOptions,
    titleId,
} from '@rjsf/utils';
import { ReactElement, JSXElementConstructor } from 'react';
import { useTranslate } from 'react-admin';

/** The `ObjectFieldTemplate` is the template to use to render all the inner properties of an object along with the
 * title and description if available. If the object is expandable, then an `AddButton` is also rendered after all
 * the properties.
 *
 * @param props - The `ObjectFieldTemplateProps` for this component
 */
export default function ObjectFieldTemplate<
    T = any,
    S extends StrictRJSFSchema = RJSFSchema,
    F extends FormContextType = any
>(props: ObjectFieldTemplateProps<T, S, F>) {
    const {
        description,
        title,
        properties,
        required,
        disabled,
        readonly,
        uiSchema,
        idSchema,
        schema,
        formData,
        onAddClick,
        registry,
    } = props;
    const translate = useTranslate();
    const uiOptions = getUiOptions<T, S, F>(uiSchema);
    const TitleFieldTemplate = getTemplate<'TitleFieldTemplate', T, S, F>(
        'TitleFieldTemplate',
        registry,
        uiOptions
    );
    const DescriptionFieldTemplate = getTemplate<
        'DescriptionFieldTemplate',
        T,
        S,
        F
    >('DescriptionFieldTemplate', registry, uiOptions);
    // Button templates are not overridden in the uiSchema
    const {
        ButtonTemplates: { AddButton },
    } = registry.templates;
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
                    id={titleId<T>(idSchema)}
                    title={translate(titleText)}
                    required={required}
                    schema={schema}
                    uiSchema={uiSchema}
                    registry={registry}
                />
            )}
            {description && (
                <DescriptionFieldTemplate
                    id={descriptionId<T>(idSchema)}
                    description={
                        typeof descriptionText === 'string'
                            ? translate(descriptionText)
                            : descriptionText
                    }
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
                            size={12}
                            key={index}
                            style={{ marginBottom: '10px' }}
                        >
                            {childrenTranslated(element.content)}
                        </Grid>
                    )
                )}
                {canExpand<T, S, F>(schema, uiSchema, formData) &&
                    !readonly && (
                        <Grid container justifyContent="flex-end">
                            <Grid>
                                <AddButton
                                    className="object-property-expand"
                                    onClick={onAddClick(schema)}
                                    disabled={disabled || readonly}
                                    uiSchema={uiSchema}
                                    registry={registry}
                                />
                            </Grid>
                        </Grid>
                    )}
            </Grid>
        </>
    );
}
