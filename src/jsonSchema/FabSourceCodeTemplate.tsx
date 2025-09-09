// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    ObjectFieldTemplateProps,
    ObjectFieldTemplatePropertyType,
    WidgetProps,
} from '@rjsf/utils';
import { FormLabel } from '../components/FormLabel';
import { Box, Grid, Stack } from '@mui/material';

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

export const FabSourceCodeTemplate = (props: ObjectFieldTemplateProps) => {
    const { formData, properties, formContext } = props;

    //explode struct
    const source = {
        prop: properties.find(
            element => element.name == 'source'
        ) as ObjectFieldTemplatePropertyType,
        value: formData ? formData['source'] || '' : '',
    };


    const clientapp = {
        prop: properties.find(
            element => element.name == 'clientapp'
        ) as ObjectFieldTemplatePropertyType,
        value: formData ? formData['clientapp'] || '' : '',
    };
    const serverapp = {
        prop: properties.find(
            element => element.name == 'serverapp'
        ) as ObjectFieldTemplatePropertyType,
        value: formData ? formData['serverapp'] || '' : '',
    };


    const clientbase64 = {
        prop: properties.find(
            element => element.name == 'clientbase64'
        ) as ObjectFieldTemplatePropertyType,
        value: formData ? formData['clientbase64'] || '' : '',
    };
    const serverbase64 = {
        prop: properties.find(
            element => element.name == 'serverbase64'
        ) as ObjectFieldTemplatePropertyType,
        value: formData ? formData['serverbase64'] || '' : '',
    };

    //hack: expose lang via context for editor widget
    //TODO refactor
    formContext['sourceLang'] = 'python';

    const rest = properties.filter(
        element =>
            !element.hidden &&
            element.name != 'source' &&
            element.name != 'clientapp' &&
            element.name != 'clientbase64' &&
            element.name != 'serverapp' &&
            element.name != 'serverbase64'
    );

    return (
        <>
            <FormLabel label={props.title} />
            <div style={{ display: 'flex', width: '100%' }}>
                <Grid container spacing={2}>
                    <Grid size={12} key={'sctw-0'}>
                        <Stack spacing={2}>
                            <Box>
                                <div style={{ width: '100%' }} key={'lang'}>
                                    {source.prop.content}
                                </div>
                            </Box>
                        </Stack>
                    </Grid>
                    <Grid size={12} key={'sctw-1'}>
                        <Stack spacing={2} direction={'row'}>
                            <Box>{clientapp.prop.content}</Box>
                            <Box>{serverapp.prop.content}</Box>
                        </Stack>
                    </Grid>

                    <Grid size={12} key={'sctw-2-c'}>
                        {clientbase64.prop.content}
                    </Grid>
                    <Grid size={12} key={'sctw-2-s'}>
                        {serverbase64.prop.content}
                    </Grid>

                    {rest.map((element, index) => (
                        <Grid size={12} key={'sctw-r-' + index}>
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

