// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    useTranslate,
    useCreatePath,
    useDataProvider,
    useNotify,
    useBasename,
} from 'react-admin';
import { useRootSelector } from '@dslab/ra-root-selector';
import {
    Box,
    Button,
    Checkbox,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { PageTitle } from '../../../common/components/layout/PageTitle';
import { HubIcon } from './HubIcon';
import { useHubResources } from '../useHubResources';


interface ImportItem {
    name: string;
    kind: string;
    displayName: string;
    resourceName: string;
    catalogKey: string; 
        data: any;
}

interface ImportResult {
    item: ImportItem;
    success: boolean;
    error?: string;
}

export const HubProjectImport = () => {
    const { state } = useLocation();
    const hubResources = useHubResources();
    const navigate = useNavigate();
    const translate = useTranslate();
    const createPath = useCreatePath();
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const { root } = useRootSelector();
    const basename = useBasename();
    const hubTemplate = state?.hubTemplate;

    const catalogKeyToResource = useMemo(
        () => Object.fromEntries(hubResources.map(r => [r.catalogKey, r.name])),
        [hubResources]
    );
    const allItems: ImportItem[] = useMemo(() => {
        if (!hubTemplate?.spec) return [];
        return Object.entries(hubTemplate.spec).flatMap(([catalogKey, items]) => {
            const resourceName = catalogKeyToResource[catalogKey] ?? catalogKey;
            return (items as any[]).map(item => ({
                name: item.name,
                kind: item.kind,
                displayName: item.metadata?.name || item.name,
                resourceName,  
                catalogKey,
                data: item,
            }));
        });
    }, [hubTemplate, catalogKeyToResource]);

    const [selection, setSelection] = useState<Record<string, boolean>>(
        Object.fromEntries(allItems.map(item => [`${item.catalogKey}:${item.name}`, true]))
    );

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [progressOpen, setProgressOpen] = useState(false);
    const [importing, setImporting] = useState(false);
    const [results, setResults] = useState<ImportResult[]>([]);

    const selectedItems = allItems.filter(
        item => selection[`${item.catalogKey}:${item.name}`]
    );

    const toggle = (key: string) => {
        setSelection(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleAllOfType = (type: string) => {
        const typeItems = allItems.filter(i => i.catalogKey === type);
        const allSelected = typeItems.every(
            i => selection[`${i.catalogKey}:${i.name}`]
        );
        setSelection(prev => ({
            ...prev,
            ...Object.fromEntries(
                typeItems.map(i => [`${i.catalogKey}:${i.name}`, !allSelected])
            ),
        }));
    };

    const handleImport = async () => {
        setConfirmOpen(false);
        setProgressOpen(true);
        setImporting(true);
        setResults([]);

        const importResults = await Promise.allSettled(
            selectedItems.map(item => {
                const payload = {
                    ...item.data,
                    project: root || '',
                    metadata: {
                        ...item.data.metadata,
                        project: root || '',
                    },
                };
                return dataProvider
                    .create(item.resourceName, {
                        data: payload,
                        meta: { root },
                    })
                    .then(() => ({ item, success: true }))
                    .catch(err => ({
                        item,
                        success: false,
                        error: err?.message || 'Error',
                    }));
            })
        );

        const finalResults: ImportResult[] = importResults.map(r =>
            r.status === 'fulfilled'
                ? r.value
                : { item: r.reason?.item, success: false, error: r.reason?.message }
        );

        setResults(finalResults);
        setImporting(false);

        const failed = finalResults.filter(r => !r.success);
        if (failed.length === 0) {
            notify('pages.hub.import_success', { type: 'success' });
        } else {
            notify('pages.hub.import_partial', {
                type: 'warning',
                messageArgs: { failed: failed.length, total: finalResults.length },
            });
        }
    };

    const handleClose = () => {
        setProgressOpen(false);
        
        navigate(`${basename}/hub`);
    };


    const groupedByType = useMemo(() => {
        const groups: Record<string, ImportItem[]> = {};
        allItems.forEach(item => {
            if (!groups[item.catalogKey]) groups[item.catalogKey] = [];
            groups[item.catalogKey].push(item);
        });
        return groups;
    }, [allItems]);

    if (!hubTemplate) {
        return (
            <Container maxWidth={false} sx={{ pb: 2 }}>
                <Typography>No template selected</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ pb: 2 }}>
            <PageTitle
                text={hubTemplate?.metadata?.name || hubTemplate?.name}
                secondaryText={hubTemplate?.metadata?.description}
                icon={<HubIcon fontSize="large" />}
            />

            {/* sezioni per tipo */}
            {Object.entries(groupedByType).map(([type, items]) => {
                const allSelected = items.every(
                    i => selection[`${i.catalogKey}:${i.name}`]
                );
                return (
                    <Box key={type} sx={{ mb: 3 }}>
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            sx={{ mb: 1 }}
                        >
                            <Stack direction="row" alignItems="center" gap={1}>
                                <Chip
                                    label={type}
                                    size="small"
                                    color={'primary'}
                                />
                                <Typography variant="caption" color="text.secondary">
                                    {items.filter(i => selection[`${i.catalogKey}:${i.name}`]).length}
                                    /{items.length} selected
                                </Typography>
                            </Stack>
                            <Button size="small" onClick={() => toggleAllOfType(type)}>
                                {allSelected ? 'Deselect all' : 'Select all'}
                            </Button>
                        </Stack>

                        <Stack gap={1}>
                            {items.map(item => {
                                const key = `${item.catalogKey}:${item.name}`;
                                return (
                                    <Stack
                                        key={key}
                                        direction="row"
                                        alignItems="center"
                                        sx={{
                                            px: 2,
                                            py: 1,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            borderRadius: 1,
                                        }}
                                    >
                                        <FormControlLabel
                                            sx={{ flex: 1, m: 0 }}
                                            control={
                                                <Checkbox
                                                    checked={!!selection[key]}
                                                    onChange={() => toggle(key)}
                                                />
                                            }
                                            label={
                                                <Stack>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {item.displayName}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {item.kind}
                                                    </Typography>
                                                </Stack>
                                            }
                                        />
                                    </Stack>
                                );
                            })}
                        </Stack>
                        <Divider sx={{ mt: 2 }} />
                    </Box>
                );
            })}

            {/* azioni */}
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
                <Button
                    variant="text"
                    onClick={() => navigate(createPath({ resource: 'projects', type: 'list' }))}
                >
                    {translate('ra.action.cancel')}
                </Button>
                <Button
                    variant="contained"
                    disabled={selectedItems.length === 0}
                    onClick={() => setConfirmOpen(true)}
                >
                    {translate('actions.import_one')} ({selectedItems.length})
                </Button>
            </Stack>

            {/* modale conferma */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Confirm Import</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        You are about to import <strong>{selectedItems.length}</strong> resources into project <strong>{root}</strong>:
                    </Typography>
                    <List dense>
                        {selectedItems.map(item => (
                            <ListItem key={`${item.catalogKey}:${item.name}`}>
                                <ListItemText
                                    primary={item.displayName}
                                    secondary={`${item.catalogKey} · ${item.kind}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>
                        {translate('ra.action.cancel')}
                    </Button>
                    <Button variant="contained" onClick={handleImport}>
                        {translate('actions.import_one')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* modale progress / risultati */}
            <Dialog open={progressOpen} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {importing ? 'Importing...' : 'Import Complete'}
                </DialogTitle>
                <DialogContent>
                    {importing ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <List dense>
                            {results.map((r, i) => (
                                <ListItem key={i}>
                                    <ListItemIcon>
                                        {r.success ? (
                                            <CheckCircleIcon color="success" />
                                        ) : (
                                            <ErrorIcon color="error" />
                                        )}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={r.item?.displayName}
                                        secondary={
                                            r.success
                                                ? `${r.item?.catalogKey} · ${r.item?.kind}`
                                                : r.error
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </DialogContent>
                {!importing && (
                    <DialogActions>
                        <Button variant="contained" onClick={handleClose}>
                            {translate('ra.action.close')}
                        </Button>
                    </DialogActions>
                )}
            </Dialog>
        </Container>
    );
};