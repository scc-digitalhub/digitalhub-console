// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { BackButton } from '@dslab/ra-back-button';
import { Box, FormControlLabel, Switch } from '@mui/material';
import { useState } from 'react';
import {
    EditButton,
    TopToolbar,
    useGetList,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { DownloadButton } from '../buttons/DownloadButton';
import { InspectButton } from '@dslab/ra-inspect-button';
import { ExportRecordButton } from '@dslab/ra-export-record-button';
import { DeleteWithConfirmButtonByName } from '../buttons/DeleteWithConfirmButtonByName';
import { useRootSelector } from '@dslab/ra-root-selector';

/**
 * Top toolbar for show pages. Displays the following buttons:
 * back, edit, download (if the record has a file), inspect, export, delete (with confirm).
 * @returns
 */
export const ShowToolbar = () => {
    const record = useRecordContext();
    const resource = useResourceContext();
    const translate = useTranslate();
    const { root } = useRootSelector();
    const [checked, setChecked] = useState(false);
    const { data } = useGetList(resource, {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'created', order: 'DESC' },
        filter: { name: record?.name, versions: 'all' },
    });

    const handleChange = (e: any) => {
        setChecked(e.target.checked);
    };

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

    const additionalConfirmContent = (
        <Box>
            <FormControlLabel
                control={<Switch checked={checked} onChange={handleChange} />}
                label={translate('actions.delete_all_versions')}
            />
        </Box>
    );

    return (
        <TopToolbar>
            <BackButton />
            <EditButton style={{ marginLeft: 'auto' }} />
            {record?.status?.files?.length === 1 && (
                <DownloadButton source="spec.path" />
            )}
            <InspectButton fullWidth />
            <ExportRecordButton language="yaml" color="info" />
            <DeleteWithConfirmButtonByName
                additionalContent={additionalConfirmContent}
                deleteAll={checked}
                redirect={redirect}
                translateOptions={{ id: record?.id }}
                askForCascade
            />
        </TopToolbar>
    );
};
