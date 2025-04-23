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
    updated: {
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
    updated: {
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
    'ui:order': ['created', 'updated', 'description', 'labels'],
    'ui:layout': [6, 6],
};
export const MetadataEmbeddedUiSchema = {
    embedded: {
        'ui:widget': 'hidden',
    },
};
export const MetadataVersioningUiSchema = {
    project: {
        'ui:widget': 'hidden',
    },
    name: {
        'ui:widget': 'hidden',
    },
};
export const MetadataAuditUiSchema = {
    created: {
        'ui:widget': 'hidden',
    },
    updated: {
        'ui:widget': 'hidden',
    },

    'ui:order': ['created_by', 'updated_by'],
    'ui:layout': [6, 6],
};
const metadataUiSchemas = {
    'metadata.base': MetadataViewUiSchema,
    'metadata.embedded': MetadataEmbeddedUiSchema,
    'metadata.versioning': MetadataVersioningUiSchema,
    'metadata.audit': MetadataAuditUiSchema,
};

export const createMetadataViewUiSchema = (
    metadata: any,
    schema: any,
    id: string
) => {
    const ui =
        id && id in metadataUiSchemas
            ? Object.assign({}, metadataUiSchemas[id])
            : {};

    if (schema) {
        for (const f of Object.keys(schema.properties)) {
            //hide missing/null values
            if (!(f in metadata)) {
                ui[f] = ui[f]
                    ? { ...ui[f], 'ui:widget': 'hidden' }
                    : { 'ui:widget': 'hidden' };
            }
        }
    }

    //inject properties if order and missing
    if (schema && ui['ui:order']) {
        for (const f of Object.keys(schema.properties)) {
            if (!ui['ui:order'].includes(f)) {
                ui['ui:order'].push(f);
            }
        }
    }

    //hide title
    ui['ui:title'] = false;

    //hide if empty/blank
    const hidden = Object.keys(ui).filter(
        p =>
            Object.keys(ui[p]).includes('ui:widget') &&
            ui[p]['ui:widget'] == 'hidden'
    );
    if (
        schema &&
        Object.keys(schema.properties).filter(p => !hidden.includes(p))
            .length == 0
    ) {
        //nothing to show
        ui['ui:hide'] = true;
    }

    return ui;
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
        allOf: allOf ? JSON.parse(JSON.stringify(allOf)) : [],
    };
};

export const SchemaIdPrefixes = {
    artifacts: 'ARTIFACT:',
    dataitems: 'DATAITEM:',
    models: 'MODEL:',
};
