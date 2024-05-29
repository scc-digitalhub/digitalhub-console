import {
    AccordionSummary,
    AccordionDetails,
    Grid,
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
  }));
  
export const AccordionFieldTemplate = (props: ObjectFieldTemplateProps) => {
    const translate = useTranslate();

    return (
        <>
            <Accordion elevation={0} square disableGutters>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Typography variant='h6'>{translate(props.title)}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {props.description && (
                        <Typography>
                            <p>{translate(props.description)}</p>
                        </Typography>
                    )}
                    {props.properties.map((element, index) => (
                        <div style={{ width: '100%' }} key={index}>
                            {element.content}
                        </div>
                    ))}
                </AccordionDetails>
            </Accordion>
        </>
    );
};
