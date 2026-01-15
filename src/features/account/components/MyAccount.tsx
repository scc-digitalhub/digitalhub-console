// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

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
    DeleteWithConfirmButton,
    useGetResourceLabel,
    ResourceContextProvider,
    useLogout,
} from 'react-admin';
import { AccountIcon } from './icon';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { MyProjects } from './MyProjects';
import { MyPersonalTokens } from './MyPersonalTokens';
import { MyRefreshTokens } from './MyRefreshTokens';
import { PageTitle } from '../../../common/components/PageTitle';
import { IdField } from '../../../common/components/IdField';

export const MyAccount = () => {
    const translate = useTranslate();
    const { data: identity, isLoading: identityLoading } = useGetIdentity();
    const getResourceLabel = useGetResourceLabel();
    const logout = useLogout();

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
                <Grid size={{ xs: 12, md: 12 }}>
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

                <Grid size={{ xs: 12, md: 12 }}>
                    <MyProjects />
                </Grid>

                <Grid size={{ xs: 12, md: 12 }}>
                    <MyPersonalTokens />
                </Grid>

                <Grid size={{ xs: 12, md: 12 }}>
                    <MyRefreshTokens />
                </Grid>

                <Grid size={{ xs: 12, md: 12 }}>
                    {identity && (
                        <ResourceContextProvider value="users">
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
                                            <DeleteWithConfirmButton
                                                icon={<PersonOffIcon />}
                                                redirect={false}
                                                mutationOptions={{
                                                    onSettled: () =>
                                                        logout(
                                                            null,
                                                            '/login',
                                                            false
                                                        ),
                                                }}
                                                record={{ id: 'me' }}
                                                titleTranslateOptions={{
                                                    name: getResourceLabel(
                                                        'users',
                                                        1
                                                    ),
                                                    id: identity.name,
                                                }}
                                                confirmColor="warning"
                                                color="error"
                                                variant="contained"
                                                size="small"
                                                successMessage="pages.myaccount.remove.success"
                                            />
                                        </Alert>
                                    </CardContent>
                                </Card>
                            </RecordContextProvider>
                        </ResourceContextProvider>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};
