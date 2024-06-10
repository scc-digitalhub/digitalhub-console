export const MetadataSchema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    type: 'object',
    title: 'Metadata',
    required: [],
    properties: {
        name: {
            type: 'string',
        },
        description: {
            type: 'string',
        },
        project: {
            type: 'string',
        },
        version: {
            type: 'string',
        },
        created: {
            type: 'string',
            format: 'date-time',
        },
        updated: {
            type: 'string',
            format: 'date-time',
        },
        labels: {
            type: 'array',
            items: {
                type: 'string',
            },
        },
    },
};

export const MetadataCreateUiSchema = {
    project: {
        'ui:widget': 'hidden',
    },
    created: {
        'ui:widget': 'hidden',
    },
    description: {
        'ui:widget': 'textarea',
    },
    labels: {
        'ui:widget': 'tagsChipInput',
    },
};

export const MetadataEditUiSchema = {
    project: {
        'ui:widget': 'hidden',
    },
    created: {
        'ui:widget': 'hidden',
    },
    description: {
        'ui:widget': 'textarea',
    },
    labels: {
        'ui:widget': 'tagsChipInput',
    },
};

export const MetadataViewUiSchema = {
    project: {
        'ui:widget': 'hidden',
    },
    name: {
        'ui:widget': 'hidden',
    },
    description: {
        'ui:widget': 'text',
    },
    labels: {
        'ui:widget': 'tagsChipInput',
    },
};

export const createMetadataViewUiSchema = (metadata: any) => {
    const schema = Object.assign({}, MetadataViewUiSchema);
    for (const f in schema) {
        //replace missing values with hidden field
        if (metadata)
            if (!(f in metadata)) {
                schema[f]['ui:widget'] = 'hidden';
            }
    }

    return schema;
};

export const BlankSchema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    type: 'object',
    properties: {},
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
    return {
        ...JSON.parse(JSON.stringify(first)),
        properties: JSON.parse(JSON.stringify(properties)),
        allOf: JSON.parse(JSON.stringify(allOf)),
    };
};
