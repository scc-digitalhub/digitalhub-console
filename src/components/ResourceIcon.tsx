// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { ReactNode, createElement } from 'react';
import { useResourceDefinition } from 'react-admin';
import DefaultIcon from '@mui/icons-material/ViewList';

export const ResourceIcon = (props: { resource: string }): ReactNode => {
    const { resource } = props;
    const definition = useResourceDefinition({ resource });

    if (definition?.icon) {
        return createElement(definition.icon);
    }

    return <DefaultIcon />;
};
