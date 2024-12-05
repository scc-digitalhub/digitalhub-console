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
    List,
    LoadingIndicator,
    Pagination,
    useListContext,
    useNotify,
    useTranslate,
} from 'react-admin';
import AddIcon from '@mui/icons-material/Add';
import { useFormState, useFormContext } from 'react-hook-form';
import { useRef, useState } from 'react';

export type Template = {
    id: string;
    name: string;
    kind: string;
    metadata: {
        description?: string;
    };
};

type TemplateListProps = {
    selectTemplate: (template: Template | false) => void;
    getSelectedTemplate: () => false | Template | null;
};

export const TemplateList = (props: TemplateListProps) => {
    const perPage = 5;

    return (
        <List
            resource="templates"
            queryOptions={{ meta: { entity: 'function' } }}
            actions={false}
            component={Box}
            sort={{ field: 'name', order: 'ASC' }}
            perPage={perPage}
            storeKey={false}
            pagination={<Pagination rowsPerPageOptions={[perPage]} />}
        >
            <TemplateGrid {...props} />
        </List>
    );
};

const TemplateGrid = (props: TemplateListProps) => {
    const notify = useNotify();
    const translate = useTranslate();
    const { data: templates, total, isLoading } = useListContext();
    const [open, setOpen] = useState(false);
    const { isDirty } = useFormState();
    const { reset } = useFormContext();
    const { selectTemplate, getSelectedTemplate } = props;

    const currentTemplate = getSelectedTemplate();
    const clickedTemplate = useRef<Template | false>(false);

    const handleSelection = (event, template: Template | false) => {
        if (!isDirty) {
            //first selection, set selected template
            selectTemplate(template);
            if (typeof template === 'object') {
                const { id, name, ...templ } = template;
                reset(templ);
            }
        } else if (
            typeof currentTemplate != typeof template ||
            (typeof currentTemplate == 'object' &&
                typeof template == 'object' &&
                currentTemplate?.name != template.name)
        ) {
            //ask confirmation
            clickedTemplate.current = template;
            setOpen(true);
        }
        event.stopPropagation();
    };

    const handleDialogClose = () => setOpen(false);
    const handleConfirm = () => {
        selectTemplate(clickedTemplate.current);
        if (clickedTemplate.current === false) {
            reset({ name: '' });
        } else {
            const { id, name, ...templ } = clickedTemplate.current;
            reset(templ);
        }
        setOpen(false);
    };

    if (isLoading) {
        return <LoadingIndicator />;
    }

    if (!templates) {
        notify(translate('messages.templates.noTemplates'));
    }

    return (
        <Grid container spacing={2} sx={{ paddingY: '16px' }}>
            <Grid item xs={12} md={4}>
                <StyledTemplate
                    className={currentTemplate === false ? 'selected' : ''}
                >
                    <CardActionArea
                        onClick={e => handleSelection(e, false)}
                        sx={{ height: '250px' }}
                    >
                        <CardContent>
                            <Stack
                                justifyContent="center"
                                alignItems="center"
                                spacing={2}
                            >
                                <Avatar
                                    sx={theme => ({
                                        backgroundColor:
                                            currentTemplate === false
                                                ? theme.palette?.primary?.main
                                                : theme.palette.grey[500],
                                    })}
                                >
                                    <AddIcon fontSize="small" />
                                </Avatar>
                                <Typography variant="h6">
                                    {'Start from scratch'}
                                </Typography>
                            </Stack>
                        </CardContent>
                    </CardActionArea>
                </StyledTemplate>
            </Grid>
            {templates &&
                templates.map((template, index) => (
                    <Grid item xs={12} md={4} key={'template_' + index}>
                        <TemplateCard
                            template={template}
                            selected={
                                typeof currentTemplate == 'object' &&
                                currentTemplate?.name == template.name
                            }
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
    );
};

const TemplateCard = (props: {
    template: Template;
    selected: boolean;
    onSelected: (event, template: Template) => void;
}) => {
    const { template, selected, onSelected } = props;

    return (
        <>
            <StyledTemplate className={selected ? 'selected' : ''}>
                <CardActionArea
                    onClick={e => onSelected(e, template)}
                    sx={{ height: '250px' }}
                >
                    <CardHeader
                        title={template.name}
                        subheader={template.kind}
                    />
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
        </>
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
