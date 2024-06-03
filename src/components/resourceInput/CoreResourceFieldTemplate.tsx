import { Grid } from '@mui/material';
import { ObjectFieldTemplateProps } from '@rjsf/utils';
import { ReactElement, JSXElementConstructor } from 'react';
import { useTranslate } from 'react-admin';
export const CoreResourceFieldTemplate = (props: ObjectFieldTemplateProps) => {
    const translate = useTranslate();
    function childrenTranslated(
        children: ReactElement<any, string | JSXElementConstructor<any>>
    ): import('react').ReactNode {
        const title = children.props.schema.title || '';
        const description = children.props.schema.description || '';
        children.props.schema.title = translate(title);
        children.props.schema.description = translate(description);
        return children;
    }
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
                            {childrenTranslated(element.content)}
                        </Grid>
                    </div>
                ))}
            </div>
        </>
    );
};
