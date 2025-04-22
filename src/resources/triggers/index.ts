import { TriggerIcon } from './icon';
import { TriggerList } from './list';
import { RunShow } from './show';

export default {
    name: 'triggers',
    list: TriggerList,
    icon: TriggerIcon,
    show: RunShow,
    recordRepresentation: record => record?.kind || record.id,
};
