import {
    RaRecord,
    DeleteWithConfirmButton,
    DeleteWithConfirmButtonProps,
    useRecordContext,
} from 'react-admin';

export const DeleteWithConfirmButtonShowingName = <
    RecordType extends RaRecord = any
>(
    props: DeleteWithConfirmButtonProps<RecordType>
) => {
    const record = useRecordContext(props);
    if (!record) return <></>;
    return (
        <DeleteWithConfirmButton
            translateOptions={{ id: record.name }}
            {...props}
        />
    );
};
