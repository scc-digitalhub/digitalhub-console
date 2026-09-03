// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

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
    'metadata.relationships': { 'ui:widget': 'hidden' },
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

export const SchemaIdPrefixes = {
    artifacts: 'ARTIFACT:',
    dataitems: 'DATAITEM:',
    models: 'MODEL:',
};

export const Serializable = {
    additionalProperties: {
        //TODO change to oneOf when core is fixed
        anyOf: [
            {},
            {},
            { 'ui:label': false },
            {
                'ui:field': 'AceField',
                'ui:label': false,
            },
            { 'ui:label': false },
        ],
    },
};
