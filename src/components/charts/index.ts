import { AccuracyChart } from './AccuracyChart';
import { LossChart } from './LossChart';

export * from './utils';

export const chartMap = {
    accuracy: AccuracyChart,
    loss: LossChart,
    val_accuracy: AccuracyChart,
    val_loss: LossChart,
};
