import { Grid } from '@mui/material';
import { ObjectFieldTemplateProps } from '@rjsf/utils';
import { useTranslate } from 'react-admin';
export const CoreResourceFieldTemplate = (props: ObjectFieldTemplateProps) => {
    const translate = useTranslate();
    return (
        <>
            <div style={{ display: 'flex', width: '100%' }}>
                <h3
                    style={{
                        width: '100%',
                        textAlign: 'left',
                        margin: '4px 0px',
                    }}
                >
                    {translate(props.title)}
                </h3>
            </div>
            <div style={{ display: 'flex', width: '100%' }}>
                {props.properties.map((element, index) => (
                    <div style={{}} key={index}>
                        <Grid container spacing={0}>
                            {element.content}
                        </Grid>
                    </div>
                ))}
            </div>
        </>
    );
};
