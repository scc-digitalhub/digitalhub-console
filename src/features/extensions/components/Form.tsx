// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box, Stack } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {
    ArrayInput,
    Confirm,
    FormDataConsumer,
    IconButtonWithTooltip,
    required,
    SelectInput,
    SimpleFormIterator,
    TextInput,
    ResourceContextProvider,
    useRecordContext,
    useResourceContext,
    useSimpleFormIterator,
    useSimpleFormIteratorItem,
    useSourceContext,
    useTranslate,
} from 'react-admin';
import { useMemo, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { isValidKind, randomId } from '../../../common/utils/helpers';
import { JsonSchemaInput } from '../../../common/jsonSchema/components/JsonSchema';
import { filterProperties } from '../../../common/jsonSchema/utils';
import { PathInput } from '../../files/upload/components/PathInput';
import { useResolveUploadPath } from '../../files/upload/useResolveUploadPath';
import { FileSelection } from '../../files/upload/types';
import { useUploadCoordinator } from '../../files/upload/UploaderContext';
import { useGetExtensions } from '../utils';

export const ExtensionsForm = (props: {
    resource?: string;
    record?: any;
    source?: string;
}) => {
    const { source = 'extensions', resource: resourceProp } = props;
    const resource = useResourceContext(props);
    const record = useRecordContext(props);
    const coordinator = useUploadCoordinator();
    const parentId = props.record?.id ?? record?.id ?? coordinator?.id;

    //check if any extension is available
    const { data: schemas, isLoading } = useGetExtensions(
        resourceProp || resource
    );

    if (isLoading || !schemas) {
        return <></>;
    }

    return (
        <ArrayInput
            source={source}
            label="fields.extensions.title"
            helperText="fields.extensions.description"
        >
            <SimpleFormIterator
                addButton={<ExtensionIteratorActions />}
                disableClear
                removeButton={<RemoveExtensionButton />}
            >
                <ExtensionsFormItem schemas={schemas} parentId={parentId} />
            </SimpleFormIterator>
        </ArrayInput>
    );
};

const ExtensionIteratorActions = () => {
    const { add, remove, source, total } = useSimpleFormIterator();
    const { getValues } = useFormContext();
    const coordinator = useUploadCoordinator();
    const translate = useTranslate();
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleClear = () => {
        const extensions = getValues(source) ?? [];
        extensions.forEach((extension: { id?: string | number }) => {
            if (extension.id != null) {
                coordinator?.unregisterSlotsForTarget({
                    id: String(extension.id),
                    resource: 'extensions',
                });
            }
        });
        for (let index = total - 1; index >= 0; index--) {
            remove(index);
        }
        setConfirmOpen(false);
    };

    return (
        <Stack direction="row" spacing={1}>
            <IconButtonWithTooltip
                label="ra.action.add"
                size="small"
                onClick={() => add()}
                color="primary"
            >
                <AddCircleOutlineIcon fontSize="small" />
            </IconButtonWithTooltip>
            {total > 0 && (
                <>
                    <IconButtonWithTooltip
                        label="ra.action.clear_array_input"
                        size="small"
                        onClick={() => setConfirmOpen(true)}
                        color="warning"
                    >
                        <HighlightOffIcon fontSize="small" />
                    </IconButtonWithTooltip>
                    <Confirm
                        isOpen={confirmOpen}
                        title={translate('ra.action.clear_array_input')}
                        content={translate('ra.message.clear_array_input')}
                        onConfirm={handleClear}
                        onClose={() => setConfirmOpen(false)}
                    />
                </>
            )}
        </Stack>
    );
};

const RemoveExtensionButton = () => {
    const { index, remove } = useSimpleFormIteratorItem();
    const { source } = useSimpleFormIterator();
    const { getValues } = useFormContext();
    const coordinator = useUploadCoordinator();

    const handleRemove = () => {
        const id = getValues(`${source}.${index}.id`);
        if (id != null) {
            coordinator?.unregisterSlotsForTarget({
                id: String(id),
                resource: 'extensions',
            });
        }
        remove();
    };

    return (
        <IconButtonWithTooltip
            label="ra.action.remove"
            size="small"
            onClick={handleRemove}
            color="warning"
        >
            <RemoveCircleOutlineIcon fontSize="small" />
        </IconButtonWithTooltip>
    );
};

const ExtensionsFormItem = (props: {
    schemas: any[];
    parentId?: string | number;
}) => {
    const { schemas = [], parentId } = props;
    const sourceContext = useSourceContext();
    const { setValue, getValues } = useFormContext();

    const id =
        useWatch({ name: sourceContext.getSource('id') }) ??
        getValues(sourceContext.getSource('id')) ??
        null;
    const isExisting = useRef(Boolean(id)).current;
    const name = useWatch({ name: sourceContext.getSource('name') });
    const parentName = useWatch({ name: 'name' });
    const parentResource = useResourceContext();
    const coordinator = useUploadCoordinator();
    const uploadTarget = useMemo(
        () => ({
            id: id == null ? undefined : String(id),
            name,
            resource: 'extensions',
        }),
        [id, name]
    );
    const pathResolver = useResolveUploadPath({
        id: parentId == null ? coordinator?.id : String(parentId),
        name: parentName,
        resource: parentResource,
        uploadTarget,
        filenamePrefix: name ? `extensions/${name}` : undefined,
        basePathSuffix: name ? `extensions/${name}/` : undefined,
    });

    const kinds = schemas
        ?.map(s => ({
            id: s.kind,
            name: s.kind,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

    const getSpecSchema = (kind: string | undefined) => {
        return schemas?.find(s => s.kind === kind)?.schema;
    };

    const getUiSchema = (kind: string | undefined) => {
        return schemas ? schemas.find(s => s.kind === kind)?.uiSchema : {};
    };

    const isDirty = () => {
        const specValue = getValues(sourceContext.getSource('spec'));
        return specValue && Object.keys(specValue).length > 0;
    };

    const onKindChange = () => {
        if (isDirty()) {
            //reset spec
            setValue(sourceContext.getSource('spec'), {});
        }
    };
    const onPathFilesChange = (selection: FileSelection) => {
        if (selection && !id) {
            setValue(sourceContext.getSource('id'), randomId(), {
                shouldDirty: true,
            });
        }
    };

    return (
        <ResourceContextProvider value="extensions">
            <Box sx={{ padding: 2, marginBottom: 2 }}>
                <KindSelector
                    kinds={kinds}
                    onChange={onKindChange}
                    isDirty={isDirty}
                    readOnly={isExisting}
                />
                <TextInput
                    source="name"
                    readOnly={isExisting}
                    validate={[required()]}
                />
                <FormDataConsumer<{ kind: string }>>
                    {({ scopedFormData }) => {
                        if (!scopedFormData?.kind) {
                            return null;
                        }

                        const exs = getSpecSchema(scopedFormData.kind);
                        if (!exs?.properties) {
                            return null;
                        }

                        return (
                            <>
                                <ScopedFormData
                                    source="spec"
                                    schema={filterProperties(exs, ['path'])}
                                    uiSchema={getUiSchema(scopedFormData.kind)}
                                />
                                {'path' in exs.properties && (
                                    <PathInput
                                        source="path"
                                        defaultValue={getValues(
                                            sourceContext.getSource('spec.path')
                                        )}
                                        pathResolver={pathResolver}
                                        uploadTarget={uploadTarget}
                                        onChange={onPathFilesChange}
                                    />
                                )}
                            </>
                        );
                    }}
                </FormDataConsumer>
            </Box>
        </ResourceContextProvider>
    );
};

const ScopedFormData = (props: {
    source: string;
    schema: any;
    uiSchema?: any;
}) => {
    const { source, schema, uiSchema } = props;
    return (
        <JsonSchemaInput source={source} schema={schema} uiSchema={uiSchema} />
    );
};

const KindSelector = (props: {
    kinds: any[] | undefined;
    source?: string;
    onChange?: (value: string | null) => void;
    isDirty?(): boolean;
    readOnly?: boolean;
}) => {
    const {
        kinds = [],
        source = 'kind',
        readOnly = false,
        onChange,
        isDirty = () => false,
    } = props;
    const sourceContext = useSourceContext();
    const { setValue } = useFormContext();

    const [open, setOpen] = useState(false);
    const translate = useTranslate();
    const kind = useRef<string | null>(null);
    const kindEvent = useRef<string | null>(null);

    const handleConfirm = () => {
        kind.current = kindEvent.current;
        if (onChange) {
            onChange(kind.current);
        }
        setOpen(false);
    };
    const handleDialogClose = () => {
        setValue(sourceContext.getSource('kind'), kind.current);
        setOpen(false);
    };

    //popup di conferma se resettare o meno la form
    //se si ongchange altrimenti restore del select al valore precedente
    //useinput
    const reset = e => {
        //keep current value for restore if user cancels
        kindEvent.current = e.target.value;
        if (onChange && isDirty()) {
            setOpen(true);
        } else {
            //no onChange means no need to reset other fields, so just change kind
            handleConfirm();
        }
    };

    return (
        <>
            <SelectInput
                readOnly={readOnly}
                source={source}
                choices={kinds}
                validate={[required(), isValidKind(kinds)]}
                onChange={e => reset(e)}
            />
            <Confirm
                isOpen={open}
                title={translate('resources.common.reset.title')}
                content={translate('resources.common.reset.content')}
                onConfirm={handleConfirm}
                onClose={handleDialogClose}
            />
        </>
    );
};
