import {
    ChipField,
    FunctionField,
    Identifier,
    RaRecord,
    useRecordContext,
    useResourceContext,
} from 'react-admin';
import get from 'lodash/get';

export const StateChips = (props: {
    resource?: string;
    record?: RaRecord<Identifier>;
    source: string;
}) => {
    const { source, ...rest } = props;
    const record = useRecordContext(rest);
    const value = get(record, source)?.toString();
    if (!record || !value) {
        return <></>;
    }

    return <ChipField record={record} source={source} color={StateColors[value]} />;
};

export enum StateColors {
    COMPLETED = 'success',
    ERROR = 'error',
    RUNNING = 'warning',
    BUILT = 'warning',
    READY = 'success',
}
