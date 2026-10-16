import { Labeled, useRecordContext } from 'react-admin';
import { YamlTab } from './yaml';

export const SpecTab = () => {
    const record = useRecordContext();
    if (!record?.spec) return <> </>;

    return (
        <Labeled label="fields.spec.title" sx={{ width: '100%' }}>
            <YamlTab record={record?.spec} />
        </Labeled>
    );
};
