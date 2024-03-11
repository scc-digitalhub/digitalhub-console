import { BlankSchema } from "../../common/schemas";

export enum ArtifactTypes {
    ARTIFACT = 'artifact',
}

export const ArtifactDbtUiSchema = {
    source: {
        'ui:widget': 'textarea',
    },
};

export const getArtifactSpec = (kind: string | undefined) => {
    if (!kind) {
        return BlankSchema;
    }

    return BlankSchema;
};

export const getArtifactUiSpec = (kind: string | undefined) => {
    if (!kind) {
        return undefined;
    }
    return undefined;
};
