// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { createElement, ReactElement } from 'react';
import { AiComplianceDataPage } from '../ai-compliance/AiComplianceDataPage';
import { AiComplianceModelPage } from '../ai-compliance/AiComplianceModelPage';
import { useLocale, useRecordContext, useTranslate } from 'react-admin';
import { useGetSchemas } from '../../common/jsonSchema/schemaController';
import { ExtensionsField } from './Field';
import { CustomTabbedShowLayout } from '../../common/components/CustomTabbedShowLayout';
import get from 'lodash/get';

const EXTENSION_WIDGETS = {
    'data-compliance': AiComplianceDataPage,
    'model-compliance': AiComplianceModelPage,
};

export const useExtensionsTabs = (props: {
    resource?: string;
    record?: any;
    source?: string;
}): ReactElement[] => {
    const { source = 'extensions' } = props;
    const record = useRecordContext(props);
    const translate = useTranslate();
    const locale = useLocale();
    const { data: schemas, isLoading } = useGetSchemas('extensions');

    const value = get(record, source);

    if (!value || isLoading || !schemas) {
        return [];
    }

    const kinds = value.map((e: any) => e.kind);
    const tabs = Array.from(
        new Set(
            kinds.filter((k: string) =>
                schemas.find(s => s.kind === k && s.showIn == 'tabs')
            ) as string[]
        )
    );

    const result: ReactElement[] = [];

    tabs.forEach((k: string) => {
        const ts = schemas.find(s => s.kind === k) || {};
        console.log('ts', ts);
        const label =
            ts?.uiSchema?.['ui:title@' + locale] ||
            ts?.uiSchema?.['ui:title'] ||
            ts?.schema.title ||
            k;
        console.log('label', label);
        const tabRecord = {
            ...record,
            [source]: value.filter((e: any) => e.kind === k),
        };
        console.log('kind', k);
        const widget = EXTENSION_WIDGETS[k] || ExtensionsField;
        const field =  createElement(widget, {
            source,
            record: tabRecord,
        });
        result.push(
            createElement(
                CustomTabbedShowLayout.Tab,
                { key: 'ext-' + k, value: k, label } as any,
                field
            )
        );
    });

    const restExtensions = value.filter((e: any) => !tabs.includes(e.kind));
    if (restExtensions.length > 0) {
        const restRecord = { ...record, [source]: restExtensions };
        const field = createElement(ExtensionsField, {
            source,
            record: restRecord,
        });
        result.push(
            createElement(
                CustomTabbedShowLayout.Tab,
                {
                    key: 'extensions',
                    value: 'extensions',
                    label: translate('fields.extensions.title'),
                } as any,
                field
            )
        );
    }

    return result;
};
