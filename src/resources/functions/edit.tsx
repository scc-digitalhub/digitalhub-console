import ClearIcon from '@mui/icons-material/Clear';
import { Box, Container, Stack } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import deepEqual from 'deep-is';
import { Fragment, useEffect, useState } from 'react';
import {
    Button,
    EditBase,
    EditView,
    InputHelperText,
    InputProps,
    Labeled,
    LoadingIndicator,
    RecordContextProvider,
    SaveButton,
    SelectInput,
    SimpleForm,
    TextInput,
    Toolbar,
    useInput,
    useNotify,
    useRecordContext,
    useRedirect,
    useResourceContext,
    useTranslate,
} from 'react-admin';
import { useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { MetadataEditUiSchema, MetadataSchema } from '../../common/schemas';
import { FlatCard } from '../../components/FlatCard';
import { FormLabel } from '../../components/FormLabel';
import { EditPageTitle } from '../../components/PageTitle';
import { useSchemaProvider } from '../../provider/schemaProvider';
import { FunctionIcon } from './icon';
import { getFunctionUiSpec } from './types';
import { alphaNumericName } from '../../common/helper';
import { JsonSchemaInput } from '../../components/JsonSchema';
// import { spec } from 'node:test/reporters';
// import { AceEditorInput } from '@dslab/ra-ace-editor';
// import { useInput, InputProps, Labeled, InputHelperText } from 'react-admin';

import AceEditor from 'react-ace';

import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/mode-drools';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/mode-typescript';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/mode-text';

import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/theme-solarized_light';
// import { Fragment } from 'react';
import React from 'react';

export const FunctionEditToolbar = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(-1);
    };
    return (
        <Toolbar sx={{ justifyContent: 'space-between' }}>
            <SaveButton />
            <Button
                color="info"
                label={translate('buttons.cancel')}
                onClick={handleClick}
            >
                <ClearIcon />
            </Button>
        </Toolbar>
    );
};

const Editor = (props: AceInputProps) => {
    const {
        mode = 'html',
        theme = 'monokai',
        useWorker = false,
        //pick base from jsDelivr by default
        basePath = 'https://cdn.jsdelivr.net/npm/ace-builds@',
        label,
        helperText,
        fullWidth = false,
        width = '50vw',
        onBlur,
        onChange,
        resource,
        source,
    } = props;

    const {
        id,
        field,
        fieldState: { isTouched, error },
        formState: { isSubmitted },
        isRequired,
    } = useInput({
        // Pass the event handlers to the hook but not the component as the field property already has them.
        // useInput will call the provided onChange and onBlur in addition to the default needed by react-hook-form.
        onChange,
        onBlur,
        ...props,
    });
    const valueCode = atob(field?.value.base64 || '');
    const labelProps = {
        fullWidth,
        isRequired,
        label,
        resource,
        source,
    };

    //TODO let users customize options
    const aceOptions = {
        useWorker: useWorker,
        showPrintMargin: false,
    };
    const onCodeChange =(data:string) => {
        const encodedValue = btoa(data);
        field.onChange({...field.value,base64:encodedValue});
    }
    // import workers (disabled by default)
    // NOTE: this should match *exactly* the included ace version
    // ace.config.set('basePath', basePath + ace.version + '/src-noconflict/');

    return (
        <Fragment>
            <Labeled {...labelProps} id={id}> 
                 <AceEditor
                    // {...field}
                    mode={mode}
                    theme={theme}
                    wrapEnabled
                    width={fullWidth ? '100%' : width}
                    setOptions={aceOptions}
                    value={valueCode}
                    onChange={onCodeChange}
                /> 
            </Labeled>
            <InputHelperText
                touched={isTouched || isSubmitted}
                error={error?.message}
                helperText={helperText}
            />
        </Fragment>
    );
};

export type AceInputProps = InputProps & {
    mode?:
        | 'java'
        | 'javascript'
        | 'markdown'
        | 'drools'
        | 'html'
        | 'python'
        | 'json'
        | 'sql'
        | 'typescript'
        | 'css'
        | 'yaml'
        | 'text';
    //use a worker for syntax check
    //disabled by default, loads from external cdn
    useWorker?: boolean;
    basePath?: string;
    fullWidth?: boolean;
    width?: string;
    theme?: 'github' | 'monokai' | 'solarized_dark' | 'solarized_light';
};
const SpecInput = (props: {
    source: string;
    onDirty?: (state: boolean) => void;
}) => {
    const { source, onDirty } = props;
    const translate = useTranslate();
    const resource = useResourceContext();
    const record = useRecordContext();
    const value = useWatch({ name: source });
    const lang = useWatch({ name: 'spec.source.lang' });
    const eq = deepEqual(record[source], value);

    const schemaProvider = useSchemaProvider();
    const [spec, setSpec] = useState<any>();
    const kind = record?.kind || null;

    useEffect(() => {
        if (schemaProvider && record) {
            schemaProvider.get(resource, kind).then(s => setSpec(s));
        }
    }, [record, schemaProvider]);

    useEffect(() => {
        if (onDirty) {
            onDirty(!eq);
        }
    }, [eq]);
    
    const onChange = (e) => {

    }
    if (!record || !record.kind || !spec) {
        return (
            <Card
                sx={{
                    width: 1,
                    textAlign: 'center',
                }}
            >
                <CardContent>
                    {translate('resources.common.emptySpec')}{' '}
                </CardContent>
            </Card>
        );
    }

    return (
        <>
        <JsonSchemaInput
            source={source}
            schema={spec.schema}
            uiSchema={getFunctionUiSpec(record.kind)}
        />
        <Editor source="spec.source"/>
        </>
    );
};

export const FunctionEdit = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const resource = useResourceContext();
    const schemaProvider = useSchemaProvider();
    const [kinds, setKinds] = useState<any[]>();
    const [schemas, setSchemas] = useState<any[]>();
    const [isSpecDirty, setIsSpecDirty] = useState<boolean>(false);

    useEffect(() => {
        if (schemaProvider) {
            schemaProvider.list('functions').then(res => {
                if (res) {
                    setSchemas(res);

                    const values = res.map(s => ({
                        id: s.kind,
                        name: s.kind,
                    }));
                    setKinds(values);
                }
            });
        }
    }, [schemaProvider, setKinds]);

    if (!kinds) {
        return <LoadingIndicator />;
    }

    const validator = data => {
        const errors: any = {};
        console.log(data);
        console.log(kinds);
        if (!('kind' in data)) {
            errors.kind = 'messages.validation.required';
        }

        if (!kinds.find(k => k.id === data.kind)) {
            errors.kind = 'messages.validation.invalid';
        }

        if (!alphaNumericName(data.name)) {
            errors.name = 'validation.wrongChar';
        }

        return errors;
    };

    const onSuccess = (data, variables, context) => {
        console.log('success', data, variables);
    };
    const onSettled = (data, variables, context) => {
        console.log('settled', data, variables);

        notify('ra.notification.updated', {
            type: 'info',
            messageArgs: { smart_count: 1 },
        });
        redirect('show', resource, data.id, data);
    };
    const onChange = (e: any, id?:string) => {
        console.log('called',e);
        console.log('id',id);

    };
    return (
        <Container maxWidth={false} sx={{ pb: 2 }}>
            <EditBase
                redirect={'show'}
                mutationMode="optimistic"
                mutationOptions={{
                    meta: { update: !isSpecDirty },
                    onSuccess: onSuccess,
                    onSettled: onSettled,
                }}
            >
                <>
                    <EditPageTitle icon={<FunctionIcon fontSize={'large'} />} />

                    <EditView component={Box}>
                        <FlatCard sx={{ paddingBottom: '12px' }}>
                            <SimpleForm toolbar={<FunctionEditToolbar />}>
                                <FormLabel label="fields.base" />

                                <Stack direction={'row'} spacing={3} pt={4}>
                                    <TextInput source="name" readOnly />

                                    <SelectInput
                                        source="kind"
                                        choices={kinds}
                                        readOnly
                                    />
                                </Stack>

                                <JsonSchemaInput
                                    source="metadata"
                                    schema={MetadataSchema}
                                    uiSchema={MetadataEditUiSchema}
                                />

                                <SpecInput
                                    source="spec"
                                    onDirty={setIsSpecDirty}
                                />
     
                            </SimpleForm>
                        </FlatCard>
                    </EditView>
                </>
            </EditBase>
        </Container>
    );
};
