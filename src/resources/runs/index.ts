import { RunIcon } from './icon';
import { RunList } from './list';
import { RunShow } from './show';

export default {
    name: 'runs',
    list: RunList,
    icon: RunIcon,
    show: RunShow,
    recordRepresentation: record =>
        record?.spec?.function
            ? record.spec.function.split('/')[3].split(':')[0]
            : record.id,
};
