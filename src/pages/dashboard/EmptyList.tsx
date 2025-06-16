// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Typography } from '@mui/material';
import { useTranslate, useGetResourceLabel } from 'react-admin';

export const EmptyList = (props: { resource: string }) => {
    const { resource } = props;
    const translate = useTranslate();
    const getResourceLabel = useGetResourceLabel();

    const resourceName = (resource: string) =>
        translate(`resources.${resource}.forcedCaseName`, {
            smart_count: 1,
            _: getResourceLabel(resource, 1),
        });

    return (
        <Typography
            variant="body1"
            color={'gray'}
            sx={{ textAlign: 'center', pt: 5 }}
        >
            {translate('ra.page.empty', {
                name: resourceName(resource),
            })}
        </Typography>
    );
};
