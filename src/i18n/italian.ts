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
    fields,
    specs,
    resources,
    pages,
    states,
    csv,
    messages,
    actions,
};

export default translations;
