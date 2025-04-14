
export enum ReportTypes {
    REPORT = 'report',
}

export const getReportSpecUiSchema = (kind: string | undefined) => {
    if (!kind) {
        return undefined;
    }

    const base = {

        entity: {
            'ui:widget': 'hidden',
        },
        entity_type: {
            'ui:widget': 'hidden',
        },
    };

    return base;
};
