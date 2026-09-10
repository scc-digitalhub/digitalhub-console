// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import {
    createElement,
    ElementType,
    Fragment,
    ReactElement,
    ComponentPropsWithoutRef,
} from 'react';
import { useLocale, useRecordContext, useTranslate } from 'react-admin';
import { useGetSchemas } from '../../common/jsonSchema/schemaController';
import { ExtensionsField } from './components/Field';
import get from 'lodash/get';
import { useViewContributions } from './registry';
import { ConsoleViewName, ConsoleViewShowIn } from './ConsoleExtension';

export const useExtensions = <
    T extends ElementType,
    P extends object = ComponentPropsWithoutRef<T>,
>(props: {
    resource?: string;
    record?: any;
    source?: string;
    showIn: ConsoleViewShowIn;
    view: ConsoleViewName;
    component?: T;
}): ReactElement<P, T>[] => {
    const { source = 'extensions' } = props;
    const record = useRecordContext(props);
    const translate = useTranslate();
    const locale = useLocale();
    const { data: schemas, isLoading } = useGetSchemas('extensions');
    const elements = useViewContributions({
        showIn: props.showIn,
        resource: props.resource,
        view: props.view,
    });

    const value = get(record, source);

    if (!value || isLoading || !schemas) {
        return [];
    }

    const kinds = value.map((e: any) => e.kind);
    const tabs = Array.from(
        new Set(
            kinds.filter((k: string) =>
                schemas.find(s => s.kind === k && s.showIn == 'tabs')
            ) as string[]
        )
    );

    const Component = (props.component || Fragment) as T;
    const result: ReactElement<P, T>[] = [];

    //custom elements contributions
    if (elements && elements.length > 0) {
        elements.forEach((element, index) => {
            result.push(
                createElement(
                    Component,
                    {
                        key: 'custom-' + index,
                        value: 'custom-' + index,
                        label: element.key,
                    } as any,
                    element
                ) as ReactElement<P, T>
            );
        });
    }

    //json schema based extensions
    //TODO input field
    // const Field = props.view == 'create'  || props.view == 'edit' ? ExtensionsInput: ExtensionsField;
    const Field = ExtensionsField;

    tabs.forEach((k: string) => {
        const ts = schemas.find(s => s.kind === k) || {};
        const label =
            ts?.uiSchema?.['ui:title@' + locale] ||
            ts?.uiSchema?.['ui:title'] ||
            ts?.schema.title ||
            k;

        const tabRecord = {
            ...record,
            [source]: value.filter((e: any) => e.kind === k),
        };

        const field = createElement(Field, {
            source,
            record: tabRecord,
        });
        result.push(
            createElement(
                Component,
                { key: 'ext-' + k, value: k, label } as any,
                field
            ) as ReactElement<any, T>
        );
    });

    const restExtensions = value.filter((e: any) => !tabs.includes(e.kind));
    if (restExtensions.length > 0) {
        const restRecord = { ...record, [source]: restExtensions };
        const field = createElement(ExtensionsField, {
            source,
            record: restRecord,
        });
        result.push(
            createElement(
                Component,
                {
                    key: 'extensions',
                    value: 'extensions',
                    label: translate('fields.extensions.title'),
                } as any,
                field
            ) as ReactElement<any, T>
        );
    }

    return result;
};
