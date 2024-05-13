import { ObjectFieldTemplateProps } from '@rjsf/utils';
import { FormLabel } from './FormLabel';
import { Grid } from '@mui/material';
import { Editor } from './AceEditorInput';
import { useWatch } from 'react-hook-form';
import { useRecordContext } from 'react-admin';

export const SourceCodeTemplate = (props: ObjectFieldTemplateProps) => {
    const record = useRecordContext();
    let lang = '';
    const readonly = props.readonly;
    if (readonly) {
        lang = record?.spec?.source?.lang || '';
    } else {
        lang = useWatch({ name: 'spec.source.lang' });
    }
    const language: any = props.properties.find(
        element => element.name == 'lang'
    );
    const handler: any = props.properties.find(
        element => element.name == 'handler'
    );
    const source: any = props.properties.find(
        element => element.name == 'source'
    );
    console.log(props);
    const rest = props.properties.filter(
        element =>
            !element.hidden &&
            element.name != 'lang' &&
            element.name != 'handler' &&
            element.name != 'source' &&
            element.name != 'code'
    );
    if (props.readonly && !record?.spec?.source) {
        return null;
    }
    return (
        <>
            <FormLabel label={props.title} />
            <div style={{ display: 'flex', width: '100%' }}>
                <Grid container spacing={2}>
                    {(!readonly || record?.spec?.source?.lang) && (
                        <Grid item xs={12} sm={12} md={3}>
                            <div style={{ width: '100%' }} key={'lang'}>
                                {language.content}
                            </div>
                        </Grid>
                    )}
                    {(!readonly || record?.spec?.source?.handler) && (
                        <Grid item xs={12} sm={12} md={5}>
                            <div style={{ width: '100%' }} key={'handler'}>
                                {handler.content}
                            </div>
                        </Grid>
                    )}
                    {(!readonly || record?.spec?.source?.source) && (
                        <Grid item xs={12} sm={12} md={4}>
                            <div style={{ width: '100%' }} key={'source'}>
                                {source.content}
                            </div>
                        </Grid>
                    )}

                    {rest.map((element, index) => (
                        <Grid item xs={12} sm={12} md={12}>
                            <div style={{ width: '100%' }} key={index}>
                                {element.content}
                            </div>
                        </Grid>
                    ))}
                    {(!readonly || record?.spec?.source) && (
                        <Grid item xs={12} sm={12} md={12}>
                            <Editor
                                mode={lang}
                                source="spec.source"
                                theme="monokai"
                            />
                        </Grid>
                    )}
                </Grid>
            </div>
        </>
    );
};
