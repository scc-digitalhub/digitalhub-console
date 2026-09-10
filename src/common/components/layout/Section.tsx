// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { AccordionSummary, Typography, AccordionDetails } from '@mui/material';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslate } from 'react-admin';
import { styled } from '@mui/material/styles';
import { ReactNode } from 'react';

export const Section = (props: {
    children: ReactNode;
    label?: string;
    defaultExpanded?: boolean;
}) => {
    const { label, children } = props;
    const translate = useTranslate();

    const title = label ? translate(label) : '';
    return (
        <Accordion
            elevation={0}
            disableGutters
            defaultExpanded={props.defaultExpanded}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h5">{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>{children}</AccordionDetails>
        </Accordion>
    );
};

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    width: `100%`,
    borderTop: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        // borderBottom: 0,
    },
    '&::before': {
        display: 'none',
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
        color: '#E0701B',
    },
}));
