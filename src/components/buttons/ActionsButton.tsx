import {
    EditButton,
    ShowButton,
    useDatagridContext,
    useExpanded,
    useRecordContext,
    useResourceContext,
    useResourceDefinition,
} from 'react-admin';
import { RowButtonGroup } from './RowButtonGroup';
import { DropDownButton } from './DropdownButton';
import { DeleteWithConfirmButtonByName } from './DeleteWithConfirmButtonByName';

export const ActionsButtons = () => {
    const record = useRecordContext();
    const resource = useResourceContext();
    const definition = useResourceDefinition();
    const context = useDatagridContext();
    const [expanded] = useExpanded(
        resource,
        record.id,
        context && context.expandSingle
    );

    if (!record) {
        return null;
    }

    return (
        <RowButtonGroup>
            <DropDownButton>
                {definition?.hasShow && <ShowButton disabled={expanded} />}
                {definition?.hasEdit && <EditButton disabled={expanded} />}
                <DeleteWithConfirmButtonByName deleteAll disabled={expanded} />
            </DropDownButton>
        </RowButtonGroup>
    );
};
