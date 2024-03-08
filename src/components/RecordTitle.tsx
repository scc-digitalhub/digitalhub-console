import { useRecordContext } from 'react-admin';

export const RecordTitle = ({ prompt }: any) => {
    const record = useRecordContext();
    return (
        <span>
            {prompt} {record ? `${record.name}` : ''}
        </span>
    );
};
