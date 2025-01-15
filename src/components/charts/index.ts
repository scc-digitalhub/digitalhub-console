import { AccuracyChart } from "./AccuracyChart";
import { LossChart } from "./LossChart";
import { SingleValue } from "./SingleValue";

export const ChartMap = {
    test_metric: SingleValue,
    accuracy: AccuracyChart,
    loss: LossChart,
    val_accuracy: AccuracyChart,
    val_loss: LossChart,
}
export const PropMap = {
    test_metric: {},
    accuracy: {},
    loss: {},
    val_accuracy: {},
    val_loss: {},
}