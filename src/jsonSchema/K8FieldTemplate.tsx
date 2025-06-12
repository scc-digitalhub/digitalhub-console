// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Grid,
} from '@mui/material';
import { ObjectFieldTemplateProps } from '@rjsf/utils';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { k8sSpec } from '../resources/tasks/types';

export const K8FieldTemplate = (props: ObjectFieldTemplateProps) => {
    const k8sPropNames = Object.keys(k8sSpec);
    const k8sProps: any[] = [],
        otherProps: any[] = [];
    console.log(props.properties);
    props.properties.forEach(element => {
        if (k8sPropNames.indexOf(element.name) >= 0) {
            k8sProps.push(element);
        } else {
            otherProps.push(element);
        }
    });
    return (
        <>
            <Grid container={true} style={{ marginTop: '10px' }}>
                {otherProps.map((element, index) =>
                    element.hidden ? (
                        element.content
                    ) : (
                        <Grid item={true} xs={12} key={index}>
                            {element.content}
                        </Grid>
                    )
                )}
            </Grid>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    {props.title || 'K8S'}
                </AccordionSummary>
                <AccordionDetails>
                    {k8sProps.map((element, index) => (
                        <div style={{ width: '100%' }} key={index}>
                            {element.content}
                        </div>
                    ))}
                </AccordionDetails>
            </Accordion>
        </>
    );
};
