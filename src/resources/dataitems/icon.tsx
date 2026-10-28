// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import TableChartIcon from '@mui/icons-material/TableChart';
import Croissant from '@mui/icons-material/BakeryDining';
import Table from '@mui/icons-material/GridOn';

export const DataItemIcon = (props: {
    kind?: string;
    color?:
        | 'disabled'
        | 'action'
        | 'inherit'
        | 'error'
        | 'primary'
        | 'secondary'
        | 'success'
        | 'info'
        | 'warning';
    fontSize?: 'small' | 'medium' | 'large';
}) => {
    const { kind, color, fontSize } = props;

    if (kind === 'table') {
        return <Table color={color} fontSize={fontSize} />;
    }

    if (kind === 'croissant') {
        return <Croissant color={color} fontSize={fontSize} />;
    }

    return <TableChartIcon color={color} fontSize={fontSize} />;
};
