import {
    RaRecord,
    DeleteWithConfirmButton,
    DeleteWithConfirmButtonProps,
    useRecordContext,
} from 'react-admin';

export const DeleteWithConfirmButtonByName = <
    RecordType extends RaRecord = any
>(
    props: DeleteWithConfirmButtonProps<RecordType> & { deleteAll?: boolean }
) => {
    const { deleteAll = false, translateOptions, ...rest } = props;
    const record = useRecordContext(rest);
    if (!record) return <></>;

    const mutationsOptions = {
        meta: {
            deleteAll,
            name: record.name,
        },
    };

    return (
        <DeleteWithConfirmButton
            translateOptions={translateOptions ?? { id: record.name }}
            {...rest}
            mutationOptions={mutationsOptions}
        />
    );
};
