// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Box,
    Card,
    Dialog,
    CardContent,
    CardHeader,
    Stack,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import {
    Datagrid,
    DateField,
    DeleteWithConfirmButton,
    Labeled,
    List,
    LoadingIndicator,
    RecordContextProvider,
    required,
    SelectArrayInput,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput,
    Toolbar,
    TopToolbar,
    useGetIdentity,
    useGetResourceLabel,
    useTranslate,
    Button,
    FunctionField,
} from 'react-admin';
import { CreateInDialogButton } from '@dslab/ra-dialog-crud';
import CloseIcon from '@mui/icons-material/Close';
import { ChipsField } from '../../../common/components/ChipsField';
import { RowButtonGroup } from '../../../common/components/buttons/RowButtonGroup';
import { formatDuration, isAlphaNumeric } from '../../../common/helper';
import { IdField } from '../../../common/components/IdField';

export const MyPersonalTokens = () => {
    const translate = useTranslate();
    const { isLoading: identityLoading } = useGetIdentity();
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
                                        titleTranslateOptions={{
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

const scopes = ['profile', 'openid', 'credentials'];

const PersonalTokensToolbar = () => {
    const translate = useTranslate();
    const [result, setResult] = useState<any | null>(null);
    const getResourceLabel = useGetResourceLabel();

    const open = !!result;

    const handleDialogClose = e => {
        e.stopPropagation();
        setResult(null);
    };

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
                                <FunctionField
                                    render={r =>
                                        translate(
                                            'fields.expiresIn.value',
                                            formatDuration(r.expires_in * 1000)
                                        )
                                    }
                                    label="fields.expiresIn.title"
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
