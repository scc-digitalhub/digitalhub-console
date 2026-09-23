import { useViewContributions } from './registry';

export const ExtensionsToolbarButtons = (props: {
    resource?: string;
    view?: 'list';
}) => {
    const { resource, view } = props;
    const contributions = useViewContributions({
        showIn: 'toolbar',
        resource,
        view,
    });

    return <>{contributions.map(c => c.element)}</>;
};