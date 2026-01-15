// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import {
    Datagrid,
    DateField,
    DeleteWithConfirmButton,
    List,
    LoadingIndicator,
    TextField,
    useGetIdentity,
    useGetResourceLabel,
    useTranslate,
} from 'react-admin';
import { ChipsField } from '../../../components/ChipsField';
import { RowButtonGroup } from '../../../components/buttons/RowButtonGroup';

export const MyRefreshTokens = () => {
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
                                titleTranslateOptions={{
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
