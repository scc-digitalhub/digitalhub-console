export const getSpecSchema = (schemas: any[], kind: string | undefined) => {
    return schemas ? schemas.find(s => s.kind === kind)?.schema : {};
};

export const getUiSchema = (schemas: any[], kind: string | undefined) => {
    return schemas ? schemas.find(s => s.kind === kind)?.uiSchema : {};
};
