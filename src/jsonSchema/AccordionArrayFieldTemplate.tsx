// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { AccordionSummary, AccordionDetails, Typography } from '@mui/material';
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
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslate } from 'react-admin';
import { styled } from '@mui/material/styles';

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&::before': {
        display: 'none',
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
        color: '#E0701B',
    },
}));
/** The `ArrayFieldTemplate` component is the template used to render all items in an array.
 *
 * @param props - The `ArrayFieldItemTemplateType` props for the component
 */
export default function AccordionArrayFieldTemplate<
    T = any,
    S extends StrictRJSFSchema = RJSFSchema,
    F extends FormContextType = any
>(props: ArrayFieldTemplateProps<T, S, F>) {
    const translate = useTranslate();

    const {
        canAdd,
        disabled,
        idSchema,
        uiSchema,
        items,
        onAddClick,
        readonly,
        registry,
        schema,
        title,
    } = props;
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
    // Button templates are not overridden in the uiSchema
    const {
        ButtonTemplates: { AddButton },
    } = registry.templates;
    const titleText = uiOptions.title || title || '';
    const descriptionText = uiOptions.description || schema.description || '';
    return (
        <Accordion elevation={0} square disableGutters>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
            >
                {uiOptions.title && (
                    <Typography variant="h5">{translate(titleText)}</Typography>
                )}
            </AccordionSummary>
            <AccordionDetails>
                {uiOptions.description && (
                    <ArrayFieldDescriptionTemplate
                        idSchema={idSchema}
                        description={descriptionText}
                        schema={schema}
                        uiSchema={uiSchema}
                        registry={registry}
                    />
                )}
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
            </AccordionDetails>
        </Accordion>
    );
}
