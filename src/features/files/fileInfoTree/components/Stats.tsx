// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useTranslate } from 'react-admin';
import { FileInfo } from '../../info/types';
import { scaleBytes } from '../../../../common/utils/helpers';

const getStats = (
    data: FileInfo[]
): { count: number; size: number; approx: boolean } => {
    return {
        count: data.length,
        size: data.reduce((acc, curr) => acc + (curr.size || 0), 0),
        approx: data.some(f => !f.size),
    };
};

export const Stats = ({ data }: { data: FileInfo[] }) => {
    const translate = useTranslate();
    const [stats, setStats] = useState<any>();

    useEffect(() => {
        setStats(getStats(data));
    }, [data]);

    if (!stats) return <></>;

    return (
        <>
            <Typography>
                {translate('pages.filetab.count', {
                    count: stats.count,
                })}
            </Typography>
            <Typography gutterBottom>
                {translate('pages.filetab.size', {
                    size: scaleBytes(stats.size, 2),
                    smart_count: stats.approx ? 2 : 1,
                })}
            </Typography>
        </>
    );
};
