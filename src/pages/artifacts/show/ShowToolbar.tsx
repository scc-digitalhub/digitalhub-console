// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { BackButton } from '@dslab/ra-back-button';
import { useState } from 'react';
import {
    EditButton,
    Exporter,
    TopToolbar,
    useGetList,
    useRecordContext,
    useResourceContext,
    useResourceDefinition,
} from 'react-admin';
import { InspectButton } from '@dslab/ra-inspect-button';
import { ExportRecordButton } from '@dslab/ra-export-record-button';
import { DeleteWithConfirmButtonByName } from '../buttons/delete/DeleteWithConfirmButtonByName';
import { useRootSelector } from '@dslab/ra-root-selector';
import { DownloadButton } from '../../../features/files/download/components/DownloadButton';

/**
 * Top toolbar for show pages. Displays the following buttons:
 * back, edit, download (if the record has a file), inspect, export, delete (with confirm).
 * @returns
 */
export const ShowToolbar = (props: { exporter?: Exporter }) => {
    const { exporter } = props;
    const record = useRecordContext();
    const resource = useResourceContext();
    const resourceDefinition = useResourceDefinition();
    const { root } = useRootSelector();
    const [checked, setChecked] = useState(false);
    const { data } = useGetList(
        resource || '',
        {
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'created', order: 'DESC' },
            filter: { name: record?.name, versions: 'all' },
        },
        { enabled: !!resource && !!resourceDefinition?.options?.hasVersions }
    );

    //redirect to list after delete if all versions have been deleted or there is no other version
    const toListAfterDelete = checked || (data && data.length < 2);

    let redirect = `/-/${root}/${resource}`;
    if (data && !toListAfterDelete) {
        if (data[0].id == record?.id) {
            //record has been deleted, redirect to second more recent version
            redirect += `/${data[1].id}/show`;
        } else {
            //redirect to more recent version
            redirect += `/${data[0].id}/show`;
        }
    }

    const askForDeleteAll = resourceDefinition?.options?.hasVersions;
    const askForCascade = resourceDefinition?.options?.hasFiles;

    if (!resourceDefinition) {
        return (
            <TopToolbar>
                <BackButton />
            </TopToolbar>
        );
    }

    return (
        <TopToolbar>
            <BackButton style={{ marginRight: 'auto' }} />
            {resourceDefinition.hasEdit && <EditButton />}
            {resourceDefinition.options?.hasFiles &&
                record?.status?.files?.length === 1 && <DownloadButton />}
            <InspectButton fullWidth />
            <ExportRecordButton
                language="yaml"
                color="info"
                exporter={exporter}
            />
            <DeleteWithConfirmButtonByName
                cascade
                redirect={redirect}
                titleTranslateOptions={{ id: record?.id }}
                askForDeleteAll={askForDeleteAll}
                onDeleteAll={value => setChecked(value)}
                askForCascade={askForCascade}
            />
        </TopToolbar>
    );
};
