// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { LineChart, LineChartProps } from '@mui/x-charts';
import { Series } from './utils';

export const LossChart = (props: LossChartProps) => {
    const {
        series,
        slotProps,
        margin = {
            left: 56,
            right: 8,
            top: 8,
            bottom: 24,
        },
        ...rest
    } = props;

    const arraySeries = series.map(s =>
        typeof s.data === 'number' ? { ...s, data: [s.data] } : s
    );

    return (
        <LineChart
            series={arraySeries}
            hideLegend
            slotProps={slotProps}
            margin={margin}
            {...rest}
        />
    );
};

export type LossChartProps = Omit<LineChartProps, 'series'> & {
    series: Series[];
};
