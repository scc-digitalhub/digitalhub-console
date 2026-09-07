import { useViewContributions } from './registry';

export const ExtensionsToolbarButtons = (props: {
    resource?: string;
    view?: 'list';
}) => {
    const { resource, view } = props;
    const elements = useViewContributions({
        showIn: 'toolbar',
        resource,
        view,
    });

    if (!elements.length) {
        return null;
    }

    return <>{elements}</>;
};
