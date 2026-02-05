// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

export const keyParser = (
    key: string
): {
    project: string | undefined;
    resource: string | undefined;
    kind: string | undefined;
    name: string | undefined;
    id: string | undefined;
} => {
    const result = {
        project: undefined as string | undefined,
        resource: undefined as string | undefined,
        kind: undefined as string | undefined,
        name: undefined as string | undefined,
        id: undefined as string | undefined,
    };

    if (key?.startsWith('store://')) {
        //store key is a URI
        const url = new URL('http://' + key.substring('store://'.length));

        //project is hostname
        result.project = url.hostname;

        //details are in path variables
        const vars = url.pathname.substring(1).split('/');

        if (vars.length == 3) {
            result.resource = vars[0] + 's';
            result.kind = vars[1];

            const np = vars[2].split(':');
            result.name = np[0];
            result.id = np.length == 2 ? np[1] : undefined;
        }
    }

    return result;
};

export const functionParser = (
    key: string
): {
    project: string | undefined;
    kind: string | undefined;
    name: string | undefined;
    id: string | undefined;
} => {
    // python+run://prj2/f4a21377-fb59-41fe-a16e-157ee5598f28
    const rgx =
        /([a-zA-Z+\-_0-9]+):\/\/([a-zA-Z\-_0-9]+)\/([a-zA-Z\-_0-9]+):([a-zA-Z\-_0-9]+)/;
    const result = {
        project: undefined as string | undefined,
        kind: undefined as string | undefined,
        name: undefined as string | undefined,
        id: undefined as string | undefined,
    };

    if (key) {
        const pp = key.match(rgx);

        result.kind = pp && pp[1] ? pp[1] : undefined;
        result.project = pp && pp[2] ? pp[2] : undefined;
        result.name = pp && pp[3] ? pp[3] : undefined;
        result.id = pp && pp[4] ? pp[4] : undefined;
    }

    return result;
};

export const taskParser = (
    key: string
): {
    project: string | undefined;
    kind: string | undefined;
    id: string | undefined;
} => {
    // python+run://prj2/f4a21377-fb59-41fe-a16e-157ee5598f28
    const rgx =
        /([a-zA-Z+\-_0-9]+):\/\/([a-zA-Z\-_0-9]+)\/([a-zA-Z\-_0-9]+)/;
    const result = {
        project: undefined as string | undefined,
        kind: undefined as string | undefined,
        id: undefined as string | undefined,
    };

    if (key) {
        const pp = key.match(rgx);

        result.kind = pp && pp[1] ? pp[1] : undefined;
        result.project = pp && pp[2] ? pp[2] : undefined;
        result.id = pp && pp[3] ? pp[3] : undefined;
    }

    return result;
};
