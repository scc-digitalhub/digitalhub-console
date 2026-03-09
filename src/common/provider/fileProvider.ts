// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { stringify } from 'query-string';
import { fetchUtils } from 'ra-core';
import { FileProvider } from '../../features/files/FileProvider';
import { FetchFunction } from './types';

const fileProvider = (
    apiUrl: string,
    httpClient: FetchFunction = fetchUtils.fetchJson
): FileProvider => {
    return {
        stores: params => {
            let prefix = '';
            if (params.meta?.root) {
                prefix = '/-/' + params.meta.root;
            }

            const url = `${apiUrl}${prefix}/files/stores`;

            return httpClient(`${url}`).then(({ status, body }) => {
                if (status !== 200) {
                    throw new Error('Invalid response status ' + status);
                }
                if (!body) {
                    throw new Error('Resource not found');
                }
                const jsonBody = JSON.parse(body);
                return jsonBody;
            });
        },
        deleteFiles: (params, paths) => {
            let prefix = '';
            if (params.meta?.root) {
                prefix = '/-/' + params.meta.root;
            }

            const url = `${apiUrl}${prefix}/files/delete`;
            const promises = paths.map(path =>
                httpClient(`${url}?path=${path}`, {
                    method: 'DELETE',
                })
            );
            return Promise.all(promises).then(responses => {
                responses.forEach(r => {
                    if (r.status !== 200) {
                        throw new Error('Invalid response status ' + r.status);
                    }
                });
            });
        },
        download: (params, downloadParams, resourceDownloadParams) => {
            let prefix = '';
            if (params.meta?.root) {
                prefix = '/-/' + params.meta.root;
            }

            let resourcePath = '';
            if (resourceDownloadParams) {
                resourcePath = `/${resourceDownloadParams.resource}/${resourceDownloadParams.id}`;
            }

            const url = `${apiUrl}${prefix}${resourcePath}/files/download`;

            let query = {};
            if (downloadParams) {
                query = {
                    path: downloadParams.path,
                    duration: downloadParams.duration,
                };
            } else if (resourceDownloadParams) {
                query = {
                    sub: resourceDownloadParams.sub,
                };
            }

            return httpClient(`${url}?${stringify(query)}`).then(
                ({ status, body }) => {
                    if (status !== 200) {
                        throw new Error('Invalid response status ' + status);
                    }
                    if (!body) {
                        throw new Error('Resource not found');
                    }
                    const jsonBody = JSON.parse(body);
                    return jsonBody;
                }
            );
        },
        fileInfo: (params, fileInfoParams, resourceFileInfoParams) => {
            let prefix = '';
            if (params.meta?.root) {
                prefix = '/-/' + params.meta.root;
            }

            let resourcePath = '';
            if (resourceFileInfoParams) {
                resourcePath = `/${resourceFileInfoParams.resource}/${resourceFileInfoParams.id}`;
            }

            let query = '';
            if (fileInfoParams) query = `?path=${fileInfoParams.path}`;

            const url = `${apiUrl}${prefix}${resourcePath}/files/info${query}`;

            return httpClient(url).then(({ status, body }) => {
                if (status !== 200) {
                    throw new Error('Invalid response status ' + status);
                }
                if (!body) {
                    throw new Error('Resource not found');
                }
                const jsonBody = JSON.parse(body);
                return jsonBody;
            });
        },
        upload: (params, uploadParams, resourceUploadParams) => {
            let prefix = '';
            if (params.meta?.root) {
                prefix = '/-/' + params.meta.root;
            }

            let resourcePath = '';
            if (resourceUploadParams) {
                resourcePath = `/${resourceUploadParams.resource}/${resourceUploadParams.id}`;
            }

            const url = `${apiUrl}${prefix}${resourcePath}/files/upload`;

            let query = {};
            if (uploadParams) {
                query = {
                    path: uploadParams.path,
                    filename: uploadParams.filename,
                };
            } else if (resourceUploadParams) {
                query = {
                    filename: resourceUploadParams.filename,
                    name: resourceUploadParams.name,
                };
            }

            return httpClient(`${url}?${stringify(query)}`, {
                method: 'POST',
            }).then(({ status, json }) => {
                if (status !== 200) {
                    throw new Error('Invalid response status ' + status);
                }
                return json;
            });
        },
        startMultipartUpload: (params, uploadParams, resourceUploadParams) => {
            let prefix = '';
            if (params.meta?.root) {
                prefix = '/-/' + params.meta.root;
            }

            let resourcePath = '';
            if (resourceUploadParams) {
                resourcePath = `/${resourceUploadParams.resource}/${resourceUploadParams.id}`;
            }

            const url = `${apiUrl}${prefix}${resourcePath}/files/multipart/start`;

            let query = {};
            if (uploadParams) {
                query = {
                    path: uploadParams.path,
                    filename: uploadParams.filename,
                };
            } else if (resourceUploadParams) {
                query = {
                    filename: resourceUploadParams.filename,
                    name: resourceUploadParams.name,
                };
            }

            return httpClient(`${url}?${stringify(query)}`, {
                method: 'POST',
            }).then(({ status, json }) => {
                if (status !== 200) {
                    throw new Error('Invalid response status ' + status);
                }
                if (!json.uploadId) {
                    throw new Error('Invalid response, uploadId is missing');
                }
                return json;
            });
        },
        uploadPart: (params, uploadParams, resourceUploadParams) => {
            let prefix = '';
            if (params.meta?.root) {
                prefix = '/-/' + params.meta.root;
            }

            let resourcePath = '';
            if (resourceUploadParams) {
                resourcePath = `/${resourceUploadParams.resource}/${resourceUploadParams.id}`;
            }

            const url = `${apiUrl}${prefix}${resourcePath}/files/multipart/part`;

            let query = {};
            if (uploadParams) {
                query = {
                    path: uploadParams.path,
                    filename: uploadParams.filename,
                    uploadId: uploadParams.uploadId,
                    partNumber: uploadParams.partNumber,
                };
            } else if (resourceUploadParams) {
                query = {
                    path: resourceUploadParams.path,
                    uploadId: resourceUploadParams.uploadId,
                    partNumber: resourceUploadParams.partNumber,
                };
            }

            if (!Object.keys(query).includes('uploadId')) {
                throw new Error(
                    'Invalid request parameters, uploadId is missing'
                );
            }

            return httpClient(`${url}?${stringify(query)}`, {
                method: 'PUT',
            }).then(({ status, json }) => {
                if (status !== 200) {
                    throw new Error('Invalid response status ' + status);
                }
                return json;
            });
        },
        completeMultipartUpload: (
            params,
            uploadParams,
            resourceUploadParams
        ) => {
            let prefix = '';
            if (params.meta?.root) {
                prefix = '/-/' + params.meta.root;
            }

            let resourcePath = '';
            if (resourceUploadParams) {
                resourcePath = `/${resourceUploadParams.resource}/${resourceUploadParams.id}`;
            }

            const url = `${apiUrl}${prefix}${resourcePath}/files/multipart/complete`;

            let query = {};
            if (uploadParams) {
                query = {
                    path: uploadParams.path,
                    filename: uploadParams.filename,
                    uploadId: uploadParams.uploadId,
                    partList: uploadParams.partList,
                };
            } else if (resourceUploadParams) {
                query = {
                    path: resourceUploadParams.path,
                    uploadId: resourceUploadParams.uploadId,
                    partList: resourceUploadParams.partList,
                };
            }

            return httpClient(`${url}?${stringify(query)}`, {
                method: 'POST',
            }).then(({ status, json }) => {
                if (status !== 200) {
                    throw new Error('Invalid response status ' + status);
                }
                return json;
            });
        },
    };
};

export default fileProvider;
