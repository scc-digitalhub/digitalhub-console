// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Menu, MenuItem, Box, CardHeader, ListItemText } from '@mui/material';
import { useState, useEffect, useCallback, useRef, ReactElement } from 'react';
import {
    useTranslate,
    IconButtonWithTooltip,
    useDataProvider,
} from 'react-admin';
import { MetricBadge, MetricProps } from './MetricBadge';
import MetricsIcon from '@mui/icons-material/QueryStats';
import { formatMetricsValue } from './utils';

const defaultMetrics = ['cpu', 'memory', 'disk'];
const defaultIcon = <MetricsIcon fontSize="small" />;

export const MetricsMenu = (
    props: Omit<MetricProps, 'value' | 'name' | 'icon' | 'title'> & {
        record?: any;
    } & {
        icon?: ReactElement;
        labels?: boolean;
        metrics?: string[] | boolean;
    }
) => {
    const {
        metrics: metricsKeys = defaultMetrics,
        icon = defaultIcon,
        labels = true,
        size = 'small',
        fontSize,
        ...rest
    } = props;

    const translate = useTranslate();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const dataProvider = useDataProvider();
    const [metrics, setMetrics] = useState<any>();
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchMetrics = useCallback(() => {
        if (dataProvider) {
            const url = '/users/me/metrics/k8s';
            dataProvider
                .invoke({
                    path: url,
                    options: { method: 'GET' },
                })
                .then(res => {
                    if (res?.usage && Object.keys(res.usage).length > 0) {
                        //if default metrics is missing add them with null value
                        const completeMetrics = {
                            usage: Object.fromEntries(
                                (Array.isArray(metricsKeys)
                                    ? metricsKeys
                                    : defaultMetrics
                                ).map(key => [
                                    key,
                                    res.usage[key] !== undefined
                                        ? res.usage[key]
                                        : null,
                                ])
                            ),
                        };
                        setMetrics(completeMetrics);
                    } else {
                        //if no res, set empty metrics
                        setMetrics({
                            usage: Object.fromEntries(
                                (Array.isArray(defaultMetrics)
                                    ? defaultMetrics
                                    : []
                                ).map(key => [key, null])
                            ),
                        });
                    }
                });
        }
    }, [dataProvider]);

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    useEffect(() => {
        if (anchorEl) {
            intervalRef.current = setInterval(() => {
                fetchMetrics();
            }, 5000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [fetchMetrics, anchorEl]);

    if (!metrics || !metrics.usage || Object.keys(metrics.usage).length === 0) {
        return null;
    }
    const handleOpen = (event): void => {
        setAnchorEl(event.currentTarget);
        //refresh value
        fetchMetrics();
        event.stopPropagation();
    };
    const handleClose = (event?): void => {
        setAnchorEl(null);
        if (event) {
            event.stopPropagation();
        }
    };

    const isOpen = Boolean(anchorEl);

    return (
        <Box className="DropDownMenu" component="span">
            <Box>
                <IconButtonWithTooltip
                    label={'pages.menu.metrics.header'}
                    onClick={handleOpen}
                    color="inherit"
                >
                    {icon}
                </IconButtonWithTooltip>
            </Box>
            <Menu
                id="dropdown-menu"
                disableScrollLock
                anchorEl={anchorEl}
                keepMounted
                open={isOpen}
                onClose={handleClose}
                sx={theme => ({
                    '& .MuiMenu-list': {
                        backgroundColor: 'white',
                        p: 0,
                        ...theme.applyStyles('dark', {
                            backgroundColor: 'black',
                        }),
                    },
                    '& .MuiMenuItem-root': {
                        p: 0,
                        borderBottom: '1px solid #ddd',
                    },
                })}
            >
                <MenuItem sx={{ borderBottom: '2px' }}>
                    <CardHeader
                        sx={{ width: '100%', py: '5px' }}
                        title={translate('pages.menu.metrics.header')}
                        subheader={translate(
                            'pages.menu.metrics.subheader'
                        )}
                        slotProps={{
                            title: {
                                variant: 'subtitle1',
                            },
                            subheader: {
                                variant: 'subtitle2',
                            },
                        }}
                    />
                </MenuItem>

                {metrics?.usage &&
                    Object.keys(metrics.usage).length > 0 &&
                    Object.entries(metrics.usage)
                        .filter(([key]) =>
                            Array.isArray(metricsKeys)
                                ? metricsKeys.includes(key)
                                : metricsKeys
                        )
                        .map(([key, value]) => (
                            <MenuItem key={'mtr-' + key}>
                                <ListItemText sx={{ px: 1, py: 0.2 }}>
                                    <MetricBadge
                                        name={key}
                                        value={formatMetricsValue(key, value)}
                                        size={size ? size : 'large'}
                                        fontSize={
                                            fontSize ? fontSize : 'medium'
                                        }
                                        title={
                                            labels === false
                                                ? false
                                                : `fields.k8s.resources.${key}.title`
                                        }
                                        direction="row"
                                        gap={1}
                                        {...rest}
                                    />
                                </ListItemText>
                            </MenuItem>
                        ))}
            </Menu>
        </Box>
    );
};
