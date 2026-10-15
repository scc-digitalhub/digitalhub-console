// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Body, Meta, UppyFile } from '@uppy/utils/lib/UppyFile';
import { regex } from 'react-admin';
import { FileSelection } from './types';

export const MiB = 0x10_00_00;

export const sizeThreshold = 100;

export const createPathValidator = (schema: { pattern?: string }) =>
    schema.pattern
        ? regex(new RegExp(schema.pattern), () => ({
              message: 'ra.validation.regex',
              args: { pattern: schema.pattern },
          }))
        : undefined;

export function numberOfParts(file: UppyFile<Meta, Body>): number {
    if (file.size === null) return -1;
    if (file.size <= sizeThreshold * MiB) return 1;
    else {
        return Math.ceil(file.size / (sizeThreshold * MiB));
    }
}

export function relativePath(file: UppyFile<Meta, Body>): string {
    return (file.meta?.relativePath as string | undefined) ?? file.name ?? '';
}

export function basename(path: string): string {
    return path.replace(/^.*[\\/]/, '');
}

export function nameFromFileSelection(
    selection: FileSelection
): string | undefined {
    if (!selection?.files.length) return undefined;

    const firstFile = selection.files[0];
    const parentPaths = selection.files.map(file =>
        (file.relativePath || file.filename)
            .replace(/\\/g, '/')
            .split('/')
            .filter(segment => segment && segment !== '.')
            .slice(0, -1)
    );
    const firstParentPath = parentPaths[0];
    let commonLength = firstParentPath.length;

    for (const parentPath of parentPaths.slice(1)) {
        commonLength = Math.min(commonLength, parentPath.length);
        let index = 0;
        while (
            index < commonLength &&
            firstParentPath[index] === parentPath[index]
        ) {
            index++;
        }
        commonLength = index;
    }

    return commonLength > 0
        ? firstParentPath[commonLength - 1]
        : basename(firstFile.filename);
}

export function toFileSelection(files: UppyFile<Meta, Body>[]): FileSelection {
    if (files.length === 0) return null;
    return {
        files: files.map(file => ({
            id: file.id,
            filename: file.name ?? '',
            relativePath: relativePath(file),
            size: file.size,
            contentType: file.type ?? '',
        })),
    };
}

export function extractInfo(file: UppyFile<Meta, Body>): any {
    return {
        path: file.meta?.relativePath ?? file.name,
        name: file.name,
        content_type: file.type,
        last_modified: new Date(file.data?.lastModified).toUTCString(),
        size: file.size,
    };
}
