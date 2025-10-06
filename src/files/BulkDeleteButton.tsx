// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useRootSelector } from '@dslab/ra-root-selector';
import {
    useDataProvider,
    useNotify,
    Button,
    FieldProps,
    ButtonProps,
    RaRecord,
    Confirm,
    useTranslate,
    useListContext,
} from 'react-admin';
import DeleteIcon from '@mui/icons-material/Delete';
import { Fragment, ReactElement, useState } from 'react';

const defaultIcon = <DeleteIcon />;

export const BulkDeleteButton = (props: BulkDeleteButtonProps) => {
    const {
        color = 'error',
        label = 'ra.action.delete',
        icon = defaultIcon,
        path,
        onDelete,
    } = props;
    const { root: projectId } = useRootSelector();
    const { selectedIds, onUnselectItems } = useListContext();
    const dataProvider = useDataProvider();
    const notify = useNotify();
    const translate = useTranslate();

    const [open, setOpen] = useState(false);

    if (!selectedIds || !path) {
        return <></>;
    }

    const handleDelete = () => {
        if (dataProvider && selectedIds && selectedIds.length > 0) {
            const basePath = path && path.endsWith('/') ? path : path + '/';

            Promise.all(
                selectedIds.map(filename =>
                    dataProvider.invoke({
                        path: '/-/' + projectId + '/files/delete',
                        params: { path: basePath + filename },
                        options: { method: 'DELETE' },
                    })
                )
            )
                .then(() => {
                    onUnselectItems();
                    setOpen(false);
                    notify('ra.notification.deleted', {
                        type: 'info',
                        messageArgs: {
                            smart_count: selectedIds.length,
                            _: translate('ra.notification.deleted', {
                                smart_count: selectedIds.length,
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
        }
    };

    const handleDialogOpen = e => {
        setOpen(true);
        e.stopPropagation();
    };

    const handleDialogClose = e => {
        e.stopPropagation();
        setOpen(false);
    };

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
                title={'ra.message.bulk_delete_title'}
                content={'ra.message.bulk_delete_content'}
                confirmColor={'warning'}
                titleTranslateOptions={{
                    name: 'file',
                    smart_count: selectedIds.length,
                }}
                contentTranslateOptions={{
                    name: 'file',
                    smart_count: selectedIds.length,
                }}
                onConfirm={handleDelete}
                onClose={handleDialogClose}
            />
        </Fragment>
    );
};

export type BulkDeleteButtonProps<RecordType extends RaRecord = any> = Omit<
    FieldProps<RecordType>,
    'source'
> &
    ButtonProps & {
        icon?: ReactElement;
        path: string | null | undefined;
        onDelete?: () => void;
    };
