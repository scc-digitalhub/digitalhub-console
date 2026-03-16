// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    CardContent,
    CardHeader,
    Typography,
    CardActionArea,
    Grid,
    Avatar,
    Stack,
    Box,
} from '@mui/material';
import {
    Confirm,
    LoadingIndicator,
    RecordContextProvider,
    ResourceContextProvider,
    useGetList,
    useRecordContext,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import AddIcon from '@mui/icons-material/Add';
import { useFormContext } from 'react-hook-form';
import { useRef, useState } from 'react';
import { ChipsField } from './fields/ChipsField';
import { StyledTemplate } from './layout/StyledTemplate';

export type Template = {
    id: string;
    name: string;
    kind: string;
    metadata: {
        description?: string;
        version?: string;
        labels: string[];
    };
    spec: any;
};
const useSafeIsDirty = (): boolean => {
    const formContext = useFormContext();
    if (!formContext) return false;
    return formContext.formState.isDirty;
};
export const TemplatesSelector = (props: {
    template: string | null;
    kinds?: any[] | undefined;
    onSelected?: (template: Template | null) => void;
}) => {
    const { template: selected, onSelected, kinds } = props;
    const resource = useResourceContext();
    const translate = useTranslate();
    const record = useRecordContext(props);
    const formContext = useFormContext();
    const isDirty = useSafeIsDirty();

    
    const [open, setOpen] = useState(false);
    const cur = useRef<Template | null>(null);

    const { data: templates, isLoading } = useGetList('templates', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'name', order: 'ASC' },
        filter: { type: resource?.slice(0, -1) },
    });

    const doSelect = (template: Template | null) => {
        // Reset form solo se il form context esiste (fase 1 con CreateBase)
        if (formContext) {
            const r = template
                ? {
                      ...record,
                      name: '',
                      kind: template.kind,
                      metadata: {
                          ...record?.metadata,
                          description: template.metadata?.description,
                          labels: template.metadata?.labels,
                      },
                      spec: template.spec,
                  }
                : record || { kind: undefined };

            formContext.reset(r);
        }

        if (onSelected) {
            onSelected(template);
        }
    };

    const handleConfirm = () => {
        doSelect(cur.current);
        cur.current = null;
        setOpen(false);
    };

    const handleDialogClose = () => {
        cur.current = null;
        setOpen(false);
    };

    const handleSelection = (e, template) => {
        if (template?.id === selected) {
            // no-op
        } else if (isDirty && formContext) {
            // chiedi conferma solo se il form esiste ed è dirty
            cur.current = template;
            setOpen(true);
        } else {
            doSelect(template);
        }
        e.stopPropagation();
    };

    if (isLoading) return <LoadingIndicator />;

    return (
        <ResourceContextProvider value={'templates'}>
            <Grid container spacing={2} sx={{ paddingY: '16px' }}>
                <Grid size={{ xs: 12, md: 4 }} key={'template_scratch'}>
                    <TemplateScratch
                        kinds={kinds}
                        selected={selected == null}
                        onSelected={handleSelection}
                    />
                </Grid>
                {templates?.map((template, index) => (
                    <Grid size={{ xs: 12, md: 4 }} key={'template_' + index}>
                        <TemplateCard
                            template={template}
                            selected={template.id === selected}
                            onSelected={handleSelection}
                        />
                    </Grid>
                ))}
                <Confirm
                    isOpen={open}
                    title={translate('resources.common.reset.title')}
                    content={translate('resources.common.reset.content')}
                    onConfirm={handleConfirm}
                    onClose={handleDialogClose}
                />
            </Grid>
        </ResourceContextProvider>
    );
};

export const TemplateScratch = (props: {
    kinds?: any[] | undefined;
    selected: boolean;
    onSelected?: (event, template: Template | null) => void;
}) => {
    const { selected, onSelected } = props;  // ← rimuovi kinds dal destructuring
    const translate = useTranslate();

    const handleClick = e => {
        if (onSelected) {
            onSelected(e, null);
        }
    };

    return (
        <StyledTemplate className={selected ? 'selected' : ''}>
            <CardActionArea onClick={handleClick} sx={{ height: '250px' }}>
                <CardContent>
                    <Stack
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <Avatar
                            sx={theme => ({
                                backgroundColor: theme.palette?.primary?.main,
                            })}
                        >
                            <AddIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="h6">
                            {translate('messages.templates.start_from_scratch')}
                        </Typography>
                        {/* ← KindSelector rimosso, ora è Step 1 dello stepper */}
                    </Stack>
                </CardContent>
            </CardActionArea>
        </StyledTemplate>
    );
};

const TemplateCard = (props: {
    template: Template;
    selected: boolean;
    onSelected: (event, template: Template) => void;
}) => {
    const { template, selected, onSelected } = props;

    return (
        <RecordContextProvider value={template}>
            <StyledTemplate className={selected ? 'selected' : ''}>
                <CardActionArea
                    onClick={e => onSelected(e, template)}
                    sx={{ height: '250px' }}
                >
                    <CardHeader
                        title={template.name}
                        subheader={template.kind}
                    />
                    {template.metadata?.labels && (
                        <Box py={0} px={1}>
                            <ChipsField
                                label="fields.labels.title"
                                source="metadata.labels"
                                sortable={false}
                            />
                        </Box>
                    )}

                    <CardContent>
                        <Typography
                            variant="body2"
                            sx={{ height: '120px', overflowY: 'auto' }}
                        >
                            {template.metadata?.description}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </StyledTemplate>
        </RecordContextProvider>
    );
};
