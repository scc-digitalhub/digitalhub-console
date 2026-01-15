// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { useState, useRef } from 'react';
import {
    useResourceContext,
    useInput,
    useTranslate,
    SelectInput,
    required,
    Confirm,
    useRecordContext,
} from 'react-admin';
import { isValidKind } from '../helper';
import { useFormState } from 'react-hook-form';

export const KindSelector = (props: {
    kinds: any[] | undefined;
    readOnly?: boolean;
}) => {
    const { kinds = [], readOnly = false } = props;
    const resource = useResourceContext();
    const { dirtyFields } = useFormState();
    const { field } = useInput({ resource, source: 'spec' });
    const { field: kindField } = useInput({ resource, source: 'kind' });
    const [open, setOpen] = useState(false);
    const translate = useTranslate();
    const kind = useRef<string | null>(null);
    const kindEvent = useRef<string | null>(null);
    const record = useRecordContext();

    const handleConfirm = () => {
        kind.current = kindEvent.current;
        //reset to original spec
        field.onChange(record?.spec || {});
        setOpen(false);
    };
    const handleDialogClose = () => {
        kindField.onChange(kind.current);
        setOpen(false);
    };

    //popup di conferma se resettare o meno la form
    //se si ongchange altrimenti restore del select al valore precedente
    //useinput
    const reset = e => {
        if ('spec' in dirtyFields) {
            // show pop up di conferma. Sei sicuro di resettare?
            kindEvent.current = e.target.value;
            setOpen(true);
        } else {
            kind.current = e.target.value;
        }
    };
    return (
        <>
            <SelectInput
                readOnly={readOnly}
                source="kind"
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
