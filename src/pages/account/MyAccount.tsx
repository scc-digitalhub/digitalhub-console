import { RootSelectorButton, useRootSelector } from '@dslab/ra-root-selector';

import {
    Box,
    Card,
    Dialog,
    CardContent,
    CardHeader,
    Container,
    Grid,
    Stack,
    Typography,
    Alert,
} from '@mui/material';
import { useState, useCallback } from 'react';
import {
    Datagrid,
    DateField,
    DeleteWithConfirmButton,
    Labeled,
    List,
    LoadingIndicator,
    NumberField,
    RecordContextProvider,
    required,
    SelectArrayInput,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput,
    Toolbar,
    TopToolbar,
    useDataProvider,
    useGetIdentity,
    useGetResourceLabel,
    useNotify,
    useRefresh,
    useTranslate,
    Button,
    FunctionField,
} from 'react-admin';
import { PageTitle } from '../../components/PageTitle';
import { ShareButton } from '../../components/buttons/ShareButton';
import { useProjectPermissions } from '../../provider/authProvider';
import { AccountIcon } from './icon';
import { IdField } from '../../components/IdField';
import { ChipsField } from '../../components/ChipsField';
import { RowButtonGroup } from '../../components/buttons/RowButtonGroup';
import { DeleteWithDialogButton } from '@dslab/ra-delete-dialog-button';
import { CreateProjectButton } from '../../resources/projects';
import { CreateInDialogButton } from '@dslab/ra-dialog-crud';
import { isAlphaNumeric } from '../../common/helper';
import CloseIcon from '@mui/icons-material/Close';
import PersonOffIcon from '@mui/icons-material/PersonOff';

export const MyAccount = () => {
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const { isAdmin } = useProjectPermissions();
    const { data: identity, isLoading: identityLoading } = useGetIdentity();
    const { selectRoot } = useRootSelector();

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

export const MyProjects = () => {
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const { isAdmin } = useProjectPermissions();
    const { data: identity, isLoading: identityLoading } = useGetIdentity();
    const { selectRoot } = useRootSelector();
    const getResourceLabel = useGetResourceLabel();

    if (identityLoading) {
        return <LoadingIndicator />;
    }

    return (
        <Card>
            <CardHeader
                title={
                    <Typography variant="h6">
                        {getResourceLabel('projects', 2)}
                    </Typography>
                }
            />
            <CardContent>
                <List
                    resource="projects"
                    component={Box}
                    sort={{ field: 'updated', order: 'DESC' }}
                    filter={{ user: identity?.id }}
                    storeKey={false}
                    actions={<ProjectsToolbar />}
                    disableSyncWithLocation
                >
                    <Datagrid bulkActionButtons={false}>
                        <TextField
                            source="name"
                            label="fields.name.title"
                            sortable={false}
                        />
                        <DateField
                            source="metadata.updated"
                            label="fields.updated.title"
                            showDate={true}
                            showTime={true}
                            sortable={false}
                        />

                        <ChipsField
                            label="fields.labels.title"
                            source="metadata.labels"
                            sortable={false}
                        />
                        <RowButtonGroup>
                            <RootSelectorButton />
                            <ShareButton />
                            <DeleteWithDialogButton
                                redirect="/account"
                                mutationOptions={{
                                    meta: { cascade: true },
                                }}
                            />
                        </RowButtonGroup>
                    </Datagrid>
                </List>
            </CardContent>
        </Card>
    );
};

const ProjectsToolbar = () => {
    return (
        <TopToolbar>
            <CreateProjectButton />
        </TopToolbar>
    );
};

const MyRefreshTokens = () => {
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const { isAdmin } = useProjectPermissions();
    const { data: identity, isLoading: identityLoading } = useGetIdentity();
    const { selectRoot } = useRootSelector();
    const getResourceLabel = useGetResourceLabel();

    if (identityLoading) {
        return <LoadingIndicator />;
    }

    return (
        <Card>
            <CardHeader
                title={
                    <Typography variant="h6">
                        {getResourceLabel('refreshtokens', 2)}
                    </Typography>
                }
                subheader={translate('resources.refreshtokens.description')}
            />
            <CardContent>
                <List
                    resource="tokens/refresh"
                    component={Box}
                    sort={{ field: 'updated', order: 'DESC' }}
                    storeKey={false}
                    actions={false}
                    disableSyncWithLocation
                    pagination={false}
                >
                    <Datagrid bulkActionButtons={false}>
                        <TextField
                            source="ipAddress"
                            label="fields.ipAddress.title"
                            sortable={false}
                        />
                        {/* <FunctionField
                            source="validity"
                            sortable={false}
                            render={() => (
                                <Stack direction={'column'}>
                                    <DateField
                                        source="issuedAt"
                                        label="fields.issuedAt.title"
                                        showDate={true}
                                        showTime={true}
                                        sortable={false}
                                    />
                                    <DateField
                                        source="expiresAt"
                                        label="fields.expiresAt.title"
                                        showDate={true}
                                        showTime={true}
                                        sortable={false}
                                    />
                                </Stack>
                            )}
                        /> */}
                        <DateField
                            source="expiresAt"
                            label="fields.expiresAt.title"
                            showDate={true}
                            showTime={true}
                            sortable={false}
                        />
                        <ChipsField
                            label="fields.scopes.title"
                            source="scopes"
                            sortable={false}
                        />
                        <RowButtonGroup>
                            <DeleteWithConfirmButton
                                redirect="/account"
                                translateOptions={{
                                    name: getResourceLabel('refreshtokens', 1),
                                }}
                            />
                        </RowButtonGroup>
                    </Datagrid>
                </List>
            </CardContent>
        </Card>
    );
};

const MyPersonalTokens = () => {
    const dataProvider = useDataProvider();
    const translate = useTranslate();
    const { isAdmin } = useProjectPermissions();
    const { data: identity, isLoading: identityLoading } = useGetIdentity();
    const { selectRoot } = useRootSelector();
    const getResourceLabel = useGetResourceLabel();

    if (identityLoading) {
        return <LoadingIndicator />;
    }

    return (
        <Card>
            <CardHeader
                title={
                    <Typography variant="h6">
                        {getResourceLabel('personalaccesstokens', 2)}
                    </Typography>
                }
                subheader={translate(
                    'resources.personalaccesstokens.description'
                )}
            />
            <CardContent>
                <List
                    resource="tokens/personal"
                    component={Box}
                    sort={{ field: 'updated', order: 'DESC' }}
                    storeKey={false}
                    actions={<PersonalTokensToolbar />}
                    empty={false}
                    disableSyncWithLocation
                    pagination={false}
                >
                    <Datagrid bulkActionButtons={false}>
                        <TextField
                            source="name"
                            label="fields.name.title"
                            sortable={false}
                        />
                        {/* <DateField
                            source="issuedAt"
                            label="fields.issuedAt.title"
                            showDate={true}
                            showTime={true}
                            sortable={false}
                        /> */}
                        <DateField
                            source="expiresAt"
                            label="fields.expiresAt.title"
                            showDate={true}
                            showTime={true}
                            sortable={false}
                        />

                        <ChipsField
                            label="fields.scopes.title"
                            source="scopes"
                            sortable={false}
                        />
                        <FunctionField
                            render={r => (
                                <RowButtonGroup>
                                    <DeleteWithConfirmButton
                                        redirect="/account"
                                        translateOptions={{
                                            name: getResourceLabel(
                                                'personalaccesstokens',
                                                1
                                            ),
                                            id: r.name,
                                        }}
                                    />
                                </RowButtonGroup>
                            )}
                        />
                    </Datagrid>
                </List>
            </CardContent>
        </Card>
    );
};

export const scopes = ['profile', 'openid', 'credentials'];

const PersonalTokensToolbar = () => {
    const notify = useNotify();
    const refresh = useRefresh();
    const translate = useTranslate();
    const [result, setResult] = useState<any | null>(null);
    const getResourceLabel = useGetResourceLabel();

    const open = !!result;

    const handleDialogClose = e => {
        e.stopPropagation();
        setResult(null);
    };

    const handleClick = useCallback(e => {
        e.stopPropagation();
    }, []);

    return (
        <TopToolbar>
            <CreateInDialogButton
                fullWidth
                maxWidth={'md'}
                variant="contained"
                closeOnClickOutside={false}
                mutationOptions={{
                    onSuccess: data => {
                        console.log('got', data);
                        setResult(data);
                    },
                }}
            >
                <SimpleForm>
                    <TextInput
                        source="name"
                        validate={[required(), isAlphaNumeric()]}
                    />
                    <SelectArrayInput
                        choices={scopes.map(s => ({
                            id: s,
                            name: s,
                        }))}
                        name="scopes"
                    />
                </SimpleForm>
            </CreateInDialogButton>
            <Dialog
                open={open}
                onClose={handleDialogClose}
                // onClick={handleClick}
                fullWidth
                maxWidth="md"
                sx={{
                    '& .MuiDialog-paper': {
                        paddingX: '24px',
                    },
                }}
            >
                <RecordContextProvider value={result}>
                    <SimpleShowLayout sx={{ mb: 1 }}>
                        <Typography variant="h6" gutterBottom>
                            {getResourceLabel('personalaccesstokens', 1)}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            {translate(
                                'pages.personalaccesstokens.create.successMessage'
                            )}
                        </Typography>

                        <Stack direction={'row'} columnGap={2} spacing={1}>
                            <Labeled>
                                <IdField
                                    source="access_token"
                                    label="fields.token.title"
                                />
                            </Labeled>
                            <Labeled>
                                <NumberField
                                    source="expires_in"
                                    label="fields.expiresAt.title"
                                />
                            </Labeled>
                        </Stack>
                    </SimpleShowLayout>
                </RecordContextProvider>
                <Toolbar>
                    <Button
                        label={'ra.action.close'}
                        onClick={handleDialogClose}
                    >
                        <CloseIcon />
                    </Button>
                </Toolbar>
            </Dialog>
        </TopToolbar>
    );
};
