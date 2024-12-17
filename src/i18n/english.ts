import englishMessages from 'ra-language-english';

import * as fields from './en/fields.json';
import * as pages from './en/pages.json';
import * as resources from './en/resources.json';
import * as specs from './en/specs.json';
import * as csv from './en/csv.json';
import * as states from './en/states.json';
import * as messages from './en/messages.json';
import * as actions from './en/actions.json';

console.log('fields', fields);
const translations = {
    ...englishMessages,
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
