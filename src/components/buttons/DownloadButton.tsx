// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import {
    useRecordContext,
    useDataProvider,
    useNotify,
    Button,
    FieldProps,
    useResourceContext,
    ButtonProps,
    RaRecord,
} from 'react-admin';
import DownloadIcon from '@mui/icons-material/GetApp';
import { ReactElement } from 'react';
const defaultIcon = <DownloadIcon />;

export const DownloadButton = (props: DownloadButtonProps) => {
    const {
        color = 'info',
        label = 'download',
        icon = defaultIcon,
        fileName,
        sub,
    } = props;
    const { root } = useRootSelector();
    const resource = useResourceContext(props);
    const record = useRecordContext(props);
    const dataProvider = useDataProvider();
    const notify = useNotify();

    if (!record) {
        return <></>;
    }

    const handleDownload = () => {
        dataProvider
            .download(resource, { id: record.id, meta: { root }, sub })
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

    return (
        <Button label={label} color={color} onClick={handleDownload}>
            {icon}
        </Button>
    );
};

export type DownloadButtonProps<RecordType extends RaRecord = any> =
    FieldProps &
        ButtonProps & { icon?: ReactElement; fileName?: string; sub?: string };
