// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Button, ButtonProps, RaRecord, useRecordContext } from 'react-admin';

import StopCircleIcon from '@mui/icons-material/StopCircle';
import { ReactElement } from 'react';
import { useStopRun } from '../../../common/hooks/useStopRun';

const defaultIcon = <StopCircleIcon />;

export const StopButton = (props: StopButtonProps) => {
    const {
        label = 'actions.stop',
        icon = defaultIcon,
        id: idProp,
        record: recordProp,
        ...rest
    } = props;

    const recordContext = useRecordContext();
    const record = recordProp || recordContext;
    const id = idProp || record?.id;
    const stopRun = useStopRun();

    const onClick = () => {
        stopRun(id);
    };

    //TODO evaluate using dialog
    return (
        <Button label={label} startIcon={icon} onClick={onClick} {...rest} />
    );
};

export type StopButtonProps<RecordType extends RaRecord = any> = ButtonProps & {
    id?: string;
    record?: RecordType;
    icon?: ReactElement;
};
