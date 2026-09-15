// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Button,
    DateField,
    LoadingIndicator,
    RecordContextProvider,
    useGetResourceLabel,
    TopToolbar,
    ToolbarClasses,
    useTranslate,
    useDataProvider,
    usePermissions,
    AccessDenied,
} from 'react-admin';
import {
    Box,
    Container,
    FormControlLabel,
    Stack,
    styled,
    Switch,
} from '@mui/material';
import NavigationRefresh from '@mui/icons-material/Refresh';
import { LazyLog } from '@melloware/react-logviewer';
import DownloadIcon from '@mui/icons-material/GetApp';
import { PageTitle } from '../../common/components/layout/PageTitle';
import { LogsIcon } from '../../features/logs/components/LogsButton';

export const LogsView = () => {
    const { isPending, permissions } = usePermissions();

    return isPending ? (
        <LoadingIndicator />
    ) : permissions?.find(r => r === 'ROLE_ADMIN') ? (
        <LogsViewer />
    ) : (
        <AccessDenied />
    );
};

export const LogsViewer = () => {
    const getResourceLabel = useGetResourceLabel();
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const [data, setData] = useState<any[]>([]);
    const [autoRefresh, setAutoRefresh] = useState(true);
    const label = getResourceLabel('logs', 1).toLowerCase();

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
                // secondaryText={store || 'select a store to explore files'}
                secondaryText={translate('resources.logs.list')}
                icon={<LogsIcon fontSize={'large'} />}
                sx={{ pl: 0, pr: 0 }}
            />
            <RecordContextProvider value={data}>
                <LogsDetail
                    data={data}
                    refresh={fetchLogs}
                    autoRefresh={autoRefresh}
                    onToggleAutoRefresh={() => setAutoRefresh(v => !v)}
                />
            </RecordContextProvider>
        </Container>
    );
};

const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const pad = (n: number, z = 2) => String(n).padStart(z, '0');

    const offsetMin = -date.getTimezoneOffset();
    const sign = offsetMin >= 0 ? '+' : '-';
    const offH = pad(Math.floor(Math.abs(offsetMin) / 60));
    const offM = pad(Math.abs(offsetMin) % 60);

    return (
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
            date.getDate()
        )}` +
        `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
            date.getSeconds()
        )}` +
        `.${pad(date.getMilliseconds(), 3)}${sign}${offH}:${offM}`
    );
};

//keep the last n characters, matching logback's field truncation behaviour
const truncateStart = (value: string, length: number) =>
    value.length > length ? value.slice(value.length - length) : value;

//abbreviate package segments to their first letter, keeping the class name whole
const abbreviateLogger = (logger: string) => {
    const parts = logger.split('.');
    if (parts.length <= 1) {
        return logger;
    }
    const className = parts.pop();
    return `${parts.map(p => p.charAt(0)).join('.')}.${className}`;
};

const padLogger = (logger: string, length: number) =>
    logger.length > length
        ? logger.slice(logger.length - length)
        : logger.padEnd(length);

//ANSI color codes matching Spring Boot's default console level colors
const LEVEL_COLORS: Record<string, string> = {
    ERROR: '\x1b[31m',
    WARN: '\x1b[33m',
    INFO: '\x1b[32m',
    DEBUG: '\x1b[32m',
    TRACE: '\x1b[32m',
};
const ANSI_RESET = '\x1b[0m';
const ANSI_FAINT = '\x1b[39m';

const colorize = (value: string, color?: string) =>
    color ? `${color}${value}${ANSI_RESET}` : value;

const formatLogItem = (item: any) => {
    if (!item || !item.message) {
        return '';
    }

    const timestamp = formatTimestamp(item.timestamp);
    const level = (item.level || '').padStart(5);
    const thread = truncateStart(item.thread || '', 15).padStart(15);
    const logger = padLogger(abbreviateLogger(item.logger || ''), 40);

    return (
        `${colorize(timestamp, ANSI_FAINT)} ` +
        `${colorize(level, LEVEL_COLORS[item.level])} --- ` +
        `[${colorize(thread, ANSI_FAINT)}] ` +
        `${colorize(logger, ANSI_FAINT)} : ${item.message}\n`
    );
};

const LogsDetail = (props: {
    data?: any;
    refresh?: () => void;
    autoRefresh?: boolean;
    onToggleAutoRefresh?: () => void;
}) => {
    const { data, refresh, autoRefresh, onToggleAutoRefresh } = props;
    const translate = useTranslate();
    const ref = React.createRef<LazyLog>();

    const handleRefresh = useCallback(
        event => {
            event.preventDefault();
            if (refresh) refresh();
        },
        [refresh]
    );

    const text = useMemo(() => {
        let result = '\n';
        if (data && data.length > 0) {
            try {
                data.forEach(item => {
                    result += formatLogItem(item);
                });
            } catch (e: any) {
                /* empty */
                console.log(e);
            }
        }
        return result;
    }, [data]);

    return (
        <Stack spacing={2}>
            <TopToolbar
                className={ToolbarClasses.mobileToolbar}
                sx={{ mb: 0, pb: 0, alignItems: 'center' }}
            >
                <FormControlLabel
                    labelPlacement="start"
                    label={translate('actions.autoRefresh')}
                    control={
                        <Switch
                            checked={autoRefresh === true}
                            onChange={() => {
                                if (onToggleAutoRefresh) onToggleAutoRefresh();
                            }}
                        />
                    }
                    disableTypography
                    sx={{ fontSize: '80%', m: 0 }}
                />
                <Button label="" onClick={handleRefresh}>
                    <NavigationRefresh />
                </Button>

                <DownloadButton label="" text={text} />
            </TopToolbar>
            <LogViewer sx={{ minHeight: '520px' }}>
                <LazyLog
                    ref={ref}
                    height={520}
                    text={text}
                    follow={true}
                    caseInsensitive={true}
                    enableLineNumbers={true}
                    enableLinks={false}
                    enableMultilineHighlight={true}
                    enableSearch={true}
                    enableSearchNavigation={true}
                    selectableLines={true}
                    width={'auto'}
                />
            </LogViewer>
        </Stack>
    );
};

const DownloadButton = (props: { text: string; label?: string }) => {
    const { text, label = 'actions.download' } = props;

    const filename = 'core-log.txt';

    const handleDownload = e => {
        e.stopPropagation();

        //export string as blob with exposed contextType
        const blob = new Blob([text], {
            type: 'text/plain;charset=utf-8',
        });

        // Creating the hyperlink and auto click it to start the download
        const link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link);

        link.href = URL.createObjectURL(blob);
        link.download = `${filename}.txt`;
        link.click();
    };

    return (
        <Button label={label} color={'info'} onClick={handleDownload}>
            <DownloadIcon />
        </Button>
    );
};

const LogViewer = styled(Box, {
    name: 'LogViewer',
    overridesResolver: (_props, styles) => styles.root,
})(() => ({
    [`& .log-line > .log-number`]: {
        marginLeft: 0,
        marginRight: 0,
    },
}));
