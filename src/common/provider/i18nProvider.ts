// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import polyglotI18nProvider from 'ra-i18n-polyglot';
import type { StringMap } from 'react-admin';
import en from '../../i18n/english';
import it from '../../i18n/italian';

const translations = { en, it };
const availableLocales = [
    { locale: 'en', name: 'English' },
    { locale: 'it', name: 'Italiano' },
];

export const i18nProvider = polyglotI18nProvider(
    locale => {
        let localeTyped = locale as keyof typeof translations;
        return translations[localeTyped];
    },
    'en', // default locale
    availableLocales,
    { allowMissing: true }
);

export const createExtensionI18nProvider = (
    extensionTranslations: Record<string, StringMap>
) =>
    polyglotI18nProvider(
        locale => ({
            ...translations[locale as keyof typeof translations],
            ...extensionTranslations[locale],
        }),
        i18nProvider.getLocale(),
        availableLocales,
        { allowMissing: true }
    );
