// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    LineChart as MuiLineChart,
    LineChartProps as MuiLineChartProps,
} from '@mui/x-charts';
import { chartPalette, Series, valueFormatter } from '../../utils';
import { useTheme } from '@mui/material';

export const LineChart = (props: LineChartProps) => {
    const {
        series,
        reverseSeries = false,
        margin = {
            left: 16,
            right: 8,
            top: 8,
            bottom: 16,
        },
        ...rest
    } = props;
    const theme = useTheme();

    //do not display series with no data
    const arraySeries = series
        .filter(s => s.data !== null)
        .map((s, i) => {
            let muiSeries = {
                ...s,
                valueFormatter,
                color: chartPalette(theme.palette.mode)[i],
            };
            if (!Array.isArray(muiSeries.data))
                muiSeries.data = [muiSeries.data];
            return muiSeries;
        });

    return (
        <MuiLineChart
            series={reverseSeries ? arraySeries.reverse() : arraySeries}
            hideLegend
            margin={margin}
            {...rest}
        />
    );
};

export type LineChartProps = Omit<MuiLineChartProps, 'series'> & {
    series: Series[];
    reverseSeries: boolean;
};
