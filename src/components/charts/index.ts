import { AccuracyChart } from './AccuracyChart';
import { LossChart } from './LossChart';
import { SingleValue } from './SingleValue';

export const chartMap = {
    test_metric: SingleValue,
    accuracy: AccuracyChart,
    loss: LossChart,
    val_accuracy: AccuracyChart,
    val_loss: LossChart,
};

export const propMap = {
    test_metric: {},
    accuracy: {},
    loss: {},
    val_accuracy: {},
    val_loss: {},
};
