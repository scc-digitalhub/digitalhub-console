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
    const value = get(record, source)?.toString();
    if (!record || !value) {
        return <></>;
    }

    const r = {
        value: translate('states.' + value.toLowerCase()).toUpperCase(),
    };

    return <ChipField record={r} source={'value'} color={StateColors[value]} />;
};

export enum StateColors {
    COMPLETED = 'success',
    ERROR = 'error',
    RUNNING = 'info',
    BUILT = 'warning',
    READY = 'info',
    DELETED = 'secondary',
    DELETING = 'warning',
    STOP = 'warning',
    STOPPED = 'warning',
}
