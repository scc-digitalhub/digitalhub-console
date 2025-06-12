// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { ObjectFieldTemplateProps } from '@rjsf/utils';
import { ReactElement, JSXElementConstructor } from 'react';
import { useTranslate } from 'react-admin';

export const VolumeResourceFieldTemplate = (
    props: ObjectFieldTemplateProps
) => {
    function childrenTranslated(
        children: ReactElement<any, string | JSXElementConstructor<any>>
    ): import('react').ReactNode {
        const title = children.props.schema.title || '';
        const description = children.props.schema.description || '';
        children.props.schema.title = translate(title);
        children.props.schema.description = translate(description);
        return children;
    }
    const translate = useTranslate();
    const titleText = props.title || '';
    return (
        <>
            <div style={{ display: 'flex', width: '100%' }}>
                <h3 style={{ width: '100%', textAlign: 'center' }}>
                    {translate(titleText)}
                </h3>
            </div>
            <div style={{ display: 'flex', width: '100%' }}>
                {props.properties.map(element =>
                    element.name != 'spec' ? (
                        <div style={{ width: '100%', margin: '8px' }}>
                            {childrenTranslated(element.content)}
                        </div>
                    ) : (
                        <></>
                    )
                )}
            </div>
            <div style={{ display: 'flex', width: '100%' }}>
                {props.properties.map(element =>
                    element.name == 'spec' ? (
                        <div style={{ width: '100%', margin: '8px' }}>
                            {childrenTranslated(element.content)}
                        </div>
                    ) : (
                        <></>
                    )
                )}
            </div>
        </>
    );
};
