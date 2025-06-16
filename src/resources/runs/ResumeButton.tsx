// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Button,
    ButtonProps,
    RaRecord,
    useDataProvider,
    useRecordContext,
} from 'react-admin';

import { useRootSelector } from '@dslab/ra-root-selector';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { ReactElement } from 'react';

const defaultIcon = <PlayCircleIcon />;

export const ResumeButton = (props: ResumeButtonProps) => {
    const {
        label = 'actions.resume',
        icon = defaultIcon,
        id: idProp,
        record: recordProp,
        ...rest
    } = props;
    const { root: projectId } = useRootSelector();
    const dataProvider = useDataProvider();

    const recordContext = useRecordContext();
    const record = recordProp || recordContext;
    const id = idProp || record?.id;

    const onClick = () => {
        const url = '/-/' + projectId + '/runs/' + id + '/resume';
        dataProvider.invoke({ path: url, options: { method: 'POST' } });
    };

    return (
        <Button label={label} startIcon={icon} onClick={onClick} {...rest} />
    );
};

export type ResumeButtonProps<RecordType extends RaRecord = any> =
    ButtonProps & {
        id?: string;
        record?: RecordType;
        icon?: ReactElement;
    };
