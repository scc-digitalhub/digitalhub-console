// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    JsonSchemaField as RaJsonSchemaField,
    JsonSchemaInput as RaJsonSchemaInput,
    JsonSchemaFieldProps,
    JSONSchemaFormatInputProps,
} from '@dslab/ra-jsonschema-input';
import { MuiChipsInputWidget } from './widgets/MuiChipsInputWidget';
import { CoreResourceFieldTemplate } from './templates/CoreResourceFieldTemplate';
import { KeyValueFieldTemplate } from './templates/KeyValueFieldTemplate';
import { VolumeResourceFieldTemplate } from './templates/VolumeResourceFieldTemplate';
import { AceEditorWidget } from './widgets/AceEditorWidget';
import TitleFieldTemplate from './templates/TitleFieldTemplate';
import { JsonParamsWidget } from './widgets/JsonParamsWidget';
import MultiSchemaFieldTemplate from './templates/MultiSchemaFieldTemplate';
import WrapIfAdditionalTemplate from './templates/WrapIfAdditionalTemplate';
import AceField from './fields/AceField';
import { HtmlPreview } from './widgets/HtmlPreview';
import { JsonPreview } from './widgets/JsonPreview';
import { useLocale, useTranslate } from 'react-admin';
import { UiSchema } from '@rjsf/utils';
import { useJsonSchemaContributions } from '../../../features/extensions/registry';

const customWidgets = {
    tagsChipInput: MuiChipsInputWidget,
    parameters: JsonParamsWidget,
    'java+base64': AceEditorWidget,
    'javascript+base64': AceEditorWidget,
    markdown: AceEditorWidget,
    html: AceEditorWidget,
    yaml: AceEditorWidget,
    css: AceEditorWidget,
    json: AceEditorWidget,
    'json+base64': AceEditorWidget,
    sql: AceEditorWidget,
    richtext: AceEditorWidget,
    xml: AceEditorWidget,
    ace: AceEditorWidget,
    'html-preview': HtmlPreview,
    'json-preview': JsonPreview,
};
const customTemplates = {
    CoreResourceFieldTemplate,
    KeyValueFieldTemplate,
    VolumeResourceFieldTemplate,
    TitleFieldTemplate,
    MultiSchemaFieldTemplate,
    WrapIfAdditionalTemplate,
};
const customFields = {
    AceField,
};

const mergeWithConflictCheck = (
    base: Record<string, unknown>,
    extension: Record<string, unknown>,
    mapType: 'widget' | 'template' | 'field'
) => {
    for (const key of Object.keys(extension)) {
        if (Object.hasOwn(base, key)) {
            throw new Error(
                `Console extension jsonSchema ${mapType} key already registered: ${key}`
            );
        }
    }

    return {
        ...base,
        ...extension,
    };
};

const applyTranslation = (
    uiSchema: string | object | UiSchema,
    locale: string,
    translate: (key: string) => string
): any => {
    // Translate schema titles and descriptions when provided inline with @locale suffix
    // NOTE: we apply translate on the return to enable key based translation
    // it's a no-op when the key is not found and returns the key itself
    if (uiSchema && typeof uiSchema === 'object') {
        if (uiSchema['ui:title@' + locale]) {
            uiSchema['ui:title'] = translate(uiSchema['ui:title@' + locale]);
        }
        if (uiSchema['ui:description@' + locale]) {
            uiSchema['ui:description'] = translate(
                uiSchema['ui:description@' + locale]
            );
        }
    }

    Object.keys(uiSchema).forEach(key => {
        if (uiSchema[key] && typeof uiSchema[key] === 'object') {
            if (uiSchema[key]?.['ui:title@' + locale]) {
                uiSchema[key]['ui:title'] = translate(
                    uiSchema[key]['ui:title@' + locale]
                );
            }
            if (uiSchema[key]?.['ui:description@' + locale]) {
                uiSchema[key]['ui:description'] = translate(
                    uiSchema[key]['ui:description@' + locale]
                );
            }

            Object.keys(uiSchema[key]).forEach(subKey => {
                uiSchema[key][subKey] = applyTranslation(
                    uiSchema[key][subKey],
                    locale,
                    translate
                );
            });
        }
    });

    return uiSchema;
};

export const JsonSchemaField = (props: JsonSchemaFieldProps) => {
    const { schema, uiSchema, ...rest } = props;
    const locale = useLocale();
    const translate = useTranslate();
    const { widgets, templates } = useJsonSchemaContributions();

    const mergedWidgets = mergeWithConflictCheck(
        customWidgets as Record<string, unknown>,
        widgets,
        'widget'
    );
    const mergedTemplates = mergeWithConflictCheck(
        customTemplates as Record<string, unknown>,
        templates,
        'template'
    );

    return (
        <RaJsonSchemaField
            schema={schema}
            uiSchema={
                uiSchema
                    ? applyTranslation(uiSchema, locale, translate)
                    : undefined
            }
            customWidgets={mergedWidgets as any}
            templates={{ ...(mergedTemplates as any), ...props.templates }}
            {...rest}
        />
    );
};

export const JsonSchemaInput = (props: JSONSchemaFormatInputProps) => {
    const { schema, uiSchema, ...rest } = props;
    const locale = useLocale();
    const translate = useTranslate();
    const { widgets, templates, fields } = useJsonSchemaContributions();

    const mergedWidgets = mergeWithConflictCheck(
        customWidgets as Record<string, unknown>,
        widgets,
        'widget'
    );
    const mergedTemplates = mergeWithConflictCheck(
        customTemplates as Record<string, unknown>,
        templates,
        'template'
    );
    const mergedFields = mergeWithConflictCheck(
        customFields as Record<string, unknown>,
        fields,
        'field'
    );

    return (
        <RaJsonSchemaInput
            schema={schema}
            uiSchema={
                uiSchema
                    ? applyTranslation(uiSchema, locale, translate)
                    : undefined
            }
            customWidgets={mergedWidgets as any}
            templates={{ ...(mergedTemplates as any), ...props.templates }}
            fields={{ ...(mergedFields as any) }}
            {...rest}
        />
    );
};
