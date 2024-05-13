import { Layout } from 'react-admin';
import { MyAppBar } from './MyAppBar';
import { MySidebar } from './MySidebar';

export const LayoutProjects = (props: any) => {
    return <Layout {...props} appBar={MyAppBar} sidebar={MySidebar} />;
};
