// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { MenuItemLink, useBasename } from 'react-admin';
import { useViewContributions } from '../registry';
import { ConsoleViewName } from '../ConsoleExtension';

export const ExtensionsMenuItems = (props: {
    resource?: string;
    view?: ConsoleViewName;
}) => {
    const { resource, view } = props;
    const basename = useBasename();
    const contributions = useViewContributions({
        showIn: 'menu',
        resource,
        view,
    });

    return (
        <>
            {contributions.map(c => (
                <MenuItemLink
                    key={c.id}
                    to={`${basename}${c.path}`}
                    primaryText={c.label || c.id}
                    leftIcon={c.icon}
                />
            ))}
        </>
    );
};