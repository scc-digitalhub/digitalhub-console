// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { CPUResource, MemoryResource } from '@kotaicode/k8s-resources';
import { prettyBytes } from '../files/fileBrowser/utils';

export const formatMetricsValue = (name: string, value: any) => {
    let raw: number | undefined;
    let format;
    if (typeof value === 'number') {
        raw = value;
    } else if (value?.number !== undefined && value?.format) {
        raw = value.number;
        format = value.format;
    }
    console.log('formatMetricsValue', name, value, raw, format);

    if (raw === undefined || raw === null || Number.isNaN(raw)) {
        return '-';
    }
    if (name.toLowerCase().includes('cpu')) {
        //default to nanocores if no format is provided
        format ??= 'n';

        if (format == 'n') {
            //metrics for cpu are nanocores, but we want to display millicores
            raw = Math.floor(raw * 1000);
            raw = CPUResource.fromMillicores(raw).valueOf();
            return raw > 1000 ? `${(raw / 1000).toFixed(1)}` : `${raw}m`;
        }

        if (format == 'm') {
            //millicores, we want to display millicores
            raw = Math.floor(raw);
            raw = CPUResource.fromMillicores(raw).valueOf();
            return raw > 1000 ? `${(raw / 1000).toFixed(1)}` : `${raw}m`;
        }
        if (format == 'seconds') {
            //seconds == cores, we display as is
            return `${raw}`;
        }
    } else if (name.toLowerCase().includes('memory')) {
        //default to bytes if no format is provided
        format ??= 'bytes';

        if (format == 'bytes') {
            //metrics for memory are in bytes, but we want to display them in a human readable format
            raw = Math.floor(raw);
            raw = MemoryResource.fromBytes(raw).valueOf();
            return prettyBytes(raw, 1);
        }
    } else if (name.toLowerCase().includes('disk')) {
        //default to bytes if no format is provided
        format ??= 'bytes';
        if (format == 'bytes') {
            //metrics for disk are in bytes, but we want to display them in a human readable format
            raw = Math.floor(raw);
            raw = MemoryResource.fromBytes(raw).valueOf();
            return prettyBytes(raw, 2);
        }
    }

    //fallback as is for unknown
    return `${Math.floor(raw)}`;
};
