// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { JSXElementConstructor, ReactElement, useState } from 'react';
import { useRootSelector } from '@dslab/ra-root-selector';
import { Box } from '@mui/material';
import {
    CreateBase,
    CreateView,
    MutationMode,
    RedirectionSideEffect,
    useNotify,
    useRedirect,
    useResourceContext,
} from 'react-admin';
import { randomId } from '../../../common/utils/helpers';
import { UploadCoordinatorContext } from '../../../features/files/upload/UploaderContext';
import { useResourceUploader } from '../../../features/files/upload/useRecordUploader';
import { transformModelData } from '../utils';
import {
    MutationFunctionContext,
    UseMutationOptions,
} from '@tanstack/react-query';

export const ModelCreate = (props: {
    id?: string;
    template?: any;
    redirect?: RedirectionSideEffect;
    mutationMode?: MutationMode;
    mutationOptions?: UseMutationOptions & { meta?: any };
    actions?:
        | false
        | ReactElement<any, string | JSXElementConstructor<any>>
        | undefined;
    children: ReactElement;
}) => {
    const {
        id: idProps,
        template,
        mutationMode = 'pessimistic',
        children,
    } = props;
    const { root } = useRootSelector();
    const resource = useResourceContext();
    const notify = useNotify();
    const redirect = useRedirect();

    //initialize
    const [id] = useState(idProps ?? randomId);
    const uploader = useResourceUploader({ id });

    const onSuccess = (
        data,
        variables,
        onMutateResult,
        context: MutationFunctionContext
    ) => {
        if (props.mutationOptions?.onSuccess) {
            props.mutationOptions.onSuccess(
                data,
                variables,
                onMutateResult,
                context
            );
        }
    };

    const onSettled = async (
        data: any,
        error: any,
        variables,
        onMutateResult,
        context: MutationFunctionContext
    ) => {
        if (error) {
            //onError already handles notify
            return;
        }

        //wait for uploaded
        await uploader.prepare(data);
        uploader.start();

        //always notify
        notify('ra.notification.created', { messageArgs: { smart_count: 1 } });

        if (props.mutationOptions?.onSettled) {
            props.mutationOptions.onSettled(
                data,
                error,
                variables,
                onMutateResult,
                context
            );
        }

        if (props.redirect === false) {
            return;
        }

        redirect(props.redirect ?? 'list', resource);
    };

    const defaultValues = template
        ? { ...template, id, path: template?.spec?.path }
        : { id, spec: {} };

    return (
        <CreateBase
            transform={data =>
                transformModelData(data, root, uploader.files.length > 0)
            }
            mutationOptions={{ onSuccess, onSettled }}
            record={defaultValues}
            redirect={false}
            mutationMode={mutationMode}
        >
            <UploadCoordinatorContext.Provider value={uploader}>
                <CreateView component={Box} actions={props.actions}>
                    {children}
                </CreateView>
            </UploadCoordinatorContext.Provider>
        </CreateBase>
    );
};
