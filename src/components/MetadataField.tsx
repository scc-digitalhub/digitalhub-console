import { AccordionSummary, Typography, AccordionDetails } from "@mui/material";
import { createMetadataViewUiSchema } from "../common/schemas";
import { useGetSchemas } from "../controllers/schemaController";
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRecordContext, useTranslate } from "react-admin";
import { styled } from '@mui/material/styles';
import { JsonSchemaField } from "./JsonSchema";

const Accordion = styled((props: AccordionProps) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    width:`100%`,
    border: `1px solid ${theme.palette.divider}`,
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
export const MetadataField = ({ prompt }: any) => {
    const record = useRecordContext();
    const translate = useTranslate();
    const { data: schemas, isLoading, error } = useGetSchemas('metadata');
    const metadataKinds = schemas
        ? schemas.map(s => ({
              id: s.kind,
              name: s.kind,
              schema: s.schema,
          }))
        : [];
    return (
        <>
        {metadataKinds &&
            metadataKinds.map(r => {
                return (
                    <Accordion elevation={0} square disableGutters defaultExpanded={r.id==="metadata.base"}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <Typography variant="h5">
                                {translate(r.schema.title)}
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <JsonSchemaField
                                key={r.id}
                                source="metadata"
                                schema={{ ...r.schema, title: '' }}
                                uiSchema={createMetadataViewUiSchema(
                                    record?.metadata
                                )}
                                label={false}
                            />
                        </AccordionDetails>
                    </Accordion>
                );
            })}
            </>
    );
};
