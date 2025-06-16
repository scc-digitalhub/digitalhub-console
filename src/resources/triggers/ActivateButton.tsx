// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    Button,
    ButtonProps,
    RaRecord,
    useDataProvider,
    useRecordContext,
    useRefresh,
} from 'react-admin';

import { useRootSelector } from '@dslab/ra-root-selector';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { ReactElement } from 'react';

const defaultIcon = <PlayCircleIcon />;

export const ActivateButton = (props: ActivateButtonProps) => {
    const {
        label = 'actions.activate',
        icon = defaultIcon,
        id: idProp,
        record: recordProp,
        ...rest
    } = props;
    const { root: projectId } = useRootSelector();
    const dataProvider = useDataProvider();
    const refresh = useRefresh();

    const recordContext = useRecordContext();
    const record = recordProp || recordContext;
    const id = idProp || record?.id;

    const onClick = () => {
        const url = '/-/' + projectId + '/triggers/' + id + '/run';
        dataProvider
            .invoke({ path: url, options: { method: 'POST' } })
            .then(() => {
                refresh();
            });
    };

    return (
        <Button label={label} startIcon={icon} onClick={onClick} {...rest} />
    );
};

export type ActivateButtonProps<RecordType extends RaRecord = any> =
    ButtonProps & {
        id?: string;
        record?: RecordType;
        icon?: ReactElement;
    };
