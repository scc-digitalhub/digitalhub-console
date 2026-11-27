// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

/**
 * In function forms `spec.path` is edited as a separate top-level field
 * (`path`), because it is rendered by StorePathInput outside the JSON-schema
 * spec form (see FunctionSpecFields).
 *
 * Before saving, move it back into `spec.path`:
 * - `path` undefined → field not rendered for this kind: spec left untouched
 * - `path` empty → path removed from spec
 * - otherwise → spec.path set to the given value
 */
export const movePathIntoSpec = (data: any) => {
    const { path, ...rest } = data;

    if (path === undefined) {
        return rest;
    }

    return {
        ...rest,
        spec: { ...rest.spec, path: path || undefined },
    };
};
