import { ObjectFieldTemplateProps } from '@rjsf/utils';

export const KeyValueFieldTemplate = (props: ObjectFieldTemplateProps) => {
    return (
        <>
            {props.title && (
                <div style={{ display: 'flex', width: '100%' }}>
                    <h3 style={{ width: '100%', textAlign: 'center' }}>
                        {props.title}
                    </h3>
                </div>
            )}
            <div style={{ display: 'flex', width: '100%' }}>
                {props.properties.map((element, index) => (
                    <div
                        style={{ width: '100%', margin: '0px 8px' }}
                        key={index}
                    >
                        {element.content}
                    </div>
                ))}
            </div>
        </>
    );
};
