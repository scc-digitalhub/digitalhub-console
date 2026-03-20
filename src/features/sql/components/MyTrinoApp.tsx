import { useMemo } from 'react';
import { QueryEditor } from 'trino-query-ui';
import trinoStyles from 'trino-query-ui/dist/index.css?inline';
import { Container } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import { PageTitle } from '../../../common/components/layout/PageTitle';
import { FlatCard } from '../../../common/components/layout/FlatCard';
import { scopeCss } from '../utils';

const EDITOR_SCOPE_CLASS = 'sql-editor-scope';
const MyTrinoApp = () => {
    const scopedStyles = useMemo(
        () => scopeCss(trinoStyles, EDITOR_SCOPE_CLASS),
        []
    );

    return (
        <Container
            maxWidth={false}
            disableGutters
            sx={{
                pb: 2,
                overflowX: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
            }}
        >
            <PageTitle
                text="SQL Editor"
                secondaryText="Query your data with Trino"
                icon={<StorageIcon fontSize="large" />}
            />

            <FlatCard
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    p: 0,
                    width: '100%',
                    overflow: 'hidden',
                    height: 'calc(100vh - 120px)',
                    minHeight: '400px',
                }}
            >
                <style>{scopedStyles}</style>
                <div
                    className={EDITOR_SCOPE_CLASS}
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <QueryEditor theme="dark" />
                </div>
            </FlatCard>
        </Container>
    );
};

export default MyTrinoApp;
