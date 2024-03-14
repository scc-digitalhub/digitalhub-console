export const ProjectMetadataSchema = {
    $schema: 'http://json-schema.org/draft-07/schema',
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
