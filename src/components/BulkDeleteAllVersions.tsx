import {
    BulkDeleteButton,
    BulkDeleteButtonProps,
    useListContext,
} from 'react-admin';

export const BulkDeleteAllVersions = (
    props: BulkDeleteButtonProps & { deleteAll?: boolean }
) => {
    const { deleteAll = false, mutationMode = 'pessimistic', ...rest } = props;
    const { data, selectedIds } = useListContext();

    const selectedData = data.filter(d => selectedIds.includes(d.id));

    const mutationOptions = {
        meta: {
            deleteAll,
            names: selectedData.map(sd => sd.name),
        },
    };

    return (
        <BulkDeleteButton
            {...rest}
            mutationOptions={mutationOptions}
            mutationMode={mutationMode}
        />
    );
};
