// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useState } from 'react';
import {
    LoadingIndicator,
    RecordContextProvider,
    useTranslate,
    useDataProvider,
    usePermissions,
    AccessDenied,
} from 'react-admin';
import { Container } from '@mui/material';
import { PageTitle } from '../../common/components/layout/PageTitle';
import { LogsIcon } from '../../features/logs/components/LogsButton';
import { LogsViewer } from './LogsViewer';
import { LoggersForm } from './LoggersForm';

export const LogsView = () => {
    const { isPending, permissions } = usePermissions();

    return isPending ? (
        <LoadingIndicator />
    ) : permissions?.find(r => r === 'ROLE_ADMIN') ? (
        <LogsPage />
    ) : (
        <AccessDenied />
    );
};

const LogsPage = () => {
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const [data, setData] = useState<any[]>([]);
    const [autoRefresh, setAutoRefresh] = useState(true);

    const fetchLogs = useCallback(() => {
        if (dataProvider) {
            const url = `/admin/logs`;

            dataProvider
                .invoke({
                    path: url,
                    options: { method: 'GET' },
                })
                .then(res => {
                    if (res) {
                        setData(res);
                    }
                });
        }
    }, [dataProvider]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    useEffect(() => {
        if (!autoRefresh) {
            return;
        }
        const id = setInterval(fetchLogs, 5000);
        return () => clearInterval(id);
    }, [autoRefresh, fetchLogs]);

    if (!data) {
        return <LoadingIndicator />;
    }

    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <PageTitle
                text={translate('fields.logs')}
                secondaryText={translate('resources.logs.list')}
                icon={<LogsIcon fontSize={'large'} />}
                sx={{ pl: 0, pr: 0 }}
            />
            <RecordContextProvider value={data}>
                <LogsViewer
                    data={data}
                    refresh={fetchLogs}
                    autoRefresh={autoRefresh}
                    onToggleAutoRefresh={() => setAutoRefresh(v => !v)}
                />
            </RecordContextProvider>
            <LoggersForm refresh={fetchLogs} />
        </Container>
    );
};
