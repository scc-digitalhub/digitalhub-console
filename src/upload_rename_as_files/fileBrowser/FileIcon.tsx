// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import FolderRounded from '@mui/icons-material/FolderRounded';
import ImageIcon from '@mui/icons-material/Image';
import DocumentFileIcon from '@mui/icons-material/Article';
import PublicIcon from '@mui/icons-material/Public';
import GenericFileIcon from '@mui/icons-material/InsertDriveFile';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import TextFileIcon from '@mui/icons-material/Description';
import ArchiveFileIcon from '@mui/icons-material/FolderZip';
import { useRecordContext } from 'react-admin';
import { getMimeTypeFromExtension, getTypeFromMimeType } from './utils';

export const FileIcon = (props: {
    fileName?: string;
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
        color,
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
        fileName.indexOf('.') > -1
            ? getTypeFromMimeType(
                  getMimeTypeFromExtension(fileName.split('.').pop())
              )
            : 'folder';

    if (!fileType && fileName.indexOf('.') == -1) {
        return fileName.endsWith('/') || !record?.size ? (
            <FolderRounded fontSize={fontSize} color="warning" />
        ) : (
            <GenericFileIcon fontSize={fontSize} />
        );
    }

    switch (fileType) {
        case 'folder':
            return <FolderRounded fontSize={fontSize} color="warning" />;
        case 'image':
            return <ImageIcon fontSize={fontSize} color={color || 'info'} />;
        case 'audio':
            return (
                <AudioFileIcon fontSize={fontSize} color={color || 'info'} />
            );
        case 'video':
            return <PublicIcon fontSize={fontSize} color={color || 'info'} />;
        case 'text':
            return (
                <TextFileIcon fontSize={fontSize} color={color || 'action'} />
            );
        case 'document':
            return (
                <DocumentFileIcon
                    fontSize={fontSize}
                    color={color || 'error'}
                />
            );
        case 'archive':
            return (
                <ArchiveFileIcon fontSize={fontSize} color={color || 'error'} />
            );
        default:
            return (
                <GenericFileIcon
                    fontSize={fontSize}
                    color={color || 'disabled'}
                />
            );
    }
};
