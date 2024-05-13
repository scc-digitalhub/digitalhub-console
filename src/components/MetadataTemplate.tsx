import { ObjectFieldTemplateProps } from '@rjsf/utils';
import { FormLabel } from './FormLabel';
import { Grid } from '@mui/material';

export const MetadataTemplate = (props: ObjectFieldTemplateProps) => {
    const name: any = props.properties.find(element => element.name == 'name');
    const version: any = props.properties.find(
        element => element.name == 'version'
    );
    const updated: any = props.properties.find(
        element => element.name == 'updated'
    );
    console.log(props.properties);
    const rest = props.properties.filter(
        element =>
            !element.hidden &&
            element.name != 'name' &&
            element.name != 'version' &&
            element.name != 'updated'
    );
    return (
        <>
            <FormLabel label={props.title} />
            <div style={{ display: 'flex', width: '100%' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={5}>
                        <div style={{ width: '100%' }} key={'name'}>
                            {name.content}
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <div style={{ width: '100%' }} key={'version'}>
                            {version.content}
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3}>
                        <div style={{ width: '100%' }} key={'updated'}>
                            {updated.content}
                        </div>
                    </Grid>

                    {rest.map((element, index) => (
                        <Grid item xs={12} sm={12} md={12}>
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
