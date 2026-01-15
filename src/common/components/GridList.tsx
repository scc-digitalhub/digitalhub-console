// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';
import { Grid, GridProps, styled } from '@mui/material';
import {
    sanitizeListRestProps,
    useListContext,
    useResourceContext,
    RaRecord,
    RecordContextProvider,
    RecordRepresentation,
    useCreatePath,
} from 'ra-core';

import { CreateButton, LinearProgress, Link } from 'react-admin';

const stopPropagation = e => e.stopPropagation();

export const GridList = (props: GridListProps) => {
    const {
        className,
        children,
        component = defaultComponent,
        create = false,
        empty,
        createPos = 'end',
        linkType = 'show',
        spacing = 2,
        direction = 'row',
        ...rest
    } = props;
    const { data, total, isLoading } = useListContext();
    const resource = useResourceContext(props);
    const createPath = useCreatePath();

    if (isLoading === true) {
        return <LinearProgress />;
    }

    if (data == null || data.length === 0 || total === 0) {
        if (empty) {
            return empty;
        }

        return null;
    }

    const createChildren =
        typeof create === 'boolean' ? createComponent : create;
    const createElement = React.cloneElement(component, {}, createChildren);

    return (
        <Root
            container
            spacing={spacing}
            direction={direction}
            className={className}
            {...sanitizeListRestProps(rest)}
        >
            {create && createPos == 'start' && createElement}

            {data.map((record, rowIndex) => {
                const resourceLinkPath = !linkType
                    ? false
                    : createPath({
                          resource,
                          type: linkType,
                          id: record.id,
                      });

                const content = resourceLinkPath ? (
                    <Link
                        className={GridListClasses.link}
                        to={resourceLinkPath}
                        onClick={stopPropagation}
                    >
                        {children || <RecordRepresentation />}
                    </Link>
                ) : children ? (
                    children
                ) : (
                    <RecordRepresentation />
                );

                return (
                    <RecordContextProvider
                        value={record}
                        key={record.id ?? `row${rowIndex}`}
                    >
                        {React.cloneElement(component, {}, content)}
                    </RecordContextProvider>
                );
            })}

            {create && createPos == 'end' && createElement}
        </Root>
    );
};

export interface GridListProps<RecordType extends RaRecord = any>
    extends Omit<GridProps, 'component'> {
    className?: string;
    component?: React.ReactElement<
        any,
        string | React.JSXElementConstructor<any>
    >;
    create?: React.ReactElement | boolean;
    empty?: React.ReactElement;
    linkType?: string | false;
    createPos?: 'start' | 'end';
    children?: React.ReactNode;
    // can be injected when using the component without context
    data?: RecordType[];
    total?: number;
    loaded?: boolean;
}

const PREFIX = 'RaSingleFieldList';

export const GridListClasses = {
    link: `${PREFIX}-link`,
};

const Root = styled(Grid, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${GridListClasses.link}`]: {
        textDecoration: 'none',
        '& > *': {
            color: theme.palette.primary.main,
        },
    },
}));

const defaultComponent = <Grid size={3} />;
const createComponent = <CreateButton />;
