// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    ChipField,
    Identifier,
    RaRecord,
    useRecordContext,
    useTranslate,
} from 'react-admin';
import get from 'lodash/get';

export const TypeChips = (props: {
    resource?: string;
    record?: RaRecord<Identifier>;
    source: string;
    label?: string;
    sortable?: boolean;
}) => {
    const { source, ...rest } = props;
    const translate = useTranslate();
    const record = useRecordContext(rest);
    const value = get(record, source)?.toString();
    if (!record || !value) {
        return <></>;
    }

    const r = {
        value: translate(value.toLowerCase()).toUpperCase(),
    };

    return <ChipField record={r} source={'value'} color={TypeColors[value]} />;
};

export enum TypeColors {
    Ready = 'info',
    Initialized = 'warning',
    PodReadyToStartContainers = 'success',
    ContainersReady = 'secondary',
    PodScheduled = 'default',
    COMPLETED = "success",
    ERROR = "error",
}
