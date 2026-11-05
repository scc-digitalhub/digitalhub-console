// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { FileDetails } from '../../fileBrowser/components/FileDetails';

export type PreviewFile = {
    path: string;
    name?: string;
    content_type?: string;
    [key: string]: any;
};

/**
 * Previewer for a single file. Shows file details for now.
 */
export const FilePreview = (props: {
    file: PreviewFile;
    readOnly?: boolean;
    onDelete?: (file: PreviewFile) => void;
}) => {
    const { file, readOnly, onDelete } = props;
    const name = file.name || file.path.split('/').pop() || file.path;

    return (
        <FileDetails
            file={{ ...file, name }}
            readOnly={readOnly}
            onDelete={onDelete}
        />
    );
};
