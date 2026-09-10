// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { ComponentPropsWithoutRef, ReactElement } from 'react';
import { useExtensions } from './extensions';
import { StepperForm } from '@dslab/ra-stepper';

export const useExtensionsSteps = (
    props: {
        resource?: string;
        record?: any;
        source?: string;
    } = {}
): ReactElement<
    ComponentPropsWithoutRef<typeof StepperForm.Step>,
    typeof StepperForm.Step
>[] => {
    const elements = useExtensions({
        resource: props.resource,
        record: props.record,
        source: props.source,
        showIn: 'tab',
        view: 'create',
        component: StepperForm.Step,
    });

    return elements;
};
