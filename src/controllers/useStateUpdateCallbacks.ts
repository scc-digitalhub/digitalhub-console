// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useCallback } from 'react';
import { UpdateResult, useDataProvider, useResourceContext } from 'react-admin';
import { AwsBody } from '@uppy/aws-s3';
import { UploadResult } from '@uppy/core';
import { Meta } from '@uppy/utils/lib/UppyFile';
import { extractInfo } from '../upload_rename_as_files/utils';

type StateUpdateCallbacks = {
    onBeforeUpload: (record?: any) => Promise<UpdateResult<any> | undefined>;
    onUploadComplete: (
        result: UploadResult<Meta, AwsBody>
    ) => Promise<UpdateResult<any> | undefined>;
};

export const useStateUpdateCallbacks = (props: {
    id: string;
    resource?: string;
}): StateUpdateCallbacks => {
    const { id } = props;
    const resource = useResourceContext(props);
    const dataProvider = useDataProvider();

    const onBeforeUpload = useCallback(
        async (record?: any) => {
            if (dataProvider && resource) {
                try {
                    let data: any = {};
                    if (record) {
                        data = record;
                    } else {
                        //get record
                        const res = await dataProvider.getOne(resource, { id });
                        data = res?.data;
                    }

                    if (!data.status) data.status = {};
                    data.status.state = 'UPLOADING';

                    return dataProvider.update(resource, {
                        id: data.id,
                        data: data,
                        previousData: null,
                    });
                } catch (error) {
                    throw new Error('Error during state update: ' + error);
                }
            }
        },
        [dataProvider, id, resource]
    );

    const onUploadComplete = useCallback(
        async (result: UploadResult<Meta, AwsBody>) => {
            if (dataProvider && resource) {
                try {
                    const res = await dataProvider.getOne(resource, { id });
                    let data = res?.data;

                    if (data) {
                        const state =
                            result.successful &&
                            result.successful.length > 0 &&
                            result.failed?.length === 0
                                ? 'READY'
                                : 'ERROR';
                        data.status.state = state;
                        data.status.files = result.successful?.map(f =>
                            extractInfo(f)
                        );

                        return dataProvider.update(resource, {
                            id: data.id,
                            data: data,
                            previousData: null,
                        });
                    }
                } catch (error) {
                    throw new Error('Error during state update: ' + error);
                }
            }
        },
        [dataProvider, id, resource]
    );

    return {
        onBeforeUpload,
        onUploadComplete,
    };
};
