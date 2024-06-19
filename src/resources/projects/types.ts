export const ProjectMetadataViewUiSchema = {
    // 'ui:ObjectFieldTemplate': MetadataTemplate,
    project: {
        'ui:widget': 'hidden',
    },
    version: {
        'ui:widget': 'hidden',
    },
    created: {
        'ui:widget': 'hidden',
    },
    description: {
        'ui:widget': 'text',
    },
    labels: {
        'ui:widget': 'tagsChipInput',
    },
};

export const ProjectMetadataEditUiSchema = {
    // 'ui:ObjectFieldTemplate': MetadataTemplate,
    project: {
        'ui:widget': 'hidden',
    },
    version: {
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
