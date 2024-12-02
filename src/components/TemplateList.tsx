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
import { useEffect, useState } from 'react';
import {
    List,
    LoadingIndicator,
    Pagination,
    SelectInput,
    TextInput,
    useListContext,
    useNotify,
    useTranslate,
} from 'react-admin';
import AddIcon from '@mui/icons-material/Add';
import { useSchemaProvider } from '../provider/schemaProvider';

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
    const schemaProvider = useSchemaProvider();
    const [kinds, setKinds] = useState<any[]>();

    useEffect(() => {
        if (schemaProvider) {
            schemaProvider.kinds('functions').then(res => {
                if (res) {
                    const values = res.map(s => ({
                        id: s,
                        name: s,
                    }));

                    setKinds(values);
                }
            });
        }
    }, [schemaProvider, setKinds]);

    const postFilters = kinds
        ? [
              <TextInput
                  label="fields.name.title"
                  source="q"
                  alwaysOn
                  resettable
                  key={1}
              />,
              <SelectInput
                  alwaysOn
                  key={2}
                  label="fields.kind"
                  source="kind"
                  choices={kinds}
                  sx={{ '& .RaSelectInput-input': { margin: '0px' } }}
              />,
          ]
        : [];

    const perPage = 5;

    return (
        <List
            resource="functions/templates"
            actions={false}
            component={Box}
            sort={{ field: 'name', order: 'ASC' }}
            perPage={perPage}
            storeKey={false}
            pagination={<Pagination rowsPerPageOptions={[perPage]} />}
            filters={postFilters}
        >
            <TemplateGrid {...props} />
        </List>
    );
};

const TemplateGrid = (props: TemplateListProps) => {
    const notify = useNotify();
    const translate = useTranslate();
    const { data: templates, total, isLoading } = useListContext();
    const { selectTemplate, getSelectedTemplate } = props;

    const currentTemplate = getSelectedTemplate();

    const startFromScratch = e => {
        selectTemplate(false);
        e.stopPropagation();
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
            {templates && templates.map((template, index) => (
                <Grid item xs={12} md={4} key={'template_' + index}>
                    <TemplateCard
                        template={template}
                        selectTemplate={selectTemplate}
                        selected={
                            typeof currentTemplate == 'object' &&
                            currentTemplate?.name == template.name
                        }
                    />
                </Grid>
            ))}
        </Grid>
    );
};

const TemplateCard = (props: {
    template: Template;
    selectTemplate: any;
    selected: boolean;
}) => {
    const { template, selectTemplate, selected } = props;

    const select = e => {
        const { id, ...templ } = template;
        selectTemplate(templ);
        e.stopPropagation();
    };

    return (
        <StyledTemplate className={selected ? 'selected' : ''}>
            <CardActionArea onClick={select} sx={{ height: '250px' }}>
                <CardHeader title={template.name} subheader={template.kind} />
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
