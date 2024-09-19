import { Typography, Paper, Box, SxProps, Theme } from '@mui/material';
import { isValidElement, ReactElement } from 'react';
import {
    Identifier,
    RaRecord,
    useCreateContext,
    useEditContext,
    useGetResourceLabel,
    useListContext,
    useShowContext,
    useTranslate,
} from 'react-admin';

export const PageTitle = (props: PageTitleProps) => {
    const { text, secondaryText, icon, sx } = props;
    const sxProps = {
        p: 0,
        pl: 1,
        pr: 1,
        pt: 2,
        pb: 2,
        display: 'flex',
        alignItems: 'center',
        ...sx,
    };

    return (
        <Box sx={sxProps}>
            <Box sx={{ textAlign: 'left', flexGrow: 1 }}>
                <Typography
                    variant="h4"
                    color={'secondary.main'}
                    sx={{ pb: secondaryText ? 1 : 0 }}
                >
                    {text}
                </Typography>
                {secondaryText && (
                    <Typography variant="h6" color={'secondary.light'}>
                        {secondaryText}
                    </Typography>
                )}
            </Box>
            {icon && isValidElement(icon) ? (
                <Box sx={{ pt: 2, pb: 2, textAlign: 'right' }}>
                    {' '}
                    <Typography color={'secondary.main'}>{icon} </Typography>
                </Box>
            ) : (
                ''
            )}
        </Box>
    );
};

export type PageTitleProps = {
    text: string;
    secondaryText?: string;
    icon?: ReactElement;
    sx?: SxProps<Theme>;
};

export type ListPageTitleProps = Omit<PageTitleProps, 'text'> & {
    resource?: string;
};

export const ListPageTitle = (props: ListPageTitleProps) => {
    const { resource: resourceFromProps, ...rest } = props;
    const { resource } = useListContext({
        resource: resourceFromProps,
    });
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();

    const label = getResourceLabel(resource, 2);
    const secondaryText = translate('resources.' + resource + '.list');

    return <PageTitle text={label} secondaryText={secondaryText} {...rest} />;
};

export type RecordPageTitleProps = Omit<
    PageTitleProps,
    'text' | 'secondaryText'
> & {
    resource?: string;
    record?: RaRecord<Identifier>;
};

export const ShowPageTitle = (props: RecordPageTitleProps) => {
    const {
        resource: resourceFromProps,
        record: recordFromProps,
        ...rest
    } = props;
    const { resource, record } = useShowContext({
        resource: resourceFromProps,
        record: recordFromProps,
    });
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();

    const label = getResourceLabel(resource, 1);
    const name = record?.name || '';
    const kind = record?.kind || '';

    return (
        <PageTitle
            text={translate('pages.pageTitle.show.title', {
                resource: label,
                name,
            })}
            secondaryText={translate('pages.pageTitle.show.subtitle', {
                resource: label,
                kind,
            })}
            {...rest}
        />
    );
};

export const CreatePageTitle = (props: RecordPageTitleProps) => {
    const {
        resource: resourceFromProps,
        record: recordFromProps,
        ...rest
    } = props;
    const { resource, record } = useCreateContext({
        resource: resourceFromProps,
        record: recordFromProps,
    });
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();

    const label = getResourceLabel(resource, 1).toLowerCase();

    return (
        <PageTitle
            text={translate('pages.pageTitle.create.title', {
                resource: label,
            })}
            secondaryText={translate('pages.pageTitle.create.subtitle', {
                resource: label,
            })}
            {...rest}
        />
    );
};

export const EditPageTitle = (props: RecordPageTitleProps) => {
    const {
        resource: resourceFromProps,
        record: recordFromProps,
        ...rest
    } = props;
    const { resource, record } = useEditContext({
        resource: resourceFromProps,
        record: recordFromProps,
    });
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();

    const label = getResourceLabel(resource, 1).toLowerCase();
    const name = record?.name || '';
    const kind = record?.kind || '';

    return (
        <PageTitle
            text={translate('pages.pageTitle.edit.title', {
                resource: label,
                name,
            })}
            secondaryText={translate('pages.pageTitle.edit.subtitle', {
                resource: label,
                kind,
            })}
            {...rest}
        />
    );
};
