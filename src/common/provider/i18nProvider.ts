// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import polyglotI18nProvider from 'ra-i18n-polyglot';
import en from '../../i18n/english';
import it from '../../i18n/italian';

import { complianceWidgetMessages } from '../../features/ai-compliance/compliance-widgets';

const translations = { 
    en: {...en, ...complianceWidgetMessages.en},
    it: {...it, ...complianceWidgetMessages.it},
};

export const i18nProvider = polyglotI18nProvider(
    locale => {
        let localeTyped = locale as keyof typeof translations;
        return translations[localeTyped];
    },
    'en', // default locale
    [
        { locale: 'en', name: 'English' },
        { locale: 'it', name: 'Italiano' },
    ],
    { allowMissing: true }
);
