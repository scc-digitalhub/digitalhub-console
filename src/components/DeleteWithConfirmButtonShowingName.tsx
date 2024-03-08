import { DeleteWithConfirmButton, useRecordContext } from 'react-admin';

export const DeleteWithConfirmButtonShowingName = () => {
    const record = useRecordContext();
    if (!record) return <></>;
    return <DeleteWithConfirmButton translateOptions={{ id: record.name }} />;
};
