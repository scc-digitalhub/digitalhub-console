import { useRootSelector } from "@dslab/ra-root-selector";
import { useRef, useState } from "react";
import { useDataProvider, useResourceContext } from "react-admin";
import { AwsS3, Uppy } from "uppy";

export const useUploadController = (props?: any): UploadControllerResult => {
    const dataProvider = useDataProvider();
    const {root} = useRootSelector();
    const { id } = props;
    const [path, setPath] = useState<string | null>(null);
    const uppyConfig =  { restrictions: { maxNumberOfFiles: 1 } };
    const uploadUrl = useRef('');
    const resource = useResourceContext();
    const [uppy] = useState(() =>
        new Uppy(uppyConfig).use(AwsS3, {
            id: 'AwsS3',
            shouldUseMultipart: false,
            getUploadParameters: async file => {
                return {
                    method: 'PUT',
                    url: uploadUrl.current,
                    fields: {},
                    headers: file.type ? { 'Content-Type': file.type } : undefined,
                }
            },
        })
    );
    if (uppy) {
        uppy.on('file-added', async file => {
            if (dataProvider) {
                const res = await dataProvider.upload(resource, {
                    id: id,
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
    return {
        uppy,
        path
    };
};

type UploadControllerResult = {
    uppy: Uppy;
    path: string | null;
};
//devo mettere nel controller tutta la configurazione di uppy. Puo' prendere come input
//parametri come il record dell'id. 
//ritorno uppy e path che ora e' in file info , 