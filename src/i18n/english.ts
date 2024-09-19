import englishMessages from 'ra-language-english';

import * as fields from './en/fields.json';
import * as pages from './en/pages.json';
import * as resources from './en/resources.json';
import * as specs from './en/specs.json';
import * as csv from './en/csv.json';
import * as states from './en/states.json';
import * as messages from './en/messages.json';
import * as actions from './en/actions.json';

const translations = {
    ...englishMessages,
    fields,
    specs,
    resources,
    pages,
    csv,
    states,
    messages,
    actions,
};

export default translations;
