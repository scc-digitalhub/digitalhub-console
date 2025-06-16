// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    AccordionSummary,
    AccordionDetails,
    Typography,
} from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';

import { ObjectFieldTemplateProps } from '@rjsf/utils';
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

export const AccordionFieldTemplate = (props: ObjectFieldTemplateProps) => {
    const translate = useTranslate();
    const titleText = props.title || '';
    const descriptionText = props.description || '';
    return (
        <Accordion elevation={0} square disableGutters>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
            >
                <Typography variant="h5">{translate(titleText)}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {props.description && (
                    <Typography>{translate(descriptionText)}</Typography>
                )}
                {props.properties.map((element, index) => (
                    <div style={{ width: '100%' }} key={index}>
                        {element.content}
                    </div>
                ))}
            </AccordionDetails>
        </Accordion>
    );
};
