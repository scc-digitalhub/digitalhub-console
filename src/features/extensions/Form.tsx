// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Box } from '@mui/material';
import {
    ArrayInput,
    Confirm,
    FormDataConsumer,
    required,
    SelectInput,
    SimpleFormIterator,
    TextInput,
    useRecordContext,
    useSourceContext,
    useTranslate,
} from 'react-admin';
import { useGetSchemas } from '../../common/jsonSchema/schemaController';
import { SpecInput } from '../../common/jsonSchema/components/SpecInput';
import { useState, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { isValidKind } from '../../common/utils/helpers';

export const ExtensionsForm = (props: {
    resource?: string;
    record?: any;
    source?: string;
}) => {
    const { source = 'extensions' } = props;

    //check if any extension is available
    const { data: schemas, isLoading } = useGetSchemas('extensions');

    if (isLoading || !schemas) {
        return <></>;
    }

    return (
        <ArrayInput
            source={source}
            label="fields.extensions.title"
            helperText="fields.extensions.description"
        >
            <SimpleFormIterator>
                <ExtensionsFormItem schemas={schemas} />
            </SimpleFormIterator>
        </ArrayInput>
    );
};

export const ExtensionsFormItem = (props: { schemas: any[] }) => {
    const { schemas = [] } = props;
    const sourceContext = useSourceContext();
    const { setValue, getValues } = useFormContext();

    const id = getValues(sourceContext.getSource('id')) || null;

    const kinds = schemas
        ?.map(s => ({
            id: s.kind,
            name: s.kind,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

    const getSpecSchema = (kind: string | undefined) => {
        return schemas ? schemas.find(s => s.kind === kind)?.schema : {};
    };

    const getUiSchema = (kind: string | undefined) => {
        return schemas ? schemas.find(s => s.kind === kind)?.uiSchema : {};
    };

    const isDirty = () => {
        const specValue = getValues(sourceContext.getSource('spec'));
        return specValue && Object.keys(specValue).length > 0;
    };

    const onKindChange = (kind: string | null) => {
        console.log('kind changed to', kind);

        if (isDirty()) {
            console.log('spec is dirty, reset');
            //reset spec
            setValue(sourceContext.getSource('spec'), {});
        }
    };
    return (
        <Box sx={{ padding: 2, marginBottom: 2 }}>
            <KindSelector
                kinds={kinds}
                onChange={onKindChange}
                isDirty={isDirty}
                readOnly={!!id}
            />
            <TextInput source="name" readOnly={!!id} />
            <FormDataConsumer<{ kind: string }>>
                {({ formData, scopedFormData }) =>
                    scopedFormData?.kind && (
                        <SpecInput
                            source="spec"
                            kind={scopedFormData.kind}
                            schema={getSpecSchema(scopedFormData.kind)}
                            getUiSchema={getUiSchema}
                        />
                    )
                }
            </FormDataConsumer>
        </Box>
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
    const { setValue, getValues } = useFormContext();

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
