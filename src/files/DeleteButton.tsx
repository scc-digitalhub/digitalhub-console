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
    ButtonProps,
    RaRecord,
    Confirm,
    useTranslate,
} from 'react-admin';
import DeleteIcon from '@mui/icons-material/Delete';
import { Fragment, ReactElement, useCallback, useState } from 'react';

const defaultIcon = <DeleteIcon />;

export const DeleteButton = (props: DeleteButtonProps) => {
    const {
        color = 'error',
        label = 'ra.action.delete',
        icon = defaultIcon,
        fileName: fileNameProp,
        path: pathProp,
        onDelete,
    } = props;
    const { root: projectId } = useRootSelector();
    const record = useRecordContext(props);
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const translate = useTranslate();

    const [open, setOpen] = useState(false);

    if (!record) {
        return <></>;
    }

    const path = pathProp || record?.path;
    const fileName = fileNameProp || record?.name;

    const handleDelete = () => {
        dataProvider
            .invoke({
                path: '/-/' + projectId + '/files/delete',
                params: { path },
                options: { method: 'DELETE' },
            })
            .then(() => {
                setOpen(false);
                notify('ra.notification.deleted', {
                    type: 'info',
                    messageArgs: {
                        smart_count: 1,
                        _: translate('ra.notification.deleted', {
                            smart_count: 1,
                        }),
                    },
                    undoable: false,
                });

                if (onDelete) {
                    onDelete();
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

    const handleDialogOpen = e => {
        setOpen(true);
        e.stopPropagation();
    };

    const handleDialogClose = e => {
        e.stopPropagation();
        setOpen(false);
    };

    const handleClick = useCallback(e => {
        e.stopPropagation();
    }, []);

    return (
        <Fragment>
            <Button
                label={label}
                color={color}
                onClick={handleDialogOpen}
                key="button"
            >
                {icon}
            </Button>
            <Confirm
                isOpen={open}
                loading={false}
                title={'ra.message.delete_title'}
                content={'ra.message.delete_content'}
                confirmColor={'warning'}
                titleTranslateOptions={{
                    name: 'file',
                    recordRepresentation: record?.name,
                }}
                contentTranslateOptions={{
                    name: 'file',
                }}
                onConfirm={handleDelete}
                onClose={handleDialogClose}
            />
        </Fragment>
    );
};

export type DeleteButtonProps<RecordType extends RaRecord = any> = Omit<
    FieldProps<RecordType>,
    'source'
> &
    ButtonProps & {
        icon?: ReactElement;
        fileName?: string;
        path?: string;
        onDelete?: () => void;
    };
