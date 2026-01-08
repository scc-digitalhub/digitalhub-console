// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { Upload, UploadStatusController } from './types';

export const useUploadStatusController = (): UploadStatusController => {
    const [uploads, setUploads] = useState<Upload[]>([]);

    const updateUploads = (upload: Upload) => {
        setUploads(prev => {
            const oldIndex = prev.findIndex(p => p.id === upload.id);
            if (oldIndex < 0) {
                return [upload, ...prev.filter(p => p.id !== upload.id)];
            } else {
                return prev.map((u, index) =>
                    index === oldIndex ? upload : u
                );
            }
        });
    };

    const removeUploads = (toBeRemoved?: Upload) => {
        if (toBeRemoved) {
            setUploads(prev => {
                return prev.filter(u => u.id !== toBeRemoved.id);
            });
        } else {
            setUploads([]);
        }
    };

    return { uploads, updateUploads, removeUploads };
};
