import italianMessages from '@dslab/ra-language-italian';

import * as fields from './it/fields.json';
import * as pages from './it/pages.json';
import * as resources from './it/resources.json';
import * as specs from './it/specs.json';
import * as csv from './it/csv.json';
import * as states from './it/states.json';
import * as actions from './it/actions.json';
import * as messages from './it/messages.json';

const translations = {
    ...italianMessages,
    fields: fields && 'default' in fields ? fields['default'] : fields,
    specs: specs && 'default' in specs ? specs['default'] : specs,
    resources: resources && 'default' in resources ? resources['default'] : resources,
    pages: pages && 'default' in pages ? pages['default'] : pages,
    csv: csv && 'default' in csv ? csv['default'] : csv,
    states: states && 'default' in states ? states['default'] : states,
    messages: messages && 'default' in messages ? messages['default'] : messages,
    actions: actions && 'default' in actions ? actions['default'] : actions,
};

export default translations;
