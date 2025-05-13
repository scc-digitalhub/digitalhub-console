import {
    Button,
    ButtonProps,
    RaRecord,
    useDataProvider,
    useRecordContext,
} from 'react-admin';

import { useRootSelector } from '@dslab/ra-root-selector';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { ReactElement } from 'react';

const defaultIcon = <StopCircleIcon />;

export const DeactivateButton = (props: DeactivateButtonProps) => {
    const {
        label = 'actions.deactivate',
        icon = defaultIcon,
        id: idProp,
        record: recordProp,
        ...rest
    } = props;
    const { root: projectId } = useRootSelector();
    const dataProvider = useDataProvider();

    const recordContext = useRecordContext();
    const record = recordProp || recordContext;
    const id = idProp || record?.id;

    const onClick = () => {
        const url = '/-/' + projectId + '/triggers/' + id + '/stop';
        dataProvider.invoke({ path: url, options: { method: 'POST' } });
    };

    //TODO evaluate using dialog
    return (
        <Button label={label} startIcon={icon} onClick={onClick} {...rest} />
    );
};

export type DeactivateButtonProps<RecordType extends RaRecord = any> = ButtonProps & {
    id?: string;
    record?: RecordType;
    icon?: ReactElement;
};
