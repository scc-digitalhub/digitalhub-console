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
    alpha,
    styled,
    useTheme,
} from '@mui/material';
import { enUS, itIT } from '@mui/x-data-grid';
import { LoadingIndicator, useLocaleState, useTranslate } from 'react-admin';
import { LossChart } from './charts/LossChart';
import { AccuracyChart } from './charts/AccuracyChart';
import { SingleValueChart } from './charts/SingleValueChart';
import { MetricNotSupported } from './charts/MetricNotSupported';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { Fragment, useCallback, useState } from 'react';
import { maxWidth } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';

export type Metric = {
    name: string;
    version: string;
    values: any;
};
export type Series = {
    data: any;
    label: string;
};
export const MetricsTabComponent = (props: { record: any }) => {
    const { record } = props;
    const translate = useTranslate();
    const [locale] = useLocaleState();
    const localeText =
        locale && locale === 'it'
            ? itIT.components.MuiDataGrid.defaultProps.localeText
            : enUS.components.MuiDataGrid.defaultProps.localeText;
    const tmpMetrics = {
        Loss: 45,
        Accuracy: Array.from({ length: 10 }, () => Math.random()),
        Precision: Array.from({ length: 10 }, () => Math.random()),
        Recall: Array.from({ length: 10 }, () => Math.random()),
        CPU: 0.32,
        RAM: 200,
    };
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
                                    version: record.id,
                                    values: value,
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
    if (metric === 'Loss') return <LossChart {...props} />;
    if (metric === 'Accuracy') return <AccuracyChart {...props} />;
    return <MetricNotSupported />; // metric not supported
};
const MetricCard = (props: { metric: Metric }) => {
    const { metric } = props;
    const chart =
        typeof metric.values === 'number' ? (
            <SingleValueChart
                values={[{ data: metric.values, label: metric.version }]}
            />
        ) : (
            getChartByMetric(metric.name, {
                series: [{ data: metric.values, label: metric.version }],
            })
        );
    return (
        <Card>
            <CardHeader title={metric.name} action={<FullScreenButton title={metric.name}  >{chart}</FullScreenButton>} />
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
