import { useRootSelector } from '@dslab/ra-root-selector';
import { Container } from '@mui/material';
import { useState, useEffect } from 'react';
import {
    DeleteWithConfirmButton,
    EditButton,
    RecordContextProvider,
    ResourceContextProvider,
    ShowBase,
    ShowView,
    TopToolbar,
    useDataProvider,
    useTranslate,
} from 'react-admin';
import { FlatCard } from '../../components/FlatCard';
import { PageTitle, ShowPageTitle } from '../../components/PageTitle';
import { FunctionIcon } from '../functions/icon';
import { ProjectIcon } from './icon';
import { BackButton } from '@dslab/ra-back-button';
import { ExportRecordButton } from '@dslab/ra-export-record-button';
import { InspectButton } from '@dslab/ra-inspect-button';
import SettingsIcon from '@mui/icons-material/Settings';

const ShowToolbar = () => (
    <TopToolbar>
        <BackButton />
        <EditButton style={{ marginLeft: 'auto' }} />
        <InspectButton />
        <ExportRecordButton language="yaml" color="info" />
        <DeleteWithConfirmButton />
    </TopToolbar>
);

export const ProjectConfig = () => {
    const translate = useTranslate();
    const { root: projectId } = useRootSelector();

    return (
        <ResourceContextProvider value="projects">
            <Container maxWidth={false} sx={{ pb: 2 }}>
                <ShowBase id={projectId}>
                    <>
                        <PageTitle
                            text={translate('pages.config.title')}
                            secondaryText={translate('pages.config.text')}
                            icon={<SettingsIcon fontSize={'large'} />}
                        />
                        <ShowView
                            actions={<ShowToolbar />}
                            component={FlatCard}
                        >
                            ciao
                        </ShowView>
                    </>
                </ShowBase>
            </Container>
        </ResourceContextProvider>
    );
};
