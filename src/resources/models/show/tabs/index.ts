import { HuggingfaceModelCard } from './modelcard';
import { HuggingfaceModel, HuggingfaceConfigJson } from './huggingface';
import { ConsoleTabContribution } from '../../../../features/extensions/ConsoleExtension';
import { MlflowParams } from './mlflow';
import { MetricsTab } from './metrics';

export const tabs: Record<string, ConsoleTabContribution[]> = {
    metrics: [
        {
            key: 'metrics',
            Element: MetricsTab,
            label: 'fields.metrics.title',
            isVisible: (record?: any) => !!record?.status?.metrics,
        },
    ],
    huggingface: [
        {
            key: 'modelcard',
            Element: HuggingfaceModelCard,
            label: 'fields.huggingface.modelcard.title',
        },
        {
            key: 'huggingface',
            Element: HuggingfaceModel,
            label: 'fields.huggingface.title',
            isVisible: (record?: any) => !!record?.status?.huggingface,
        },
        {
            key: 'config',
            Element: HuggingfaceConfigJson,
            label: 'fields.config.title',
            isVisible: (record?: any) => !!record?.status?.huggingface?.config,
        },
    ],
    mlflow: [
        {
            key: 'params',
            Element: MlflowParams,
            label: 'fields.parameters.title',
            isVisible: (record?: any) =>
                !!record?.spec?.parameters &&
                Object.keys(record?.spec?.parameters).length > 0,
        },
    ],
};
