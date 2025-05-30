import {
    Card,
    CardContent,
    CardHeader,
    Container,
    Grid,
    Stack,
    Typography,
    Alert,
} from '@mui/material';
import {
    Labeled,
    LoadingIndicator,
    RecordContextProvider,
    TextField,
    useGetIdentity,
    useTranslate,
    Button,
} from 'react-admin';
import { PageTitle } from '../../components/PageTitle';
import { AccountIcon } from './icon';
import { IdField } from '../../components/IdField';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { MyProjects } from './MyProjects';
import { MyPersonalTokens } from './MyPersonalTokens';
import { MyRefreshTokens } from './MyRefreshTokens';

export const MyAccount = () => {
    const translate = useTranslate();
    const { data: identity, isLoading: identityLoading } = useGetIdentity();

    if (identityLoading) {
        return <LoadingIndicator />;
    }

    return (
        <Container maxWidth="lg">
            <PageTitle
                text={identity?.fullName || ''}
                icon={<AccountIcon fontSize={'large'} />}
            />
            <Grid container spacing={2} pb={1}>
                <Grid item xs={12} md={12}>
                    <RecordContextProvider value={identity}>
                        <Card>
                            <CardHeader
                                title={
                                    <Typography variant="h6">
                                        {translate('pages.myaccount.title')}
                                    </Typography>
                                }
                            />
                            <CardContent>
                                <Stack direction={'row'} spacing={3}>
                                    <Labeled>
                                        <TextField
                                            source="fullName"
                                            label="fields.name.title"
                                        />
                                    </Labeled>
                                    <Labeled>
                                        <IdField source="id" />
                                    </Labeled>
                                </Stack>
                            </CardContent>
                        </Card>
                    </RecordContextProvider>
                </Grid>

                <Grid item xs={12} md={12}>
                    <MyProjects />
                </Grid>

                <Grid item xs={12} md={12}>
                    <MyPersonalTokens />
                </Grid>

                <Grid item xs={12} md={12}>
                    <MyRefreshTokens />
                </Grid>

                <Grid item xs={12} md={12}>
                    <RecordContextProvider value={identity}>
                        <Card>
                            <CardHeader
                                title={
                                    <Typography variant="h6">
                                        {translate(
                                            'pages.myaccount.remove.title'
                                        )}
                                    </Typography>
                                }
                                subheader={translate(
                                    'pages.myaccount.remove.subtitle'
                                )}
                            />
                            <CardContent>
                                <Alert severity="error">
                                    <Typography variant="body2" mb={2}>
                                        {translate(
                                            'pages.myaccount.remove.message'
                                        )}
                                    </Typography>
                                    <Button
                                        label={'ra.action.delete'}
                                        onClick={e => e.stopPropagation()}
                                        disabled
                                    >
                                        <PersonOffIcon />
                                    </Button>
                                </Alert>
                            </CardContent>
                        </Card>
                    </RecordContextProvider>
                </Grid>
            </Grid>
        </Container>
    );
};
