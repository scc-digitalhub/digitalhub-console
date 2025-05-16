import { TriggerIcon } from './icon';
import { TriggerList } from './list';
import { TriggerShow } from './show';

export default {
    name: 'triggers',
    list: TriggerList,
    icon: TriggerIcon,
    show: TriggerShow,
    recordRepresentation: record => record?.kind || record.id,
};
