// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    AccordionSummary,
    Typography,
    AccordionDetails,
    Grid,
} from '@mui/material';
import { MetadataCreateUiSchema } from '../schemas';
import { useGetSchemas } from '../schemaController';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRecordContext, useTranslate } from 'react-admin';
import { styled } from '@mui/material/styles';
import { JsonSchemaInput } from './JsonSchema';
import { useEffect } from 'react';
import deepEqual from 'deep-is';
import { get } from 'lodash';
import { useWatch } from 'react-hook-form';

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

export const MetadataInput = (props: {
    onVersionDirty?: (state: boolean) => void;
}) => {
    const { onVersionDirty } = props;
    const translate = useTranslate();
    const record = useRecordContext();
    const value = useWatch({ name: 'metadata' });
    const { data: schemas } = useGetSchemas('metadatas');
    const metadataKinds = schemas
        ? schemas
              .map(s => ({
                  id: s.kind,
                  name: s.kind,
                  schema: s.schema,
              }))
              .sort((a, b) =>
                  a.id === 'metadata.base'
                      ? -1
                      : b.id === 'metadata.base'
                      ? 1
                      : a.id.localeCompare(b.id)
              )
        : [];

    useEffect(() => {
        if (onVersionDirty && record) {
            onVersionDirty(
                !deepEqual(get(record, 'metadata.version', {}), value.version)
            );
        }
    }, [onVersionDirty, record, value]);

    return (
        <Grid container={true} alignItems="top">
            {metadataKinds?.map(r => {
                return (
                    <Grid size={12} style={{ overflow: 'auto' }} key={r.id}>
                        {r.id === 'metadata.base' ? (
                            <>
                                <Typography variant="h5">
                                    {translate(r.schema.title)}
                                </Typography>
                                <JsonSchemaInput
                                    key={r.id}
                                    source="metadata"
                                    schema={{ ...r.schema, title: '' }}
                                    uiSchema={MetadataCreateUiSchema}
                                />
                            </>
                        ) : (
                            <Accordion
                                elevation={0}
                                disableGutters
                                defaultExpanded={r.id === 'metadata.base'}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <Typography variant="h5">
                                        {translate(r.schema.title)}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <JsonSchemaInput
                                        key={r.id}
                                        source="metadata"
                                        schema={{
                                            ...r.schema,
                                            title: '',
                                        }}
                                    />
                                </AccordionDetails>
                            </Accordion>
                        )}
                    </Grid>
                );
            })}
        </Grid>
    );
};
