import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import {
    ObjectFieldTemplateProps,
  } from '@rjsf/utils';
  import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

  export const  K8FieldTemplate = (props: ObjectFieldTemplateProps) => {
      return (
          <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            {props.title}
          </AccordionSummary>
          <AccordionDetails >
          {props.properties.map((element,index) => (
              <div style={{ width: '100%' }} key={index}>{element.content}</div>
              ))}
          </AccordionDetails>
        </Accordion>
      );
    }