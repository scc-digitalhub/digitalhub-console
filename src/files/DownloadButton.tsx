// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    useRecordContext,
    useNotify,
    Button,
    FieldProps,
    ButtonProps,
    RaRecord,
    IconButtonWithTooltip,
} from 'react-admin';
import DownloadIcon from '@mui/icons-material/GetApp';
import { ReactElement } from 'react';
import { useDownload } from '../upload_rename_as_files/download/useDownload';
const defaultIcon = <DownloadIcon fontSize="small" />;

export const DownloadButton = (props: DownloadButtonProps) => {
    const {
        color = 'info',
        label = 'actions.download',
        icon = defaultIcon,
        size = 'medium',
        iconButton = false,
        fileName: fileNameProp,
        path: pathProp,
    } = props;
    const record = useRecordContext(props);
    const notify = useNotify();
    const download = useDownload();

    if (!record) {
        return <></>;
    }

    const path = pathProp || record?.path;
    const fileName = fileNameProp || record?.name;

    const handleDownload = () => {
        download({ path })
            .then(data => {
                if (data?.url) {
                    const link = document.createElement('a');
                    link.style.display = 'none';
                    document.body.appendChild(link);
                    link.href = data.url;
                    link.target = '_blank';
                    if (fileName) {
                        link.download = fileName;
                    }
                    link.click();
                } else {
                    notify('ra.message.not_found', {
                        type: 'error',
                    });
                }
            })
            .catch(error => {
                const e =
                    typeof error === 'string'
                        ? error
                        : error.message || 'error';
                notify(e);
            });
    };

    return iconButton ? (
        <IconButtonWithTooltip
            label={label}
            color={color}
            size={size}
            onClick={handleDownload}
        >
            {icon}
        </IconButtonWithTooltip>
    ) : (
        <Button label={label} color={color} onClick={handleDownload}>
            {icon}
        </Button>
    );
};

export type DownloadButtonProps<RecordType extends RaRecord = any> = Omit<
    FieldProps<RecordType>,
    'source'
> &
    ButtonProps & {
        icon?: ReactElement;
        fileName?: string;
        path?: string;
        iconButton?: boolean;
    };
