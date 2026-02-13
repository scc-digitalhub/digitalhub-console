// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { isEmpty, regex } from 'react-admin';
import memoize from 'lodash/memoize';
import { B } from '@wtfcode/byte-converter';
import { round } from 'lodash';
import { toYaml } from '@dslab/ra-export-record-button';

export const UUID_REGEX = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;
export const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9._+-]+$/;

export const FUNCTION_OR_WORKFLOW = 'functionOrWorkflow';

export const alphaNumericName = (s: string) => {
    return ALPHANUMERIC_REGEX.test(s);
};

export const arePropsEqual = (oldProps: any, newProps: any) => {
    if (!newProps.record) return true;
    return Object.is(oldProps.record, newProps.record);
};

export const isAlphaNumeric = memoize(() =>
    regex(ALPHANUMERIC_REGEX, 'messages.validation.wrongChar')
);

export const isValidKind = (kinds: any[]) => (value, values?) => {
    return !isEmpty(value) && !kinds.find(k => k.id === value)
        ? 'messages.validation.invalidKind'
        : undefined;
};

/**
 * Removes undefined values from the given object
 */
export const sanitizeObj = value => {
    return Object.keys(value)
        .filter(key => value[key] !== undefined)
        .reduce((obj, key) => {
            const v = value[key];
            if (typeof v === 'object' && !Array.isArray(v) && v !== null) {
                obj[key] = sanitizeObj(v);
            } else {
                obj[key] = v;
            }
            return obj;
        }, {});
};

/**
 * Generates a ~random id from (time + rand)
 */
export const randomId = () => {
    let p3 = Date.now().toString(36);
    let p2 = Math.random().toString(16).substring(2, 7);
    let p1 = Math.random().toString(36).substring(2);
    return p1 + p2 + p3;
};

/**
 * Autoscales the given byte number and returns the converted number, rounded to the given
 * precision, formatted as "\<number\> \<unit\>" using binary units (1024 byte logic)
 * Units: B, KiB, MiB, GiB, TiB, PiB, EiB, ZiB, YiB
 */
export const scaleBytes = (bytes: number, precision: number = 1) => {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${round(bytes / Math.pow(k, i), precision)} ${sizes[i]}`;
};

export const formatDuration = (
    ms: number
): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    asString: string;
} => {
    if (!Number.isFinite(ms) || ms <= 0)
        return { days: 0, hours: 0, minutes: 0, seconds: 0, asString: '0s' };
    let s = Math.floor(ms / 1000);

    const days = Math.floor(s / 86400);
    s = s % 86400;

    const hours = Math.floor(s / 3600);
    s = s % 3600;

    const minutes = Math.floor(s / 60);
    const seconds = s % 60;

    const asString =
        days > 0
            ? `${days}d ${hours}h ${minutes}m ${seconds}s`
            : hours > 0
            ? `${hours}h ${minutes}m ${seconds}s`
            : minutes > 0
            ? `${minutes}m ${seconds}s`
            : `${seconds}s`;

    return { days, hours, minutes, seconds, asString };
};

/**
 * Calculates the number of lines of the given record spec converted to string
 */
export const countLines = recordSpec => {
    const specString =
        recordSpec == null
            ? ''
            : typeof recordSpec === 'string'
            ? recordSpec
            : toYaml(recordSpec) ?? '';

    const rawLines = specString.split(/\r\n|\r|\n/);
    const lineCount = specString.length === 0 ? 0 : rawLines.length;
    const maxLines = Math.max(lineCount, 25);

    return [lineCount, maxLines];
};

/**
 * Formats the given value as a string, e.g. "1d 12h 30m"
 * @param value in seconds
 */
export const formatTimeTick = (value: number) => {
    if (value < 60) {
        return `${value}s`;
    } else if (value < 3600) {
        const minutes = Math.floor(value / 60);
        const seconds = Math.floor(value % 60);
        return `${minutes}m ${seconds > 0 ? `${seconds}s` : ''}`;
    } else if (value < 86400) {
        const hours = Math.floor(value / 3600);
        const minutes = Math.floor((value % 3600) / 60);
        return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
    } else {
        const days = Math.floor(value / 86400);
        const hours = Math.floor((value % 86400) / 3600);
        const minutes = Math.floor((value % 3600) / 60);
        return `${days}d ${hours > 0 ? `${hours}h` : ''} ${
            minutes > 0 ? `${minutes}m` : ''
        }`;
    }
};
