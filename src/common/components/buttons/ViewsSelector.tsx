// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { ReactNode } from 'react';
import { Button } from '@mui/material';
import { useTranslate } from 'react-admin';
import { DropDownButton } from './DropdownButton';
import TableIcon from '@mui/icons-material/TableChart';

export type View = {
    name: string;
    label?: string;
    icon?: ReactNode;
};

const defaultIcon = <TableIcon />;

export const ViewSelector = (props: {
    label?: string;
    views: View[];
    selectedView: string;
    setSelectedView?: (view: string) => void;
}) => {
    const {
        label = 'actions.view',
        views,
        selectedView,
        setSelectedView = () => {},
    } = props;
    const translate = useTranslate();

    const icon = selectedView
        ? views.find(view => view.name === selectedView)?.icon || defaultIcon
        : defaultIcon;

    return (
        <DropDownButton
            label={label}
            variant={'text'}
            color="secondary"
            icon={icon}
        >
            {views.map(view => (
                <Button
                    key={view.name}
                    variant={'text'}
                    onClick={() => setSelectedView(view.name)}
                    startIcon={view.icon || defaultIcon}
                    size="small"
                    color="secondary"
                >
                    {translate(view.label || view.name)}
                </Button>
            ))}
        </DropDownButton>
    );
};

export { default as TableViewIcon } from '@mui/icons-material/TableChart';
export { default as RowsViewIcon } from '@mui/icons-material/TableRows';
