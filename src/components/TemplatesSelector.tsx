import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    CardActionArea,
    styled,
    alpha,
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
import { useFormState, useFormContext } from 'react-hook-form';
import { useRef, useState } from 'react';
import { KindSelector } from './KindSelector';
import { ChipsField } from './ChipsField';

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

export const TemplatesSelector = (props: {
    template: string | null;
    kinds?: any[] | undefined;
    onSelected?: (template: string | null) => void;
}) => {
    const { template: selected, onSelected, kinds } = props;
    const resource = useResourceContext();
    const translate = useTranslate();
    const record = useRecordContext(props);
    const { reset, setValue } = useFormContext();
    const [open, setOpen] = useState(false);
    const cur = useRef<Template | null>(null);
    const { isDirty } = useFormState();

    const {
        data: templates,
        isLoading,
        error,
    } = useGetList('templates', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'name', order: 'ASC' },
        filter: { type: resource?.slice(0, -1) },
    });

    const handleConfirm = () => {
        //confirmed
        doSelect(cur.current);
        cur.current = null;
        setOpen(false);
    };
    const handleDialogClose = () => {
        //no-op, reset cur
        cur.current = null;
        setOpen(false);
    };

    const doSelect = template => {
        //copy values into form merging record
        //note: fallback to obj with kind, otherwise input in scratch selector will become detached
        const r = template
            ? {
                  ...record,
                  name: template.name,
                  kind: template.kind,
                  metadata: {
                      ...record?.metadata,
                      description: template.metadata?.description,
                      labels: template.metadata?.labels,
                  },
                  spec: template.spec,
              }
            : record || { kind: undefined };

        //reset whole form to new defaults
        reset(r);

        if (onSelected) {
            onSelected(template?.id);
        }
    };

    const handleSelection = (e, template) => {
        if (template?.id == selected) {
            //no-op
        } else if (isDirty) {
            //ask confirm for dirty
            cur.current = template;
            setOpen(true);
        } else {
            //not dirty, proceed
            doSelect(template);
        }

        e.stopPropagation();
    };

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <ResourceContextProvider value={'templates'}>
            <Grid container spacing={2} sx={{ paddingY: '16px' }}>
                <Grid item xs={12} md={4} key={'template_scratch'}>
                    <TemplateScratch
                        kinds={kinds}
                        selected={selected == null}
                        onSelected={handleSelection}
                    />
                </Grid>
                {templates?.map((template, index) => (
                    <Grid item xs={12} md={4} key={'template_' + index}>
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
    const { selected, onSelected, kinds } = props;
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
                        {selected && kinds && <KindSelector kinds={kinds} />}
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

const StyledTemplate = styled(Card, {
    name: 'StyledCard',
    overridesResolver: (_props, styles) => styles.root,
})(({ theme, className }) => ({
    backgroundColor:
        className == 'selected'
            ? alpha(theme.palette?.primary?.main, 0.12)
            : theme.palette.common.white,
    ...theme.applyStyles('dark', {
        backgroundColor:
            className == 'selected'
                ? alpha(theme.palette?.primary?.main, 0.12)
                : theme.palette.common.black,
    }),
    color: className == 'selected' ? theme.palette?.primary?.main : 'inherit',
    ...theme.applyStyles('dark', {
        color:
            className == 'selected' ? theme.palette?.primary?.main : 'inherit',
    }),
    ['&:hover']: {
        backgroundColor:
            className == 'selected'
                ? alpha(theme.palette?.primary?.main, 0.2)
                : theme.palette.grey[100],
        ...theme.applyStyles('dark', {
            backgroundColor:
                className == 'selected'
                    ? alpha(theme.palette?.primary?.main, 0.2)
                    : theme.palette.grey[800],
        }),
    },
}));
