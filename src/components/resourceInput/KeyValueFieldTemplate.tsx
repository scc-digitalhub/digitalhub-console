import { ObjectFieldTemplateProps } from '@rjsf/utils';
import { ReactElement, JSXElementConstructor } from 'react';
import { useTranslate } from 'react-admin';

export const KeyValueFieldTemplate = (props: ObjectFieldTemplateProps) => {
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
    const titleText = props.title || '';
    return (
        <>
            {props.title && (
                <div style={{ display: 'flex', width: '100%' }}>
                    <h3 style={{ width: '100%', textAlign: 'center' }}>
                        {translate(titleText)}
                    </h3>
                </div>
            )}
            <div style={{ display: 'flex', width: '100%' }}>
                {props.properties.map((element, index) => (
                    <div
                        style={{ width: '100%', margin: '0px 8px' }}
                        key={index}
                    >
                        {childrenTranslated(element.content)}
                    </div>
                ))}
            </div>
        </>
    );
};
