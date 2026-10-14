// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Body, Meta, UppyFile } from '@uppy/utils/lib/UppyFile';
import { FileSelection } from './types';

export const MiB = 0x10_00_00;

export const sizeThreshold = 100;

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

export function toFileSelection(
    files: UppyFile<Meta, Body>[]
): FileSelection {
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
