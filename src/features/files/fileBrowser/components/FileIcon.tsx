// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import GenericFileIcon from '@mui/icons-material/InsertDriveFile';
import { useRecordContext } from 'react-admin';
import {
    getIconFromType,
    getMimeTypeFromExtension,
    getTypeFromMimeType,
} from '../../utils';

export const FileIcon = (props: {
    fileName?: string;
    /**
     * The file type (NOT MIME type), e.g. "csv"
     */
    fileType?: string;
    color?:
        | 'disabled'
        | 'action'
        | 'inherit'
        | 'error'
        | 'primary'
        | 'secondary'
        | 'success'
        | 'info'
        | 'warning';
    fontSize?: 'small' | 'medium' | 'large';
}) => {
    const {
        fileName: fileNameProp,
        fileType: fileTypeProp,
        fontSize: fontSizeProp = 'small',
        color: colorFromProps,
    } = props;
    const record = useRecordContext(props);
    const fileName = fileNameProp || record?.name || '';
    const fontSize = fontSizeProp == 'large' ? 'large' : 'small';

    if (!fileName && !fileTypeProp) {
        return <GenericFileIcon fontSize={fontSize} />;
    }

    const fileType =
        fileTypeProp ||
        (record?.content_type
            ? getTypeFromMimeType(record.content_type)
            : undefined) ||
        (fileName.indexOf('.') > -1
            ? getTypeFromMimeType(
                  getMimeTypeFromExtension(fileName.split('.').pop())
              )
            : fileName.endsWith('/') || !record?.size
            ? 'folder'
            : undefined);

    if (!fileType) {
        return <GenericFileIcon fontSize={fontSize} />;
    }

    const Icon = getIconFromType(fileType ?? '');
    let color;
    if (colorFromProps) {
        color = colorFromProps;
    } else {
        switch (fileType) {
            case 'folder':
                color = 'warning';
                break;
            case 'image':
            case 'audio':
            case 'video':
                color = 'info';
                break;
            case 'text':
            case 'html':
            case 'csv':
                color = 'action';
                break;
            case 'document':
            case 'archive':
                color = 'error';
                break;
            default:
                color = 'disabled';
        }
    }

    return <Icon fontSize={fontSize} color={color} />;
};
