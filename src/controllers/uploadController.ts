import { useRootSelector } from "@dslab/ra-root-selector";
import { useRef, useState } from "react";
import { useDataProvider, useNotify, useResourceContext, useTranslate } from "react-admin";
import { AwsS3, Uppy } from "uppy";

export const useUploadController = (props?: any): UploadControllerResult => {
    const dataProvider = useDataProvider();
    const { root } = useRootSelector();
    const { id } = props;
    const [path, setPath] = useState<string | null>(null);
    const uppyConfig = { restrictions: { maxNumberOfFiles: 1 } };
    const uploadUrl = useRef('');
    const resource = useResourceContext();
    const [files, setFiles] = useState<any[]>([]);
    const notify = useNotify();
    const translate = useTranslate();
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
                let info = {
                    id: file.id,
                    info: extractInfo(file,res.path),
                    file: file,
                    path: res.path,

                }
                setFiles((prev) => {
                    let p = prev.find(f => f.id === file.id);
                    if (p) {
                        p = info;
                    } else {
                        prev.push(info);
                    }
                    return prev;
                })
            }
        });

        uppy.on('file-removed', (file, reason) => {
            setPath(null);
            uploadUrl.current = '';
            if (file) {
                setFiles((prev) => {
                    let p = prev.slice(prev.findIndex(f => f.id === file.id),1);
                    if (p) {
                        p['file'] = file;
                    } 
                    return prev;
                })
            }
        });
        uppy.on('upload-progress', (file, progress) => {
            if (file) {
                setFiles((prev) => {
                    let p = prev.find(f => f.id === file.id);
                    if (p) {
                        p['file'] = file;
                    } 
                    return prev;
                })
            }
        });
        uppy.on('upload-success', (file, response) => {
            if (file) {
                setFiles((prev) => {
                    let p = prev.find(f => f.id === file.id);
                    if (p) {
                        p['file'] = file;
                    } 
                    return prev;
                })
            }
        })
        uppy.on('upload-error', (file, error, response) => {
            //using default informer of dashboard. More powerfull and automatic. It must be styled and i18n
            // notify(translate('upload_error',{
            //     fileName:file?.name,
            //     error: error.message
            // }), {
            //     type: 'error',
            // });
        });

    }
    return {
        uppy,
        files,
        upload: () => uppy?.upload(),
    };
};

function extractInfo(file: any, path: string): any {
    return {
        path:path,
        name: file.name,
        content_type: file.type,
        last_modified:new Date(file.data?.lastModified).toUTCString(),
        size: file.size,
    }
}
type UploadControllerResult = {
    uppy: Uppy;
    files: any[];
    upload: () => void;
}