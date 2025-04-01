import {
    ObjectFieldTemplateProps,
    ObjectFieldTemplatePropertyType,
    WidgetProps,
} from '@rjsf/utils';
import { FormLabel } from '../components/FormLabel';
import { Box, Grid, Stack } from '@mui/material';
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
import { Fragment } from 'react';

export const SourceCodeTemplate = (props: ObjectFieldTemplateProps) => {
    const { formData, properties, formContext } = props;

    //explode struct
    const source = {
        prop: properties.find(
            element => element.name == 'source'
        ) as ObjectFieldTemplatePropertyType,
        value: formData ? formData['source'] || '' : '',
    };

    const language = {
        prop: properties.find(
            element => element.name == 'lang'
        ) as ObjectFieldTemplatePropertyType,
        value: formData ? formData['lang'] || '' : '',
    };

    const handler = {
        prop: properties.find(
            element => element.name == 'handler'
        ) as ObjectFieldTemplatePropertyType,
        value: formData ? formData['handler'] || '' : '',
    };

    const base64 = {
        prop: properties.find(
            element => element.name == 'base64'
        ) as ObjectFieldTemplatePropertyType,
        value: formData ? formData['base64'] || '' : '',
    };

    //hack: expose lang via context for editor widget
    //TODO refactor
    formContext['sourceLang'] = language.value;

    const rest = properties.filter(
        element =>
            !element.hidden &&
            element.name != 'lang' &&
            element.name != 'handler' &&
            element.name != 'source' &&
            element.name != 'base64'
    );

    return (
        <>
            <FormLabel label={props.title} />
            <div style={{ display: 'flex', width: '100%' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} key={'sctw-0'}>
                        <Stack spacing={2}>
                            <Box>
                                <div style={{ width: '100%' }} key={'lang'}>
                                    {source.prop.content}
                                </div>
                            </Box>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} key={'sctw-1'}>
                        <Stack spacing={2} direction={'row'}>
                            <Box>{language.prop.content}</Box>
                            <Box>{handler.prop.content}</Box>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} key={'sctw-2'}>
                        {base64.prop.content}
                    </Grid>

                    {rest.map((element, index) => (
                        <Grid item xs={12} key={'sctw-r-' + index}>
                            <div style={{ width: '100%' }} key={index}>
                                {element.content}
                            </div>
                        </Grid>
                    ))}
                </Grid>
            </div>
        </>
    );
};

export const SourceCodeEditorWidget = function (props: WidgetProps) {
    const { id, value, readonly, onChange, formContext } = props;

    //extract language hint from context
    const lang = formContext.sourceLang ? formContext.sourceLang : undefined;

    const handleChange = (data: string) => {
        const encodedValue = btoa(data);
        onChange(encodedValue);
    };

    let code = '';
    try {
        code = atob(value);
    } catch (e: any) {
        code = '';
    }

    return (
        <Fragment key={id}>
            <AceEditor
                mode={lang}
                readOnly={readonly}
                theme={'monokai'}
                wrapEnabled
                width={'50vw'}
                setOptions={{ showPrintMargin: false }}
                value={code}
                onChange={handleChange}
            />
        </Fragment>
    );
};
