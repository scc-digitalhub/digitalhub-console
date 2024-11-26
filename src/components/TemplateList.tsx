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
} from '@mui/material';
import { useEffect, useState } from 'react';
import { GetListParams, useDataProvider } from 'react-admin';
import AddIcon from '@mui/icons-material/Add';
import { useFormContext } from 'react-hook-form';

type Template = {
    name: string;
    metadata: {
        description?: string;
    };
};

export const TemplateList = () => {
    const [selectedTemplate, setSelectedTemplate] = useState<
        Template | null | boolean
    >(null);
    const [templates, setTemplates] = useState<Template[]>([]);
    const dataProvider = useDataProvider();

    const { reset } = useFormContext();

    const selectTemplate = (template: Template) => {
        setSelectedTemplate(template);
        reset(template);
    };

    const startFromScratch = e => {
        setSelectedTemplate(false);
        e.stopPropagation();
    };

    useEffect(() => {
        if (dataProvider) {
            const params: GetListParams = {
                pagination: {
                    perPage: 10,
                    page: 1,
                },
                sort: { field: 'created', order: 'DESC' },
                filter: {},
            };
            dataProvider.getList('functions', params).then(res => {
                if (res.data && res.total) {
                    setTemplates(res.data);
                }
            });
        }
    }, [dataProvider]);

    return (
        <Grid container spacing={2} sx={{ paddingY: '16px' }}>
            <Grid item xs={12} md={4}>
                <StyledTemplate
                    className={selectedTemplate === false ? 'selected' : ''}
                >
                    <CardActionArea
                        onClick={startFromScratch}
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
                                            selectedTemplate === false
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
            {templates.map((template, index) => (
                <Grid item xs={12} md={4} key={'template_' + index}>
                    <TemplateCard
                        template={template}
                        selectTemplate={selectTemplate}
                        selected={
                            typeof selectedTemplate == 'object' &&
                            selectedTemplate?.name == template.name
                        }
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export const TemplateCard = (props: {
    template: Template;
    selectTemplate: any;
    selected: boolean;
}) => {
    const { template, selectTemplate, selected } = props;

    const select = e => {
        selectTemplate(template);
        e.stopPropagation();
    };

    return (
        <StyledTemplate className={selected ? 'selected' : ''}>
            <CardActionArea onClick={select} sx={{ height: '250px' }}>
                <CardHeader title={template.name} />
                <CardContent>
                    <Typography
                        variant="body2"
                        sx={{ height: '150px', overflowY: 'auto' }}
                    >
                        {template.metadata?.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </StyledTemplate>
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
