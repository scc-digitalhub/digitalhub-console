// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { LineChart as MuiLineChart, LineChartProps } from '@mui/x-charts';
import { chartPalette, Series, valueFormatter } from '../utils';

export const LineChart = (props: AccuracyChartProps) => {
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

    //do not display series with no data
    const arraySeries = series.filter(s => s.data !== null).map(s =>
        !Array.isArray(s.data)
            ? { ...s, data: [s.data], valueFormatter }
            : { ...s, valueFormatter }
    );

    return (
        <MuiLineChart
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
