import {
    DeleteWithConfirmButton,
    Labeled,
    Show,
    SimpleShowLayout,
    TextField,
    TopToolbar,
    useTranslate,
} from 'react-admin';
import { Grid, Typography } from '@mui/material';
import { BackButton } from '@dslab/ra-back-button';
import { ExportRecordButton } from '@dslab/ra-export-record-button';
import { InspectButton } from '@dslab/ra-inspect-button';

export const RunShowLayout = () => {
    const translate = useTranslate();

    return (
        <Grid>
            <Typography variant="h6" gutterBottom>
                {translate('resources.runs.title')}
            </Typography>
            
            <SimpleShowLayout>
                <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <Labeled label="My Label">
                            <TextField source="name" />
                        </Labeled>
                    </Grid>
                </Grid>
            </SimpleShowLayout>
        </Grid>
    );
};

const ShowToolbar = () => (
    <TopToolbar>
        <BackButton />
        <InspectButton />
        <ExportRecordButton language="yaml" />
        <DeleteWithConfirmButton />
    </TopToolbar>
);

export const RunShow = () => {
    return (
        <Show
            actions={<ShowToolbar />}
            sx={{ '& .RaShow-card': { width: '50%' } }}
        >
            <RunShowLayout />
        </Show>
    );
};
