// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { ComponentType, useEffect } from 'react';
import { FileInfo } from '../../features/files/info/types';
import {
    Identifier,
    RaRecord,
    useRecordContext,
    useResourceContext,
    useUpdate,
} from 'react-admin';
import { useGetNestedFileInfo } from '../../features/files/info/useGetNestedInfo';

const filesDiffer = (
    files: FileInfo[],
    recordFiles: FileInfo[] | undefined
): boolean => {
    if (!recordFiles || files.length !== recordFiles.length) return true;

    return !files.every(
        file =>
            recordFiles.findIndex(
                f => f.name == file.name && f.size === file.size
            ) >= 0
    );
};

/**
 * Wrap show component of resources with files to sync record files with the store
 */
export const ShowComponent = (props: {
    InnerShow: ComponentType<{ record: RaRecord<Identifier> }>;
}) => {
    const { InnerShow } = props;
    const resource = useResourceContext();
    const record = useRecordContext();
    const [update, { data, isPending }] = useUpdate();
    const getFileInfo = useGetNestedFileInfo();

    useEffect(() => {
        if (record?.spec?.path && resource && !isPending && !data) {
            getFileInfo({ path: record.spec.path })
                .then(res => {
                    if (filesDiffer(res, record.status?.files)) {
                        //update record
                        update(resource, {
                            id: record.id,
                            data: {
                                ...record,
                                status: { ...record.status, files: res },
                            },
                        });
                    }
                })
                .catch(() => {
                    //fail silently
                });
        }
    }, [data, getFileInfo, isPending, record, resource, update]);

    return <InnerShow record={data && !isPending ? data : record} />;
};
