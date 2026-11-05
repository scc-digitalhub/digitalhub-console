// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Container } from '@mui/material';
import {
    Exporter,
    ShowView,
    TopToolbar,
    useGetList,
    useRecordContext,
    useResourceContext,
} from 'react-admin';
import { ShowPageTitle } from '../../common/components/layout/PageTitle';
import { ContainerImageIcon } from '../../resources/containerimages/icon';
import { ShowBaseLive } from '../../features/notifications/components/ShowBaseLive';
import { ContainerImageShow } from '../../resources/containerimages/show/ContainerImageShow';
import { BackButton } from '@dslab/ra-back-button';
import { ExportRecordButton } from '@dslab/ra-export-record-button';
import { InspectButton } from '@dslab/ra-inspect-button';
import { useRootSelector } from '@dslab/ra-root-selector';
import { useState } from 'react';
import { DeleteWithConfirmButtonByName } from '../../common/components/buttons/delete/DeleteWithConfirmButtonByName';
import { ExtensionsToolbarButtons } from '../../features/extensions/components/ExtensionsButtons';
import { VersionsListWrapper } from '../../common/components/VersionsList';
import { SHOW_VIEW_VERSION_PROPS } from '../../common/theme';
import { StyledFlatCard } from '../../common/theme/StyledFlatCard';
import { shorten } from '../../common/utils/helpers';

export const ContainerImageShowView = () => {
    const primaryText = record => {
        return record.metadata?.version &&
            record.metadata.version != record.id ? (
            <>
                <strong> {record.metadata.version}</strong> <br />
                {shorten(
                    record.status?.digest
                        ? 'sha:' + record.status?.digest
                        : record.id,
                    32
                )}
            </>
        ) : (
            <> {record.status?.digest || record.id} </>
        );
    };

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ShowBaseLive>
                <>
                    <ShowPageTitle
                        icon={<ContainerImageIcon fontSize={'large'} />}
                    />
                    <ShowView
                        actions={<ShowToolbar />}
                        aside={
                            <VersionsListWrapper
                                primaryText={primaryText}
                                secondaryText={() => null}
                            />
                        }
                        {...SHOW_VIEW_VERSION_PROPS}
                        component={StyledFlatCard}
                    >
                        <ContainerImageShow />
                    </ShowView>
                </>
            </ShowBaseLive>
        </Container>
    );
};

const ShowToolbar = (props: { exporter?: Exporter }) => {
    const { exporter } = props;
    const record = useRecordContext();
    const resource = useResourceContext();
    const { root } = useRootSelector();
    const [checked, setChecked] = useState(false);
    const { data } = useGetList(
        resource || '',
        {
            pagination: { page: 1, perPage: 10 },
            sort: { field: 'created', order: 'DESC' },
            filter: { name: record?.name, versions: 'all' },
        },
        { enabled: !!resource }
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
