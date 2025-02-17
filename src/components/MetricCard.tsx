import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    styled,
} from '@mui/material';
import { useTranslate } from 'react-admin';
import { SingleValue } from './charts/SingleValue';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseIcon from '@mui/icons-material/Close';
import { ComparisonTable } from './charts/ComparisonTable';
import React, { useCallback, useState } from 'react';
import { AccuracyChart } from './charts/AccuracyChart';
import { Metric } from './charts';

const getChartByMetric = (metric: string, props: any) => {
    // const lowerCaseMetric = metric.toLowerCase();
    // if (chartMap[lowerCaseMetric])
    //     return React.createElement(chartMap[lowerCaseMetric], props);
    // return <MetricNotSupported />;
    return <AccuracyChart {...props} />;
};

export const MetricCard = (props: { metric: Metric; comparison: boolean }) => {
    const { metric, comparison } = props;
    const useChart = metric.series.some(s => Array.isArray(s.data));

    const chart = useChart ? (
        getChartByMetric(metric.name, { series: metric.series })
    ) : comparison ? (
        <ComparisonTable values={metric.series} />
    ) : (
        <SingleValue values={metric.series[0]} />
    );

    return (
        <Card>
            <CardHeader
                title={metric.name}
                action={
                    <FullScreenButton title={metric.name}>
                        {chart}
                    </FullScreenButton>
                }
            />
            <CardContent sx={{ paddingTop: 0 }}>
                <Box sx={{ height: '180px', overflowY: 'auto' }}>{chart}</Box>
            </CardContent>
        </Card>
    );
};

const FullScreenButton = (props: {
    title: string;
    children: React.ReactNode;
}) => {
    const { title: label, children } = props;
    const [open, setOpen] = useState(false);
    const translate = useTranslate();

    const handleDialogOpen = e => {
        setOpen(true);
        e.stopPropagation();
    };

    const handleDialogClose = e => {
        setOpen(false);
        e.stopPropagation();
    };

    const handleClick = useCallback(e => {
        e.stopPropagation();
    }, []);

    return (
        <>
            <IconButton aria-label="fullscreen" onClick={handleDialogOpen}>
                <OpenInFullIcon />
            </IconButton>
            <FullScreenDialog
                open={open}
                fullScreen
                onClose={handleDialogClose}
                onClick={handleClick}
                aria-labelledby="inspect-dialog-title"
            >
                <div className={FullScreenDialogButtonClasses.header}>
                    <DialogTitle
                        id="inspect-dialog-title"
                        className={FullScreenDialogButtonClasses.title}
                    >
                        {translate(label)}
                    </DialogTitle>
                    <IconButton
                        aria-label={translate('ra.action.close')}
                        title={translate('ra.action.close')}
                        onClick={handleDialogClose}
                        size="small"
                        className={FullScreenDialogButtonClasses.closeButton}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </div>

                <DialogContent>{children}</DialogContent>
            </FullScreenDialog>
        </>
    );
};

const PREFIX = 'RaFullScreenDialogButton';

export const FullScreenDialogButtonClasses = {
    button: `${PREFIX}-button`,
    dialog: `${PREFIX}-dialog`,
    header: `${PREFIX}-header`,
    title: `${PREFIX}-title`,
    closeButton: `${PREFIX}-close-button`,
};

const FullScreenDialog = styled(Dialog, {
    name: PREFIX,
    overridesResolver: (_props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${FullScreenDialogButtonClasses.title}`]: {
        padding: theme.spacing(0),
    },
    [`& .${FullScreenDialogButtonClasses.header}`]: {
        padding: theme.spacing(2, 2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    [`& .${FullScreenDialogButtonClasses.closeButton}`]: {
        height: 'fit-content',
    },
}));
