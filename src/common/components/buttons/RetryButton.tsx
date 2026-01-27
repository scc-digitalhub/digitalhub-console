// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Button, ButtonProps } from 'react-admin';
import ReplayIcon from '@mui/icons-material/Replay';
import { ReactElement } from 'react';

const defaultIcon = <ReplayIcon />;

export const RetryButton = (props: RetryButtonProps) => {
    const { label = 'actions.retry', icon = defaultIcon, ...rest } = props;

    return (
        <Button label={label} {...rest}>
            {icon}
        </Button>
    );
};

export type RetryButtonProps = ButtonProps & {
    icon?: ReactElement;
};
