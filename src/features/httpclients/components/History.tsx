// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import {
    Typography,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemText,
    Divider,
    ListItemButton,
    AccordionActions,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { useTranslate } from 'react-admin';
import { HttpClientRequest, HttpClientResponse } from '../provider/HttpClientProvider';
import CloseIcon from '@mui/icons-material/Close';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { StatusBadge } from '../HttpClient';

export type HistoryEntry = {
    request: Omit<HttpClientRequest, 'headers'> & {
        headers?: Record<string, string>;
    };
    response: Omit<HttpClientResponse, 'headers'> & {
        headers?: Record<string, string>;
    };
    timestamp: string;
};

export const HistoryBrowser = ({
    history,
    onLoad,
    onRemove,
    onClear,
}: {
    history: HistoryEntry[];
    onLoad: (entry: HistoryEntry) => void;
    onRemove?: (entry: HistoryEntry) => void;
    onClear?: () => void;
}) => {
    const translate = useTranslate();

    if (history.length === 0) return null;

    return (
        <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>
                    {translate('pages.http-client.history')}
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                {history.length === 0 ? (
                    <Typography color="text.secondary">
                        {translate('pages.http-client.noRequests')}
                    </Typography>
                ) : (
                    <List dense>
                        {history.map((entry, idx) => (
                            <React.Fragment key={idx}>
                                <ListItem
                                    onClick={() => onLoad(entry)}
                                    disablePadding
                                    disableGutters
                                    secondaryAction={
                                        <HistoryEntryActions
                                            entry={entry}
                                            idx={idx}
                                            onRemove={onRemove}
                                        />
                                    }
                                >
                                    <ListItemButton>
                                        <ListItemText
                                            primary={`${entry.request.method} ${entry.request.url}`}
                                            secondary={`${entry.timestamp}`}
                                        />
                                    </ListItemButton>
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </AccordionDetails>
            {onClear && (
                <AccordionActions>
                    <IconButton
                        aria-label={translate('ra.action.clear_array_input')}
                        title={translate('ra.action.clear_array_input')}
                        onClick={() => onClear?.()}
                        size="small"
                    >
                        <ClearAllIcon fontSize="small" />
                    </IconButton>
                </AccordionActions>
            )}
        </Accordion>
    );
};

const HistoryEntryActions = ({
    entry,
    onRemove,
}: {
    entry: HistoryEntry;
    idx: number;
    onRemove?: (entry: HistoryEntry) => void;
}) => {
    const translate = useTranslate();

    return (
        <>
            <Typography variant="caption" color="textSecondary" p={1}>
                <StatusBadge status={entry.response?.status || undefined} />
            </Typography>
            {onRemove && (
                <IconButton
                    aria-label={translate('ra.action.remove')}
                    title={translate('ra.action.remove')}
                    onClick={() => onRemove?.(entry)}
                    size="small"
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            )}
        </>
    );
};
