// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {
    getTemplate,
    getUiOptions,
    ArrayFieldTemplateProps,
    ArrayFieldItemTemplateType,
    FormContextType,
    RJSFSchema,
    StrictRJSFSchema,
} from '@rjsf/utils';
import { useTranslate } from 'react-admin';
/** The `ArrayFieldTemplate` component is the template used to render all items in an array.
 *
 * @param props - The `ArrayFieldItemTemplateType` props for the component
 */
export default function ArrayFieldTemplate<
    T = any,
    S extends StrictRJSFSchema = RJSFSchema,
    F extends FormContextType = any
>(props: ArrayFieldTemplateProps<T, S, F>) {
    const {
        canAdd,
        disabled,
        idSchema,
        uiSchema,
        items,
        onAddClick,
        readonly,
        registry,
        required,
        schema,
        title,
    } = props;
    const translate = useTranslate();
    const uiOptions = getUiOptions<T, S, F>(uiSchema);
    const ArrayFieldDescriptionTemplate = getTemplate<
        'ArrayFieldDescriptionTemplate',
        T,
        S,
        F
    >('ArrayFieldDescriptionTemplate', registry, uiOptions);
    const ArrayFieldItemTemplate = getTemplate<
        'ArrayFieldItemTemplate',
        T,
        S,
        F
    >('ArrayFieldItemTemplate', registry, uiOptions);
    const ArrayFieldTitleTemplate = getTemplate<
        'ArrayFieldTitleTemplate',
        T,
        S,
        F
    >('ArrayFieldTitleTemplate', registry, uiOptions);
    // Button templates are not overridden in the uiSchema
    const {
        ButtonTemplates: { AddButton },
    } = registry.templates;
    const titleText = uiOptions.title || title || '';
    const descriptionText = uiOptions.description || schema.description || '';
    return (
        <Box>
            <ArrayFieldTitleTemplate
                idSchema={idSchema}
                title={translate(titleText)}
                schema={schema}
                uiSchema={uiSchema}
                required={required}
                registry={registry}
            />
            <ArrayFieldDescriptionTemplate
                idSchema={idSchema}
                description={translate(descriptionText)}
                schema={schema}
                uiSchema={uiSchema}
                registry={registry}
            />
            {items &&
                items.map(
                    ({
                        key,
                        ...itemProps
                    }: ArrayFieldItemTemplateType<T, S, F>) => (
                        <ArrayFieldItemTemplate key={key} {...itemProps} />
                    )
                )}
            {canAdd && !readonly && (
                <Grid container justifyContent="right">
                    <Grid>
                        <Box>
                            <AddButton
                                className="array-item-add"
                                onClick={onAddClick}
                                disabled={disabled || readonly}
                                uiSchema={uiSchema}
                                registry={registry}
                            />
                        </Box>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
}
