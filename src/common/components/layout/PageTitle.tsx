// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Typography, Box, SxProps, Theme, Stack } from '@mui/material';
import { isValidElement, ReactElement } from 'react';
import {
    useGetResourceLabel,
    useRecordContext,
    useResourceContext,
    useResourceDefinition,
    useTranslate,
} from 'react-admin';
import { StateBadge } from '../StateBadge';
import React from 'react';

export const PageTitle = (props: PageTitleProps) => {
    const { text, secondaryText, icon, badge, sx } = props;
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
                    sx={{ pb: secondaryText ? 1 : 0, color: 'secondary.main' }}
                >
                    {text} {badge && isValidElement(badge) ? badge : null}
                </Typography>
                {secondaryText && isValidElement(secondaryText) ? (
                    secondaryText
                ) : (
                    <Typography
                        variant="h6"
                        sx={{
                            pb: secondaryText ? 1 : 0,
                            color: 'secondary.light',
                        }}
                    >
                        {secondaryText}
                    </Typography>
                )}
            </Box>
            {icon && isValidElement(icon) ? (
                <Box sx={{ pt: 2, pb: 2, textAlign: 'right' }}>
                    {' '}
                    <Typography sx={{ color: 'secondary.main' }}>
                        {icon}{' '}
                    </Typography>
                </Box>
            ) : (
                ''
            )}
        </Box>
    );
};

export type PageTitleProps = {
    text: string;
    secondaryText?: string | ReactElement;
    icon?: ReactElement | false;
    badge?: ReactElement | false;
    sx?: SxProps<Theme>;
    resource?: string;
    record?: any;
};

export type ListPageTitleProps = Omit<PageTitleProps, 'text'>;

export const ListPageTitle = (props: ListPageTitleProps) => {
    const resource = useResourceContext();
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();

    const label = resource ? getResourceLabel(resource, 2) : '';
    const secondaryText = translate('resources.' + resource + '.list');

    return <PageTitle text={label} secondaryText={secondaryText} {...props} />;
};

export type RecordPageTitleProps = Omit<
    PageTitleProps,
    'text' | 'secondaryText'
>;

export const ShowPageTitle = (props: RecordPageTitleProps) => {
    const { icon: iconProps, badge: badgeProps, ...rest } = props;
    const resourceDefinition = useResourceDefinition(props);
    const resource = useResourceContext();
    const record = useRecordContext(props);

    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();

    const label = resource ? getResourceLabel(resource, 1) : '';
    const name = record?.name || '';
    const kind = record?.kind || '';

    const defaultBadge = record?.status?.state ? (
        <StateBadge record={record} />
    ) : (
        false
    );

    const defaultIcon = resourceDefinition?.icon
        ? React.createElement(resourceDefinition.icon, {
              fontSize: 'large',
              kind: 'default',
          })
        : false;

    const secondaryIcon =
        resourceDefinition?.icon && record?.kind
            ? React.createElement(resourceDefinition.icon, {
                  fontSize: 'small',
                  kind: record?.kind,
              })
            : false;

    const icon =
        iconProps === false
            ? false
            : isValidElement(iconProps)
            ? iconProps
            : defaultIcon;
    const badge =
        badgeProps === false
            ? false
            : isValidElement(badgeProps)
            ? badgeProps
            : defaultBadge;

    const secondaryText = secondaryIcon ? (
        <Stack direction="row" spacing={1} alignItems="center">
            {secondaryIcon}
            <Typography variant="subtitle1">
                {translate('pages.pageTitle.show.subtitle', {
                    resource: label,
                    kind,
                })}
            </Typography>
        </Stack>
    ) : (
        translate('pages.pageTitle.show.subtitle', {
            resource: label,
            kind,
        })
    );

    return (
        <PageTitle
            text={translate('pages.pageTitle.show.title', {
                resource: label,
                name,
            })}
            secondaryText={secondaryText}
            icon={icon}
            badge={badge}
            {...rest}
        />
    );
};

export const CreatePageTitle = (props: RecordPageTitleProps) => {
    const resource = useResourceContext();
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();

    const label = resource ? getResourceLabel(resource, 1).toLowerCase() : '';

    return (
        <PageTitle
            text={translate('pages.pageTitle.create.title', {
                resource: label,
            })}
            secondaryText={translate('pages.pageTitle.create.subtitle', {
                resource: label,
            })}
            {...props}
        />
    );
};

export const EditPageTitle = (props: RecordPageTitleProps) => {
    const { icon: iconProps, badge: badgeProps, ...rest } = props;
    const resourceDefinition = useResourceDefinition(props);
    const resource = useResourceContext();
    const record = useRecordContext(props);
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();

    const label = resource ? getResourceLabel(resource, 1).toLowerCase() : '';
    const name = record?.name || '';
    const kind = record?.kind || '';

    const defaultBadge = record?.status?.state ? (
        <StateBadge record={record} />
    ) : (
        false
    );

    const defaultIcon = resourceDefinition?.icon
        ? React.createElement(resourceDefinition.icon, {
              fontSize: 'large',
              kind: 'default',
          })
        : false;

    const icon =
        iconProps === false
            ? false
            : isValidElement(iconProps)
            ? iconProps
            : defaultIcon;
    const badge =
        badgeProps === false
            ? false
            : isValidElement(badgeProps)
            ? badgeProps
            : defaultBadge;

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
            icon={icon}
            badge={badge}
            {...rest}
        />
    );
};
