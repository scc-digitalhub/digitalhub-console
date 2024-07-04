import { useRootSelector } from "@dslab/ra-root-selector";
import { useRef, useState } from "react";
import { useDataProvider, useNotify, useResourceContext, useTranslate } from "react-admin";
import { Uppy } from "uppy";
import AwsS3 from "@uppy/aws-s3-multipart";

const MiB = 0x10_00_00;
function partSize(file): number {
    if (file.size <= 100 * MiB)
        return 1;
    else {
        return Math.ceil(file.size / (100 * MiB));
    }
}

export const useUploadController = (props?: any): UploadControllerResult => {
    const dataProvider = useDataProvider();
    const { root } = useRootSelector();
    const { id } = props;
    const [pathFile, setPathFile] = useState<string | null>(null);
    const uppyConfig = { restrictions: { maxNumberOfFiles: 1 } };
    const uploadUrl = useRef('');
    const uploadId = useRef('');
    const resource = useResourceContext();
    const [files, setFiles] = useState<any[]>([]);
    const [uppy] = useState(() =>
        new Uppy(uppyConfig).use(AwsS3, {
            id: 'AwsS3',
            shouldUseMultipart: (file) => file.size > 100 * MiB,
            getChunkSize: (file) => 100 * MiB,
            getUploadParameters: async file => {
                return {
                    method: 'PUT',
                    url: uploadUrl.current,
                    fields: {},
                    headers: file.type ? { 'Content-Type': file.type } : undefined,
                }
            },
            // ========== Multipart Uploads ==========
            // The following methods are only useful for multipart uploads:
       
            async createMultipartUpload(file) {
                return {
                    uploadId: uploadId.current,
                    key: file.name
                }
            },

            async abortMultipartUpload(file, { key, uploadId }) {
                // const filename = encodeURIComponent(key)
                // const uploadIdEnc = encodeURIComponent(uploadId)
                // const response = await fetch(
                //     `/s3/multipart/${uploadIdEnc}?key=${filename}`,
                //     {
                //         method: 'DELETE',
                //     },
                // )

                // if (!response.ok)
                //     throw new Error('Unsuccessful request', { cause: response })
            },

            async signPart(file, options) {

                const { signal,uploadId } = options

                signal?.throwIfAborted()

                const data = await dataProvider.uploadMultipartPart(resource, {
                    id: id,
                    meta: { root },
                    filename: file.name,
                    uploadId: uploadId,
                    partNumber: options.partNumber
                })

                return data
            },

            async listParts(file, { key, uploadId }) {

                const returnParts: any[] = [];
                // const filename = encodeURIComponent(key)
                // const response = await fetch(
                //     `/s3/multipart/${uploadId}?key=${filename}`
                // )

                // if (!response.ok)
                //     throw new Error('Unsuccessful request', { cause: response })

                // const data = await response.json()

                // return data
                return returnParts;
            },

            async completeMultipartUpload(
                file,
                { key, uploadId, parts },
            ) {
                //parts is array of part
                try{
                 const response = await dataProvider.uploadMultipartComplete(resource,{
                    id: id,
                    meta: { root },
                    filename: file.name,
                    uploadId,
                    eTagPartList:parts.map((part:any)=>part.etag),

                 })
                } catch(error) {
                    throw new Error('Unsuccessful request')

                }

                return {};
            },
        }),
    );
    if (uppy) {
        uppy.on('file-added', async file => {
            if (dataProvider) {
                const partSizeNumber = partSize(file);
                let res: any = null;
                if (partSizeNumber === 1) {
                    res = await dataProvider.upload(resource, {
                        id: id,
                        meta: { root },
                        filename: file.name,
                    });
                    uploadUrl.current = res?.url;


                } else {
                    res = await dataProvider.uploadMultipartStart(resource, {
                        id: id,
                        meta: { root },
                        filename: file.name,
                    });
                    uploadId.current = res?.uploadId;


                }
                setPathFile(res?.path);
                let info = {
                    id: file.id,
                    info: extractInfo(file, res?.path),
                    file: file,
                    path: res?.path,

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

        uppy.on('file-removed', (file) => {
            setPathFile(null);
            uploadUrl.current = '';
            if (file) {
                setFiles((prev) => {
                    prev.splice(prev.findIndex(f => f.id === file.id), 1);
                    return prev;
                })
            }
        });
        uppy.on('upload-progress', (file) => {
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
            console.log('response',response);
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
        uppy.on('upload-error', () => {
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
        path: path,
        name: file.name,
        content_type: file.type,
        last_modified: new Date(file.data?.lastModified).toUTCString(),
        size: file.size,
    }
}
type UploadControllerResult = {
    uppy: Uppy;
    files: any[];
    upload: () => void;
}