import { AccuracyChart } from './AccuracyChart';
import { LossChart } from './LossChart';

export const chartMap = {
    accuracy: AccuracyChart,
    loss: LossChart,
    val_accuracy: AccuracyChart,
    val_loss: LossChart,
};

export const propMap = {
    accuracy: {},
    loss: {},
    val_accuracy: {},
    val_loss: {},
};
