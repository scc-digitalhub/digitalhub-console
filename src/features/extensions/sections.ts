// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { ReactElement } from 'react';
import { useExtensions } from './extensions';
import { Section } from '../../common/components/layout/Section';

export const useExtensionsSections = (
    props: {
        resource?: string;
        record?: any;
        source?: string;
    } = {}
): ReactElement<any, typeof Section>[] => {
    const elements = useExtensions({
        resource: props.resource,
        record: props.record,
        source: props.source,
        showIn: 'section',
        view: 'edit',
        component: Section,
    });

    return elements;
};
