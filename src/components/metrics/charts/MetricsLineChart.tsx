// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { LineChart, LineChartProps } from '@mui/x-charts';
import { chartPalette, Series, valueFormatter } from '../utils';

export const MetricsLineChart = (props: AccuracyChartProps) => {
    const {
        series,
        slotProps,
        margin = {
            left: 48,
            right: 8,
            top: 8,
            bottom: 24,
        },
        ...rest
    } = props;

    const arraySeries = series.map(s =>
        !Array.isArray(s.data)
            ? { ...s, data: [s.data], valueFormatter }
            : { ...s, valueFormatter }
    );

    return (
        <LineChart
            series={arraySeries}
            hideLegend
            slotProps={slotProps}
            margin={margin}
            colors={chartPalette}
            {...rest}
        />
    );
};

export type AccuracyChartProps = Omit<LineChartProps, 'series'> & {
    series: Series[];
};
