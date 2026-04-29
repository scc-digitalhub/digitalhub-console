import { useRootSelector } from '@dslab/ra-root-selector';
import { useCallback } from 'react';
import { useDataProvider } from 'react-admin';

export const useStopRun = () => {
    const { root: projectId } = useRootSelector();
    const dataProvider = useDataProvider();

    return useCallback(
        (id: string) => {
            const url = '/-/' + projectId + '/runs/' + id + '/stop';
            return dataProvider.invoke({
                path: url,
                options: { method: 'POST' },
            });
        },
        [projectId, dataProvider]
    );
};
