import { Layout } from 'react-admin';
import { MyAppBar } from './MyAppBar';
import { MyMenu } from './MyMenu';
import { MySidebar } from './MySidebar';

export const MyLayout = (props: any) => {
    return (
        <Layout
            {...props}
            appBar={MyAppBar}
            menu={MyMenu}
            sidebar={MySidebar}
            sx={{
                '& .RaLayout-content': {
                    px: 0,
                },
            }}
        />
    );
};
