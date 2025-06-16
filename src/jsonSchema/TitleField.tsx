// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
    FormContextType,
    TitleFieldProps,
    RJSFSchema,
    StrictRJSFSchema,
} from '@rjsf/utils';
import { useTranslate } from 'react-admin';

/** The `TitleField` is the template to use to render the title of a field
 *
 * @param props - The `TitleFieldProps` for this component
 */
export default function TitleField<
    T = any,
    S extends StrictRJSFSchema = RJSFSchema,
    F extends FormContextType = any
>({ id, title }: TitleFieldProps<T, S, F>) {
    const translate = useTranslate();

    return (
        <Box id={id} mb={1} mt={1}>
            <Typography variant="h5">{translate(title)}</Typography>
        </Box>
    );
}
