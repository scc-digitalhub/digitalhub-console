// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Container } from '@mui/material';
import { useState } from 'react';
import {
    EditButton,
    Exporter,
    ShowBase,
    ShowView,
    TopToolbar,
    useGetList,
    useRecordContext,
    useResourceContext,
    useResourceDefinition,
} from 'react-admin';
import { VersionsListWrapper } from '../../common/components/VersionsList';
import { ShowPageTitle } from '../../common/components/layout/PageTitle';
import { WorkflowIcon } from '../../resources/workflows/icon';
import { exporter } from '../../resources/workflows/exporter';
import { SHOW_VIEW_VERSION_PROPS } from '../../common/theme';
import { BackButton } from '@dslab/ra-back-button';
import { ExportRecordButton } from '@dslab/ra-export-record-button';
import { InspectButton } from '@dslab/ra-inspect-button';
import { useRootSelector } from '@dslab/ra-root-selector';
import { DeleteWithConfirmButtonByName } from '../../common/components/buttons/delete/DeleteWithConfirmButtonByName';
import { ExtensionsToolbarButtons } from '../../features/extensions/components/ExtensionsButtons';
import { WorkflowShow } from '../../resources/workflows/show/WorkflowShow';

export const WorkflowShowView = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ShowBase>
                <>
                    <ShowPageTitle icon={<WorkflowIcon fontSize={'large'} />} />
                    <ShowView
                        actions={<ShowToolbar exporter={exporter} />}
                        aside={<VersionsListWrapper />}
                        {...SHOW_VIEW_VERSION_PROPS}
                    >
                        <WorkflowShow />
                    </ShowView>
                </>
            </ShowBase>
        </Container>
    );
};

const ShowToolbar = (props: { exporter?: Exporter }) => {
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

    return (
        <TopToolbar>
            <BackButton style={{ marginRight: 'auto' }} />
            <ExtensionsToolbarButtons />
            <EditButton />
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
                askForDeleteAll={true}
                onDeleteAll={value => setChecked(value)}
                askForCascade={true}
            />
        </TopToolbar>
    );
};
