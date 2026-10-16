import { Alert, Box } from '@mui/material';
import { Stack } from '@mui/system';
import { useRecordContext, Labeled, TextField } from 'react-admin';
import { IdField } from '../fields/IdField';
import { StateChips } from '../StateChips';
import { MetadataField } from '../../../features/metadata/components/MetadataField';

export const MetadataTab = () => {
    const record = useRecordContext();

    if (!record) return <> </>;

    return (
        <Box>
            <Stack direction={'row'} spacing={3}>
                <Labeled>
                    <TextField source="kind" />
                </Labeled>

                <Labeled>
                    <IdField source="id" />
                </Labeled>
            </Stack>

            <Labeled label="fields.status.state">
                <StateChips source="status.state" label="fields.status.state" />
            </Labeled>
            {record.status?.message && (
                <Labeled label="fields.events.message.title">
                    <Alert
                        sx={{ whiteSpace: 'pre-wrap' }}
                        // icon={false}
                        severity={
                            record.status?.state === 'RUNNING'
                                ? 'info'
                                : record.status?.state === 'ERROR'
                                ? 'error'
                                : record.status?.state === 'COMPLETED'
                                ? 'success'
                                : 'warning'
                        }
                        // variant="outlined"
                    >
                        {record.status?.message}
                    </Alert>
                </Labeled>
            )}
            <MetadataField />
        </Box>
    );
};
