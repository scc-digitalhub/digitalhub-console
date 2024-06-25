import {
    useDataProvider,
    useRecordContext,
    useResourceContext,
} from 'react-admin';
import { useRootSelector } from '@dslab/ra-root-selector';
import { useEffect, useRef, useState } from 'react';
import { Dashboard } from '@uppy/react';

export const FileInput = (props: FileInputProps) => {
    const { uppy, updateFormFn } = props;
    const dataProvider = useDataProvider();
    const record = useRecordContext();
    const { root } = useRootSelector();
    const resource = useResourceContext();
    const [path, setPath] = useState<string | null>(null);
    const uploadUrl = useRef('');
    useEffect(() => {
        updateFormFn(path);
    }, [path]);
    uppy.getPlugin('AwsS3').setOptions({
        getUploadParameters: async file => {
            return {
                method: 'PUT',
                url: uploadUrl.current,
                fields: {},
                headers: file.type ? { 'Content-Type': file.type } : undefined,
            };
        },
    });
    if (uppy) {
        uppy.on('file-added', async file => {
            if (dataProvider) {
                const res = await dataProvider.upload(resource, {
                    id: record.id,
                    meta: { root },
                    filename: file.name,
                });
                setPath(res.path);
                uploadUrl.current = res.url;
            }
        });

        uppy.on('file-removed', (file, reason) => {
            setPath(null);
            uploadUrl.current = '';
        });
    }
    return (
        <Dashboard
            uppy={uppy}
            hideUploadButton
            proudlyDisplayPoweredByUppy={false}
        />
    );
};

type FileInputProps = {
    uppy: any;
    updateFormFn: (field) => void;
};
