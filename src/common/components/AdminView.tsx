import { usePermissions, LoadingIndicator, AccessDenied } from 'react-admin';
import { ComponentType, isValidElement, ReactElement } from 'react';
import { isValidElementType } from 'react-is';

export const AdminView = (props: {
    children: ComponentType<any> | ReactElement;
}) => {
    const { children } = props;
    const { isPending, permissions } = usePermissions();

    if (isPending) {
        return <LoadingIndicator />;
    }

    return permissions?.find(r => r === 'ROLE_ADMIN') ? (
        getElement(children)
    ) : (
        <AccessDenied />
    );
};

const getElement = (Child: ComponentType<any> | ReactElement) => {
    if (isValidElement(Child)) {
        return Child;
    }

    if (isValidElementType(Child)) {
        const Element = Child as ComponentType<any>;
        return <Element />;
    }

    return null;
};
