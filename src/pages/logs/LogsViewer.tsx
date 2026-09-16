// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Button, TopToolbar, ToolbarClasses, useTranslate } from 'react-admin';
import { Box, FormControlLabel, Stack, styled, Switch } from '@mui/material';
import NavigationRefresh from '@mui/icons-material/Refresh';
import { LazyLog } from '@melloware/react-logviewer';
import DownloadIcon from '@mui/icons-material/GetApp';
import { formatLogItem } from './utils';

export const LogsViewer = (props: {
    data?: any;
    refresh?: () => void;
    autoRefresh?: boolean;
    onToggleAutoRefresh?: () => void;
}) => {
    const { data, refresh, autoRefresh, onToggleAutoRefresh } = props;
    const translate = useTranslate();
    const ref = useRef<LazyLog>(null);
    //last timestamp already appended to the viewer, to only append new entries
    const lastTimestampRef = useRef<number | null>(null);

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
                    result += formatLogItem(item) + '\n';
                });
            } catch (e: any) {
                /* empty */
                console.log(e);
            }
        }
        return result;
    }, [data]);

    useEffect(() => {
        if (!data || !ref.current) {
            return;
        }
        const newItems =
            lastTimestampRef.current == null
                ? data
                : data.filter(
                      item => item.timestamp > lastTimestampRef.current!
                  );
        if (newItems.length > 0) {
            ref.current.appendLines(newItems.map(formatLogItem));
        }
        if (data.length > 0) {
            lastTimestampRef.current = data[data.length - 1].timestamp;
        }
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
                    external={true}
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
