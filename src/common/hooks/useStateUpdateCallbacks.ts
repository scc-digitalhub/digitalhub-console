// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useCallback } from 'react';
import {
    DataProvider,
    UpdateResult,
    useDataProvider,
    useResourceContext,
} from 'react-admin';
import { AwsBody } from '@uppy/aws-s3';
import { UploadResult } from '@uppy/core';
import { Meta } from '@uppy/utils/lib/UppyFile';
import { extractInfo } from '../../features/files/upload/utils';

type StateUpdateResult = Promise<UpdateResult<any> | undefined>;

type StateUpdateCallbacks = {
    onBeforeUpload: () => StateUpdateResult;
    onUploadComplete: (result: UploadResult<Meta, AwsBody>) => StateUpdateResult;
    onUploadError: (message?: string) => StateUpdateResult;
};

/**
 * Set status.state (plus extra status fields) of an entity.
 * Always fetches fresh and touches only status: other writers may have updated the record.
 */
export const updateUploadState = async (
    dataProvider: DataProvider,
    resource: string,
    id: string,
    state: string,
    extra: Record<string, any> = {}
): Promise<UpdateResult<any>> => {
    const { data } = await dataProvider.getOne(resource, { id });
    return dataProvider.update(resource, {
        id: data.id,
        data: { ...data, status: { ...data.status, state, ...extra } },
        previousData: data,
    });
};

export const uploadResultStatus = (result: UploadResult<Meta, AwsBody>) => ({
    state:
        result.successful &&
        result.successful.length > 0 &&
        result.failed?.length === 0
            ? 'READY'
            : 'ERROR',
    files: result.successful?.map(f => extractInfo(f)),
});

export const useStateUpdateCallbacks = (props: {
    id: string;
    resource?: string;
}): StateUpdateCallbacks => {
    const { id } = props;
    const resource = useResourceContext(props);
    const dataProvider = useDataProvider();

    const updateState = useCallback(
        async (state: string, extra: Record<string, any> = {}) => {
            if (!dataProvider || !resource) return undefined;
            return updateUploadState(dataProvider, resource, id, state, extra);
        },
        [dataProvider, id, resource]
    );

    const onBeforeUpload = useCallback(
        () => updateState('UPLOADING'),
        [updateState]
    );

    const onUploadComplete = useCallback(
        (result: UploadResult<Meta, AwsBody>) => {
            const { state, files } = uploadResultStatus(result);
            return updateState(state, { files });
        },
        [updateState]
    );

    const onUploadError = useCallback(
        (message?: string) => updateState('ERROR', { message }),
        [updateState]
    );

    return {
        onBeforeUpload,
        onUploadComplete,
        onUploadError,
    };
};
