import {
    AccordionSummary,
    Typography,
    AccordionDetails,
    Box,
    Grid,
} from '@mui/material';
import {
    MetadataCreateUiSchema,
    createMetadataViewUiSchema,
} from '../common/schemas';
import { useGetSchemas } from '../controllers/schemaController';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRecordContext, useTranslate } from 'react-admin';
import { styled } from '@mui/material/styles';
import { JsonSchemaInput } from './JsonSchema';

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
export const MetadataInput = ({ prompt }: any) => {
    const record = useRecordContext();
    const translate = useTranslate();
    const { data: schemas, isLoading, error } = useGetSchemas('metadata');
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
    return (
        <Grid container={true} alignItems="top">
            {metadataKinds?.map(r => {
                return (
                    <Grid
                        item={true}
                        xs={12}
                        style={{ overflow: 'auto' }}
                        key={r.id}
                    >
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
                                // square
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
