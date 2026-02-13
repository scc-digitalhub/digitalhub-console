// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Formats bytes to human-readable format using binary units (1024 byte logic)
 * Units: B, KiB, MiB, GiB, TiB, PiB, EiB, ZiB, YiB
 */
export function prettyBytes(bytes, decimals = 2) {
    if (bytes == 0) {
        return '0 Bytes';
    }

    const k = 1024;
    const dm = decimals || 2;
    const sizes = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
