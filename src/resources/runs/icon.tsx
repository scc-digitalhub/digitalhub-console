// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import { FunctionIcon, FunctionIconProps } from '../functions/icon';

export const RunIcon = (props: Omit<FunctionIconProps, 'defaultIcon'>) => {
    const { kind, color, fontSize } = props;
    return (
        <FunctionIcon
            kind={kind}
            color={color}
            fontSize={fontSize}
            defaultIcon={DirectionsRunIcon}
        />
    );
};
