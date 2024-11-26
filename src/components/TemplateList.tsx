import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Stack,
    CardActionArea,
    styled,
    alpha,
} from '@mui/material';
import { useState } from 'react';

type Template = {
    name: string;
    description: string;
};

export const TemplateList = () => {
    const [selectedTemplate, setSelectedTemplate] = useState<
        Template | null | boolean
    >(null);

    const selectTemplate = (template: Template) => {
        setSelectedTemplate(template);
    };

    const startFromScratch = e => {
        setSelectedTemplate(false);
        e.stopPropagation();
    };

    const templates: Template[] = [
        {
            name: 'T1',
            description:
                'somethinggggggggggggbsfsdfdsfdsfdsfdsfdsfdsfdsfsdfdsfdsf',
        },
        {
            name: 'T2',
            description:
                'somethinggggggggggggbsfsdfdsfdsfdsfdsfdsfdsfdsfsdfdsfdsf',
        },
        {
            name: 'T3',
            description:
                'somethinggggggggggggbsfsdfdsfdsfdsfdsfdsfdsfdsfsdfdsfdsf',
        },
        {
            name: 'T4',
            description:
                'somethinggggggggggggbsfsdfdsfdsfdsfdsfdsfdsfdsfsdfdsfdsf',
        },
        {
            name: 'T5',
            description:
                'somethinggggggggggggbsfsdfdsfdsfdsfdsfdsfdsfdsfsdfdsfdsf',
        },
        {
            name: 'T6',
            description:
                'somethinggggggggggggbsfsdfdsfdsfdsfdsfdsfdsfdsfsdfdsfdsf',
        },
        {
            name: 'T7',
            description:
                'somethinggggggggggggbsfsdfdsfdsfdsfdsfdsfdsfdsfsdfdsfdsf',
        },
        {
            name: 'T8',
            description:
                'somethinggggggggggggbsfsdfdsfdsfdsfdsfdsfdsfdsfsdfdsfdsf',
        },
    ];

    return (
        <Stack
            spacing={{ xs: 1, sm: 2 }}
            direction="row"
            useFlexGap
            sx={{ flexWrap: 'wrap' }}
        >
            <StyledTemplate
                className={selectedTemplate === false ? 'selected' : ''}
            >
                <CardActionArea onClick={startFromScratch}>
                    <CardContent>
                        <Typography variant="body2">
                            {'+ Start from scratch'}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </StyledTemplate>
            {templates.map((template, index) => (
                <TemplateCard
                    template={template}
                    key={'template_' + index}
                    selectTemplate={selectTemplate}
                    selected={
                        typeof selectedTemplate == 'object' &&
                        selectedTemplate?.name == template.name
                    }
                />
            ))}
        </Stack>
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
            <CardActionArea onClick={select}>
                <CardHeader title={template.name} />
                <CardContent>
                    <Typography variant="body2">
                        {template.description}
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
