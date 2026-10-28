// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box } from '@mui/material';
import { JSXElementConstructor, ReactElement, useState } from 'react';
import {
    Button,
    EditBase,
    EditView,
    SaveButton,
    SimpleForm,
    Toolbar,
    useNotify,
    useRedirect,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { FlatCard } from '../../../common/components/layout/FlatCard';
import { transformExtensionPaths } from '../../../features/extensions/utils';
import { useNavigate } from 'react-router';
import { CancelIcon } from '../../../common/components/icons/CancelIcon';
import { FunctionEditForm } from './FunctionEditForm';

const EditToolbar = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(-1);
    };

    return (
        <Toolbar sx={{ justifyContent: 'space-between' }}>
            <SaveButton />
            <Button
                color="info"
                label={translate('actions.cancel')}
                onClick={handleClick}
            >
                <CancelIcon />
            </Button>
        </Toolbar>
    );
};

export const FunctionEdit = (props: {
    actions?:
        | false
        | ReactElement<any, string | JSXElementConstructor<any>>
        | undefined;
}) => {
    const notify = useNotify();
    const redirect = useRedirect();
    const resource = useResourceContext();
    const [isSpecDirty, setIsSpecDirty] = useState<boolean>(false);
    const [isMetadataVersionDirty, setIsMetadataVersionDirty] =
        useState<boolean>(false);

    const onSuccess = () => {};
    const onSettled = data => {
        notify('ra.notification.updated', {
            type: 'info',
            messageArgs: { smart_count: 1 },
        });
        redirect('show', resource, data.id, data);
    };

    const transform = data => {
        const resetMetadataVersion = isSpecDirty && !isMetadataVersionDirty;

        //reset metadata version if new version, unless manually filled
        return {
            ...data,
            ...transformExtensionPaths(data),
            metadata: resetMetadataVersion
                ? { ...data.metadata, version: undefined }
                : data.metadata,
        };
    };

    return (
        <EditBase
            mutationMode="optimistic"
            transform={transform}
            mutationOptions={{
                meta: { update: !isSpecDirty },
                onSuccess: onSuccess,
                onSettled: onSettled,
            }}
        >
            <EditView component={Box} actions={props.actions}>
                <FlatCard sx={{ paddingBottom: '12px' }}>
                    <SimpleForm toolbar={<EditToolbar />}>
                        <FunctionEditForm
                            onSpecDirty={setIsSpecDirty}
                            onMetadataVersionDirty={setIsMetadataVersionDirty}
                        />
                    </SimpleForm>
                </FlatCard>
            </EditView>
        </EditBase>
    );
};
