// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Menu, MenuItem, Box, CardHeader, ListItemText } from '@mui/material';
import { useState, ReactElement } from 'react';
import { useTranslate, IconButtonWithTooltip } from 'react-admin';
import { MetricBadge, MetricProps } from './MetricBadge';
import MetricsIcon from '@mui/icons-material/QueryStats';
import { formatMetricsValue } from './utils';
import { useResourceMetrics } from './useResourceMetrics';

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
    const { metrics, refresh: fetchMetrics } = useResourceMetrics({
        resource: 'users',
        record: { id: 'me' },
        refreshInterval: 30000,
    });

    if (!metrics?.metrics || metrics.metrics?.length === 0) {
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
                        subheader={translate('pages.menu.metrics.subheader')}
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

                {metrics?.metrics &&
                    metrics.metrics?.length > 0 &&
                    metrics.metrics
                        .filter(e =>
                            Array.isArray(metricsKeys)
                                ? metricsKeys.includes(e.name)
                                : metricsKeys
                        )
                        .map(e => ({
                            name: e.name,
                            value: e.summary?.find(s => s.name == 'avg')?.value,
                        }))
                        .map(e => (
                            <MenuItem key={'mtr-' + e.name}>
                                <ListItemText sx={{ px: 1, py: 0.2 }}>
                                    <MetricBadge
                                        name={e.name}
                                        value={formatMetricsValue(
                                            e.name,
                                            e.value
                                        )}
                                        size={size ? size : 'large'}
                                        fontSize={
                                            fontSize ? fontSize : 'medium'
                                        }
                                        title={
                                            labels === false
                                                ? false
                                                : `fields.k8s.resources.${e.name}.title`
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
