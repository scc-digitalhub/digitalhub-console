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

    const properties = Object.keys(schema.properties ?? {});
    const propertyKeys = new Set(properties);
    const ui = { ...base };

    for (const key of Object.keys(template)) {
        if (!(key in ui) && (propertyKeys.has(key) || key.startsWith('ui:'))) {
            ui[key] = template[key];
        }
    }

    if ('ui:order' in base || 'ui:order' in template) {
        const order: string[] = Array.isArray(base['ui:order'])
            ? [...base['ui:order']]
            : [];

        if (Array.isArray(template['ui:order'])) {
            for (const property of template['ui:order']) {
                if (propertyKeys.has(property) && !order.includes(property)) {
                    order.push(property);
                }
            }
        }

        for (const property of properties) {
            if (!order.includes(property)) order.push(property);
        }

        //mimic backend workaround
        //build a fake object to expose details about template FROM profile as dependencies
        //TODO: remove when frontend lib supports description on enumerables
        //see https://github.com/rjsf-team/react-jsonschema-form/issues/4214

        if (propertyKeys.has('profile')) {
            const profileDependency = schema.dependencies?.profile;
            const dependencyProperties: string[] = [];

            for (const keyword of ['anyOf', 'oneOf']) {
                const branches = profileDependency?.[keyword];
                if (!Array.isArray(branches)) continue;

                for (const branch of branches) {
                    for (const property of Object.keys(
                        branch.properties ?? {}
                    )) {
                        if (
                            property !== 'profile' &&
                            !propertyKeys.has(property) &&
                            !dependencyProperties.includes(property)
                        ) {
                            dependencyProperties.push(property);
                        }
                    }
                }
            }

            if (order.includes('profile')) {
                for (const property of dependencyProperties) {
                    const existingIndex = order.indexOf(property);
                    if (existingIndex !== -1) {
                        order.splice(existingIndex, 1);
                    }
                }
                const profileIndex = order.indexOf('profile');
                order.splice(profileIndex + 1, 0, ...dependencyProperties);
            }
        }

        ui['ui:order'] = order;
    }

    return ui;
};
