// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { ValidatorType, RJSFSchema } from '@rjsf/utils';

export const isValidAgainstSchema =
    (ajv: ValidatorType<any, RJSFSchema, any>, schema: any) => value => {
        if (ajv == null || ajv == undefined) {
            return undefined;
        }
        if (!schema || !value) return undefined;
        try {
            const validation = ajv.validateFormData(value, schema);
            if (!validation.errors) {
                return undefined;
            }

            const errors = validation.errors?.map(
                e => e.property + ': ' + e.message
            );
            return errors?.join(',');
        } catch (error) {
            return 'error with validator';
        }
    };

/**
 * Filter second schema from first. Remove if embedded (via allOf) or clear matching properties as fallback
 * @param first
 * @param second
 * @returns
 */

export const filterProps = (first: any, second: any) => {
    if (
        !first ||
        !second ||
        !('properties' in first) ||
        !('properties' in second) ||
        typeof first.properties !== 'object' ||
        typeof second.properties !== 'object'
    ) {
        //invalid schema
        return {};
    }

    //filter out allOf if matches second
    const allOf =
        first.allOf &&
        'title' in second &&
        first.allOf.find(a => a.title === second.title)
            ? first.allOf.filter(a => a.title != second.title)
            : first.allOf;

    let properties = first.properties;
    if (allOf && allOf.length === first.allOf.length) {
        //no filtering applied, fallback
        //filter props from second and collect to new
        const keys = Object.keys(second.properties);
        properties = Object.keys(first.properties)
            .filter(key => !keys.includes(key))
            .reduce((obj, key) => {
                obj[key] = first.properties[key];
                return obj;
            }, {});
    }

    //deep copy first but properties and allOf
    const filteredFirst = {
        ...JSON.parse(JSON.stringify(first)),
        properties: JSON.parse(JSON.stringify(properties)),
        allOf: allOf ? JSON.parse(JSON.stringify(allOf)) : [],
    };

    if (Array.isArray(filteredFirst.required)) {
        filteredFirst.required = filteredFirst.required.filter(
            key => !Object.keys(second.properties).includes(key)
        );
    }

    return filteredFirst;
};

export const filterProperties = (schema, keys) => {
    if (!schema) return null;

    //remove properties definition
    //TODO handle nested in allOf/anyOf
    const filteredSchema = {
        ...JSON.parse(JSON.stringify(schema)),
        properties: Object.keys(schema.properties ?? {})
            .filter(key => !keys.includes(key))
            .reduce((obj, key) => {
                obj[key] = schema.properties[key];
                return obj;
            }, {}),
    };

    if (Array.isArray(schema.required)) {
        filteredSchema.required = schema.required.filter(
            key => !keys.includes(key)
        );
    }

    return filteredSchema;
};
/**
 * Merge ui templates from a base with a template, properly processing the schema for properties
 * @param schema
 * @param base
 * @param template
 * @returns
 */

export const mergeUiTemplate = (schema: any, base: any, template: any) => {
    if (!schema || !('properties' in schema) || !base || !template) {
        return {};
    }

    //filter and merge with template
    const keys = Object.keys(template).filter(k => !k.startsWith('ui:'));
    const ui = Object.keys(schema.properties)
        .filter(key => keys.includes(key))
        .reduce((obj, key) => {
            obj[key] = template[key];
            return obj;
        }, base);

    //build order if provided in base
    if ('ui:order' in base) {
        //add every other prop if missing
        const ordering = Object.keys(schema.properties)
            .filter(p => !keys.includes(p))
            .filter(key => !base['ui:order'].includes(key))
            .reduce((obj, key) => {
                obj.push(key);
                return obj;
            }, base['ui:order']);

        ui['ui:order'] =
            'ui:order' in template
                ? ordering.concat(template['ui:order'])
                : ordering;

        //TODO handle allOf/anyOf ordering
    }

    return ui;
};
