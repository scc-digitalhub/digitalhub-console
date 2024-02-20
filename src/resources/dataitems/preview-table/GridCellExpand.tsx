import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useRef, useState } from 'react';
import { useTranslate } from 'react-admin';
import { PreviewHelper } from './PreviewHelper';

interface GridCellExpandProps {
    value: any;
    width: number;
}

function isOverflown(element: Element): boolean {
    return (
        element.scrollHeight > element.clientHeight ||
        element.scrollWidth > element.clientWidth
    );
}

export const GridCellExpand = memo(function GridCellExpand(
    props: GridCellExpandProps
) {
    const { width, value: propsValue } = props;

    const translate = useTranslate();
    const isUnsupported = PreviewHelper.isUnsupportedValue(propsValue);
    const value = isUnsupported
        ? translate('resources.dataitem.preview.unsupported')
        : propsValue;

    const wrapper = useRef<HTMLDivElement | null>(null);
    const cellDiv = useRef(null);
    const cellValue = useRef(null);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [showFullCell, setShowFullCell] = useState(false);
    const [showPopper, setShowPopper] = useState(false);

    const handleMouseEnter = () => {
        const isCurrentlyOverflown = isOverflown(cellValue.current!);
        setShowPopper(isCurrentlyOverflown);
        setAnchorEl(cellDiv.current);
        setShowFullCell(true);
    };

    const handleMouseLeave = () => {
        setShowFullCell(false);
    };

    useEffect(() => {
        if (!showFullCell) {
            return undefined;
        }

        function handleKeyDown(nativeEvent: KeyboardEvent) {
            // IE11, Edge (prior to using Bink?) use 'Esc'
            if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
                setShowFullCell(false);
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [setShowFullCell, showFullCell]);

    return (
        <Box
            ref={wrapper}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{
                display: 'flex',
                alignItems: 'center',
                lineHeight: '24px',
                width: '100%',
                height: '100%',
                position: 'relative',
            }}
        >
            <Box
                ref={cellDiv}
                sx={{
                    height: '100%',
                    width,
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    left: '-10px',
                }}
            />
            <Box
                ref={cellValue}
                sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            >
                <span className="cellContent">{value}</span>
            </Box>
            {showPopper && (
                <Popper
                    open={showFullCell && anchorEl !== null}
                    anchorEl={anchorEl}
                    style={{ width, zIndex: 1 }}
                >
                    <Paper
                        elevation={1}
                        style={{ minHeight: wrapper.current!.offsetHeight - 3 }}
                    >
                        <Typography
                            variant="body2"
                            style={{
                                padding: 8,
                                overflowWrap: 'break-word',
                            }}
                        >
                            {value}
                        </Typography>
                    </Paper>
                </Popper>
            )}
        </Box>
    );
});
