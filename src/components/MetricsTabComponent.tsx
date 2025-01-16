import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Typography,
    styled,
} from '@mui/material';
import { useTranslate } from 'react-admin';
import { SingleValue } from './charts/SingleValue';
import { MetricNotSupported } from './charts/MetricNotSupported';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseIcon from '@mui/icons-material/Close';
import { chartMap } from './charts';
import { ComparisonTable } from './charts/ComparisonTable';
import React, { useCallback, useState } from 'react';

const tmpMetrics = {
    test_metric: 1,
    accuracy: [
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
    ],
    loss: [
        4.276995241525583e-5, 4.086726039531641e-5, 3.9092170482035726e-5,
        3.740461033885367e-5, 3.582672434276901e-5, 3.433741949265823e-5,
        3.293671034043655e-5, 3.160770938848145e-5, 3.0351478926604614e-5,
        2.9160639314795844e-5, 2.80457352346275e-5, 2.6982508643413894e-5,
        2.5982562874560244e-5, 2.503640644135885e-5, 2.4141932954080403e-5,
        2.3285425413632765e-5, 2.2473217541119084e-5, 2.1703201127820648e-5,
        2.0981698980904184e-5, 2.0287623556214385e-5,
    ],
    val_accuracy: [
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
    ],
    val_loss: [
        1.0851749721041415e-5, 1.0313289749319665e-5, 9.832376235863194e-6,
        9.363789104099851e-6, 8.948638424044475e-6, 8.533485924999695e-6,
        8.138883458741475e-6, 7.777164682920557e-6, 7.448328688042238e-6,
        7.135934538382571e-6, 6.831759947090177e-6, 6.544026291521732e-6,
        6.285066319833277e-6, 6.017883606546093e-6, 5.779475486633601e-6,
        5.553397841140395e-6, 5.339651579561178e-6, 5.14234670845326e-6,
        4.957373221259331e-6, 4.776510650117416e-6,
    ],
    ciccio: [10],
};

// a set of values related to a specific metric, ex: {label:'v1',data:1},{label:'v2',data:[1,2,3]}
export type Series = {
    data: any;
    label: string;
};

// all sets of values related to a specific metric, ex: {name:'accuracy',series:[{label:'v1',data:1},{label:'v2',data:[1,2,3]}]}
export type Metric = {
    name: string;
    series: Series[];
};

export const MetricsTabComponent = (props: { record: any }) => {
    //TODO lettura da API se non ci sono metriche in record
    //TODO scelta runs per comparazione
    const { record } = props;
    const translate = useTranslate();

    return (
        <Box
            sx={{
                width: '100%',
            }}
        >
            <Typography variant="h6" gutterBottom>
                {translate('resources.models.metrics.title')}
            </Typography>

            {tmpMetrics && (
                <Grid container spacing={2} sx={{ paddingY: '16px' }}>
                    {Object.entries(tmpMetrics).map(([key, value], index) => (
                        <Grid item xs={12} md={4} key={'metric_' + index}>
                            <MetricCard
                                metric={{
                                    name: key,
                                    series: [
                                        { data: value, label: record.id },
                                        { data: value, label: 'v2' },
                                    ],
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

const getChartByMetric = (metric: string, props: any) => {
    //TODO ignore case of metrics
    if (chartMap[metric]) return React.createElement(chartMap[metric], props);
    return <MetricNotSupported />;
};

const MetricCard = (props: { metric: Metric }) => {
    const { metric } = props;
    const chart =
        metric.series.length === 1 &&
        typeof metric.series[0].data === 'number' ? (
            <SingleValue values={metric.series[0]} />
        ) : metric.series.length > 1 &&
          metric.series.every(item => typeof item.data === 'number') ? (
            <ComparisonTable values={metric.series} />
        ) : (
            getChartByMetric(metric.name, {
                series: metric.series,
            })
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
                <Typography
                    variant="body2"
                    sx={{ height: '120px', overflowY: 'auto' }}
                >
                    {chart}
                </Typography>
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
