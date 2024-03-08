import { Typography, Paper, Box, SxProps, Theme } from '@mui/material';
import { isValidElement, ReactElement } from 'react';
import {
    Identifier,
    RaRecord,
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
                    sx={{ pb: secondaryText ? 1 : 0 }}
                    color={'black'}
                >
                    {text}
                </Typography>
                {secondaryText && (
                    <Typography variant="h6" color={'gray'}>
                        {secondaryText}
                    </Typography>
                )}
            </Box>
            {icon && isValidElement(icon) ? (
                <Box sx={{ pt: 2, pb: 2, textAlign: 'right' }}> {icon} </Box>
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

    return (
        <PageTitle
            text={translate('pageTitle.list.title', {
                resource: label,
            })}
            {...rest}
        />
    );
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
            text={translate('pageTitle.show.title', {
                resource: label,
                name,
            })}
            secondaryText={translate('pageTitle.show.subtitle', {
                resource: label,
                kind,
            })}
            {...rest}
        />
    );
};
