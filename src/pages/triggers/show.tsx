// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    DeleteWithConfirmButton,
    FunctionField,
    ShowBase,
    ShowView,
    TopToolbar,
} from 'react-admin';
import { Container } from '@mui/material';
import { BackButton } from '@dslab/ra-back-button';
import { ExportRecordButton } from '@dslab/ra-export-record-button';
import { InspectButton } from '@dslab/ra-inspect-button';
import { TriggerIcon } from '../../resources/triggers/icon';
import { ShowPageTitle } from '../../common/components/layout/PageTitle';
import { DeactivateButton } from '../../resources/triggers/components/DeactivateButton';
import { ActivateButton } from '../../resources/triggers/components/ActivateButton';

import { SHOW_VIEW_PROPS } from '../../common/theme';
import { TriggerShow } from '../../resources/triggers/TriggerShow';

const ShowToolbar = () => (
    <TopToolbar>
        <BackButton />
        <InspectButton style={{ marginLeft: 'auto' }} fullWidth />
        <FunctionField
            render={record =>
                record.status?.state == 'RUNNING' ? (
                    <DeactivateButton record={record} />
                ) : record.status?.state == 'STOPPED' ? (
                    <ActivateButton record={record} />
                ) : null
            }
        />
        <ExportRecordButton language="yaml" />
        <DeleteWithConfirmButton />
    </TopToolbar>
);

export const TriggerShowView = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ShowBase>
                <>
                    <ShowPageTitle icon={<TriggerIcon fontSize={'large'} />} />
                    <ShowView actions={<ShowToolbar />} {...SHOW_VIEW_PROPS}>
                        <TriggerShow />
                    </ShowView>
                </>
            </ShowBase>
        </Container>
    );
};
