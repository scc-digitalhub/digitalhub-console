import { Container } from '@mui/material';
import { ShowBaseLive } from '../../features/notifications/components/ShowBaseLive';
import { ShowPageTitle } from '../../common/components/layout/PageTitle';
import {
    EditButton,
    Exporter,
    ShowView,
    TopToolbar,
    useGetList,
    useRecordContext,
    useResourceContext,
} from 'react-admin';
import { ArtifactIcon } from '../../resources/artifacts/icon';
import { BackButton } from '@dslab/ra-back-button';
import { ExportRecordButton } from '@dslab/ra-export-record-button';
import { InspectButton } from '@dslab/ra-inspect-button';
import { useRootSelector } from '@dslab/ra-root-selector';
import { useState } from 'react';
import { DeleteWithConfirmButtonByName } from '../../common/components/buttons/delete/DeleteWithConfirmButtonByName';
import { VersionsListWrapper } from '../../common/components/VersionsList';
import { SHOW_VIEW_VERSION_PROPS } from '../../common/theme';
import { StyledFlatCard } from '../../common/theme/StyledFlatCard';
import { ExtensionsToolbarButtons } from '../../features/extensions/components/ExtensionsButtons';
import { DownloadButton } from '../../features/files/download/components/DownloadButton';
import { ArtifactShow } from '../../resources/artifacts/show/ArtifactShow';

export const ArtifactShowView = () => {
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <ShowBaseLive>
                <>
                    <ShowPageTitle icon={<ArtifactIcon fontSize={'large'} />} />
                    <ShowView
                        actions={<ShowToolbar />}
                        aside={<VersionsListWrapper />}
                        {...SHOW_VIEW_VERSION_PROPS}
                        component={StyledFlatCard}
                    >
                        <ArtifactShow />
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
            <EditButton />
            {record?.status?.files?.length === 1 && <DownloadButton />}
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
