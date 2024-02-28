import { Box } from '@mui/material';
import { useTranslate } from 'react-admin';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export const PreviewHeaderCell = (props: {
    columnDescriptor: any;
    isUnsupportedColumn?: boolean;
}) => {
    const { columnDescriptor, isUnsupportedColumn = false } = props;
    const typeLabel = `(${columnDescriptor.type.toUpperCase()})`;
    const translate = useTranslate();

    return (
        <Box
            display="grid"
            gridTemplateRows={isUnsupportedColumn ? '16px 16px 32px' : '16px 16px'}
            lineHeight="16px"
            gap="6px"
            width="100%"
        >
            <span
                style={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    fontWeight: 'bold',
                }}
            >
                {columnDescriptor.name}
            </span>
            <span
                style={{
                    opacity: 0.6,
                    fontSize: '12px',
                }}
            >
                {typeLabel}
            </span>

            {isUnsupportedColumn && (
                <Box
                    display="flex"
                    alignItems="center"
                    sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    }}
                    p={0.5}
                    width="fit-content"
                    justifySelf="center"
                    gap={0.5}
                >
                    <WarningAmberIcon />
                    <span
                        style={{
                            fontWeight: 'bold',
                        }}
                    >
                        {translate(
                            'resources.dataitem.preview.unsupportedField'
                        )}
                    </span>
                </Box>
            )}
        </Box>
    );
};
