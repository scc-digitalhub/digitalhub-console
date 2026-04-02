import { CPUResource, MemoryResource } from '@kotaicode/k8s-resources';
import { prettyBytes } from '../files/fileBrowser/utils';

export const formatMetricsValue = (name: string, value: any) => {
    let raw;
    if (value?.number && value?.format) {
        raw = value.number;
    }

    if (raw === undefined || raw === null || Number.isNaN(raw)) {
        return '-';
    }
    if (name.toLowerCase().includes('cpu')) {
        //metrics for cpu are nanocores, but we want to display millicores
        raw = Math.floor(raw * 1000);
        raw = CPUResource.fromMillicores(raw).valueOf();
        return raw > 1000 ? `${(raw / 1000).toFixed(1)}` : `${raw}m`;
    } else if (name.toLowerCase().includes('memory')) {
        //metrics for memory are in bytes, but we want to display them in a human readable format
        raw = Math.floor(raw);
        raw = MemoryResource.fromBytes(raw).valueOf();
        return prettyBytes(raw, 1);
    } else if (name.toLowerCase().includes('disk')) {
        //metrics for disk are in bytes, but we want to display them in a human readable format
        raw = Math.floor(raw);
        raw = MemoryResource.fromBytes(raw).valueOf();
        return prettyBytes(raw, 2);
    }

    return raw;
};
