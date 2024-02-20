import { Sidebar } from 'react-admin';

export const MySidebar = props => (
    <Sidebar
        sx={{
            '& .RaSidebar-fixed': {
                height: '100vh',
            },
        }}
        {...props}
    />
);
