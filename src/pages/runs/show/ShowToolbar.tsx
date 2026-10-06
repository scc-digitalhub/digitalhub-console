// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    DeleteWithConfirmButton,
    FunctionField,
    TopToolbar,
    useRecordContext,
} from 'react-admin';
import { BackButton } from '@dslab/ra-back-button';
import { ExportRecordButton } from '@dslab/ra-export-record-button';
import { InspectButton } from '@dslab/ra-inspect-button';
import { StopButton } from '../components/StopButton';

import { CloneButton } from '../components/CloneButton';
import { ClientButton } from '../../../features/httpclients/ClientButton';
import { useRootSelector } from '@dslab/ra-root-selector';

export const ShowToolbar = () => {
    const record = useRecordContext();
    const { root } = useRootSelector();

    return (
        <TopToolbar>
            <BackButton />
            <InspectButton style={{ marginLeft: 'auto' }} fullWidth />
            {record?.status?.service && <ClientButton />}
            <FunctionField
                render={record =>
                    record.status?.state == 'RUNNING' ? (
                        <StopButton record={record} />
                    ) : record.status?.state == 'STOPPED' ? (
                        <StopButton disabled />
                    ) : null
                }
            />
            {root && <CloneButton />}
            <ExportRecordButton language="yaml" />
            <DeleteWithConfirmButton />
        </TopToolbar>
    );
};
