// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler

// SPDX-License-Identifier: Apache-2.0
/* eslint-disable react/prop-types */
import {
    type ChangeEvent,
    Children,
    cloneElement,
    isValidElement,
    type ReactElement,
    type ReactNode,
    useState,
} from 'react';
import { ResponsiveStyleValue } from '@mui/system';
import { styled, useThemeProps } from '@mui/material/styles';
import { Divider, Tabs } from '@mui/material';
import { Outlet, Routes, Route } from 'react-router-dom';
import {
    useRecordContext,
    OptionalRecordContextProvider,
    TabbedShowLayoutClasses,
    TabbedShowLayoutTabs as DefaultTabs,
    TabbedShowLayout as StandardTabbedShowLayout,
    TabbedShowLayoutProps,
} from 'react-admin';

export const CustomTabbedShowLayout = (inProps: TabbedShowLayoutProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });

    const {
        children,
        className,
        spacing,
        divider,
        syncWithLocation = false,
        tabs = <DefaultTabs />,
        value,
        ...rest
    } = props;

    const record = useRecordContext(props);

    const nonNullChildren = Children.toArray(children).filter(
        child => child !== null && isValidElement(child)
    ) as ReactElement<{
        context?: string;
        spacing?: ResponsiveStyleValue<number | string>;
        divider?: ReactNode;
        value?: string | number;
        label?: string;
        syncWithLocation?: boolean;
    }>[];

    const getTabValue = (tab: ReactElement, index: number) => {
        return tab.props.value ?? tab.props.label ?? index;
    };

    const [tabValue, setTabValue] = useState(() => {
        return nonNullChildren.length > 0
            ? String(value ?? getTabValue(nonNullChildren[0], 0))
            : String(value ?? 0);
    });

    if (!syncWithLocation && nonNullChildren.length > 0) {
        const currentTabStillExists = nonNullChildren.some(
            (tab, index) => String(getTabValue(tab, index)) === tabValue
        );
        if (!currentTabStillExists) {
            setTabValue(String(getTabValue(nonNullChildren[0], 0)));
        }
    }

    const handleTabChange = (event: ChangeEvent<{}>, newValue: any): void => {
        if (!syncWithLocation) {
            setTabValue(newValue);
        }
    };

    if (!record) {
        return null;
    }

    const renderTabHeaders = () => {
        if (syncWithLocation) {
            return cloneElement(
                tabs,
                {
                    onChange: handleTabChange,
                    syncWithLocation,
                    value: tabValue,
                },
                nonNullChildren
            );
        }

        return (
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
            >
                {nonNullChildren.map((tab, index) =>
                    cloneElement(tab, {
                        context: 'header',
                        value: getTabValue(tab, index),
                        syncWithLocation: false,
                    })
                )}
            </Tabs>
        );
    };

    return (
        <OptionalRecordContextProvider value={record}>
            <Root className={className} {...sanitizeRestProps(rest)}>
                {syncWithLocation ? (
                    <Routes>
                        <Route
                            path="/*"
                            element={
                                <>
                                    {renderTabHeaders()}
                                    <Divider />
                                    <div
                                        className={
                                            TabbedShowLayoutClasses.content
                                        }
                                    >
                                        <Outlet />
                                    </div>
                                </>
                            }
                        ></Route>
                    </Routes>
                ) : (
                    <>
                        {renderTabHeaders()}
                        <Divider />
                        <div className={TabbedShowLayoutClasses.content}>
                            {Children.map(nonNullChildren, (tab, index) => {
                                const currentTabVal = getTabValue(tab, index);
                                if (
                                    !isValidElement(tab) ||
                                    tabValue !== currentTabVal
                                ) {
                                    return null;
                                }
                                return cloneElement(tab, {
                                    context: 'content',
                                    spacing,
                                    divider,
                                });
                            })}
                        </div>
                    </>
                )}
            </Root>
        </OptionalRecordContextProvider>
    );
};

CustomTabbedShowLayout.Tab = StandardTabbedShowLayout.Tab;

const PREFIX = 'RaTabbedShowLayout';

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    flex: 1,
    [`& .${TabbedShowLayoutClasses.content}`]: {
        padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    },
}));

const sanitizeRestProps = (props: any) => {
    const {
        record,
        resource,
        initialValues,
        staticContext,
        translate,
        ...rest
    } = props;

    void record;
    void resource;
    void initialValues;
    void staticContext;
    void translate;

    return rest;
};
