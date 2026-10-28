// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    CloneButton,
    DeleteWithConfirmButton,
    ShowView,
    TopToolbar,
    useRecordContext,
} from 'react-admin';
import { Box, Container } from '@mui/material';
import { ShowBaseLive } from '../../features/notifications/components/ShowBaseLive';
import { MetricsField } from '../../features/k8smetrics/MetricsField';
import { SHOW_VIEW_PROPS } from '../../common/theme';
import { RunShowTitle } from '../../resources/runs/show/RunShowTitle';
import { BackButton } from '@dslab/ra-back-button';
import { ExportRecordButton } from '@dslab/ra-export-record-button';
import { InspectButton } from '@dslab/ra-inspect-button';
import { useRootSelector } from '@dslab/ra-root-selector';
import { ClientButton } from '../../features/httpclients/ClientButton';
import { StopButton } from '../../resources/runs/components/StopButton';
import { RunShow } from '../../resources/runs/show/RunShow';

export const RunShowView = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ShowBaseLive>
                <>
                    <RunShowTitle />
                    <Box sx={{ mb: 2, mt: 1, pl: 1 }}>
                        <MetricsField
                            size="small"
                            fontSize={'small'}
                            labels
                            metrics={true}
                        />
                    </Box>
                    <ShowView actions={<ShowToolbar />} {...SHOW_VIEW_PROPS}>
                        <RunShow />
                    </ShowView>
                </>
            </ShowBaseLive>
        </Container>
    );
};

const ShowToolbar = () => {
    const record = useRecordContext();
    const { root } = useRootSelector();

    return (
        <TopToolbar>
            <BackButton />
            <InspectButton style={{ marginLeft: 'auto' }} fullWidth />
            {record?.status?.service && <ClientButton />}
            <StopButton />
            {root && <CloneButton />}
            <ExportRecordButton language="yaml" />
            <DeleteWithConfirmButton />
        </TopToolbar>
    );
};
