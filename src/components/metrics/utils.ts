// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Identifier, RaRecord } from 'react-admin';
import {
    ChartsColorPaletteCallback,
    blueberryTwilightPaletteLight,
    blueberryTwilightPaletteDark,
    mangoFusionPaletteLight,
    mangoFusionPaletteDark,
    cheerfulFiestaPaletteLight,
    cheerfulFiestaPaletteDark,
} from '@mui/x-charts';
import { union, round } from 'lodash';

export const chartPalette: ChartsColorPaletteCallback = mode => {
    if (mode == 'light') {
        return union(
            blueberryTwilightPaletteLight,
            mangoFusionPaletteLight,
            cheerfulFiestaPaletteLight
        );
    } else {
        return union(
            blueberryTwilightPaletteDark,
            mangoFusionPaletteDark,
            cheerfulFiestaPaletteDark
        );
    }
};

export const valueFormatter = v => {
    return v ? round(v, 3) : v;
};

/**
 * A set of values related to a specific metric, ex: {label:'v1',data:1},{label:'v2',data:[1,2,3]}
 */
export type Series = {
    data: any;
    label: string;
};

/**
 * All sets of values related to a specific metric, ex: {name:'accuracy',series:[{label:'v1',data:1},{label:'v2',data:[1,2,3]}]}
 */
export type Metric = {
    name: string;
    series: Series[];
};

/**
 * Format the labels of the given series according to the resource type.
 * Run labels are formatted as: "<run.name> [run.metadata.created]".
 *
 * @param series
 * @param records
 * @param resource
 * @returns
 */
export const formatLabels = (
    series: Series[],
    records: RaRecord<Identifier>[],
    resource: string
): Series[] => {
    return series.map(s => {
        const record = records.find(r => r.id === s.label);
        return {
            ...s,
            label: record ? formatLabel(record, resource) : s.label,
        };
    });
};

export const formatLabel = (
    record: RaRecord<Identifier>,
    resource: string
): string => {
    if (resource === 'runs') {
        return `${record.name} [${new Date(
            record.metadata.created
        ).toLocaleString()}]`;
    }

    if (resource === 'models') {
        return `${record.name} [${new Date(
            record.metadata.created
        ).toLocaleString()}]`;
    }

    return '' + record.id;
};

/**
 * Revert input to get an object with metrics and corresponding series.
 *
 * @param input An object structured as {'recordId': {'metric1': any | any[], 'metric2': any | any[]}}
 * @returns
 */
export const mergeData = (input: any) => {
    let merged: { [s: string]: any[] } = {};
    let ids: string[] = [];
    Object.entries(input).forEach(([id, metricsSet]: [string, any]) => {
        ids.push(id);
        Object.entries(metricsSet).forEach(([metricName, val]) => {
            if (metricName in merged) {
                merged[metricName].push({
                    label: id,
                    data: val,
                });
            } else {
                merged[metricName] = [{ label: id, data: val }];
            }
        });
    });
    //add missing values as null to always display every series
    Object.values(merged).forEach((series: any[]) => {
        ids.forEach(id => {
            if (!series.some(s => s.label == id)) {
                series.push({ label: id, data: null });
            }
        });
    });

    return merged;
};
