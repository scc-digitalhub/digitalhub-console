import {
    DateField,
    DeleteWithConfirmButton,
    Labeled,
    Show,
    ShowBase,
    ShowView,
    SimpleShowLayout,
    TextField,
    TopToolbar,
    useTranslate,
} from 'react-admin';
import { Container, Divider, Grid, Stack, Typography } from '@mui/material';
import { BackButton } from '@dslab/ra-back-button';
import { ExportRecordButton } from '@dslab/ra-export-record-button';
import { InspectButton } from '@dslab/ra-inspect-button';
import { RunIcon } from './icon';
import { FlatCard } from '../../components/FlatCard';
import { ShowPageTitle } from '../../components/PageTitle';
import { VersionsListWrapper } from '../../components/VersionsList';
import { StateChips } from '../../components/StateChips';
import { LogsButton } from '../../components/LogsButton';

export const RunShowLayout = () => {
    const translate = useTranslate();

    return (
        <Grid>
            <Typography variant="h6" gutterBottom>
                {translate('resources.run.title')}
            </Typography>
            <SimpleShowLayout>
                <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <Labeled label={translate('resources.run.labelName')}>
                            <TextField source="name" />
                        </Labeled>
                    </Grid>
                </Grid>
            </SimpleShowLayout>
        </Grid>
    );
};

export const RunShowComponent = () => {
    return (
        <SimpleShowLayout>
            <Stack direction={'row'} spacing={3}>
                <Labeled>
                    <TextField source="name" />
                </Labeled>

                <Labeled>
                    <TextField source="kind" />
                </Labeled>
            </Stack>
            <Labeled>
                <TextField source="key" />
            </Labeled>
            <Divider />
            <Stack direction={'row'} spacing={3}>
                <Labeled>
                    <DateField source="metadata.created" showDate showTime />
                </Labeled>

                <Labeled>
                    <DateField source="metadata.updated" showDate showTime />
                </Labeled>
            </Stack>
            <Labeled>
                <TextField source="spec.task" />
            </Labeled>
            <Labeled>
                <StateChips source="status.state" />
            </Labeled>
        </SimpleShowLayout>
    );
};
const ShowToolbar = () => (
    <TopToolbar>
        <BackButton />
        <LogsButton style={{ marginLeft: 'auto' }}  />
        <InspectButton fullWidth />
        <ExportRecordButton language="yaml" />
        <DeleteWithConfirmButton />
    </TopToolbar>
);

export const RunShow = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ShowBase>
                <>
                    <ShowPageTitle icon={<RunIcon fontSize={'large'} />} />
                    <ShowView
                        actions={<ShowToolbar />}
                        sx={{
                            width: '100%',
                        }}
                        component={FlatCard}
                    >
                        <RunShowComponent />
                    </ShowView>
                </>
            </ShowBase>
        </Container>
    );
};
