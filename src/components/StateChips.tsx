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

export const StateChips = (props: {
    resource?: string;
    record?: RaRecord<Identifier>;
    source: string;
    label?: string;
    sortable?: boolean;
}) => {
    const { source, ...rest } = props;
    const translate = useTranslate();
    const record = useRecordContext(rest);
    const value = get(record, source)?.toString().toUpperCase();
    if (!record || !value) {
        return <></>;
    }

    const r = {
        value: translate('states.' + value.toLowerCase()).toUpperCase(),
    };

    return <ChipField record={r} source={'value'} color={StateColors[value]} />;
};

export enum StateColors {
    BUILT = 'warning',
    COMPLETED = 'success',
    CREATED = 'default',
    DELETED = 'secondary',
    DELETING = 'warning',
    ERROR = 'error',
    PENDING = 'warning',
    READY = 'success',
    RUNNING = 'info',
    STOP = 'warning',
    STOPPED = 'warning',
    SUCCEEDED = 'success',
    UPLOADING = 'info',
}
