// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Button,
    Confirm,
    useGetResourceLabel,
    useListContext,
    useNotify,
    useRefresh,
    useResourceContext,
    useTranslate,
    useUnselectAll,
} from 'react-admin';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import React, { useState } from 'react';
import { useStopRun } from '../../../common/hooks/useStopRun';

export const BulkStopButton = () => {
    const { selectedIds, data } = useListContext();
    const stopRun = useStopRun();
    const notify = useNotify();
    const refresh = useRefresh();
    const resource = useResourceContext();
    const getResourceLabel = useGetResourceLabel();
    const unselectAll = useUnselectAll(resource);
    const translate = useTranslate();
    const [open, setOpen] = useState(false);

    const selectedData = data?.filter(d => selectedIds.includes(d.id)) ?? [];
    const runnableItems = selectedData.filter(
        d => d.status?.state === 'RUNNING'
    );

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setOpen(true);
    };

    const handleConfirm = async () => {
        setOpen(false);
        try {
            await Promise.all(runnableItems.map(item => stopRun(item.id)));
            notify('messages.bulk_stopped', {
                type: 'info',
                messageArgs: {
                    smart_count: runnableItems.length,
                },
            });
            unselectAll();
            refresh();
        } catch {
            notify('ra.notification.http_error', { type: 'error' });
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const translatedName = translate(
        getResourceLabel(resource || '', runnableItems.length)
    );

    return (
        <>
            <Button
                label="actions.stop"
                startIcon={<StopCircleIcon />}
                onClick={handleClick}
            />
            <Confirm
                isOpen={open}
                title="messages.bulk_stop_title"
                content="messages.bulk_stop_content"
                titleTranslateOptions={{
                    name: translatedName.toLowerCase(),
                    smart_count: runnableItems.length,
                }}
                contentTranslateOptions={{
                    smart_count: runnableItems.length,
                }}
                onConfirm={handleConfirm}
                onClose={handleClose}
            />
        </>
    );
};
