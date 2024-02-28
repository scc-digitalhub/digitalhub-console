import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { memo, useEffect, useRef, useState } from 'react';
import { InvalidFieldInfo, PreviewHelper, Type } from './PreviewHelper';
import { useTranslate } from 'react-admin';

type ExpandableCellWrapperProps = {
    params: GridRenderCellParams<any>;
};

type ExpandableCellProps = {
    value: any;
    formattedValue: string;
    width: number;
    isContentInvalid: boolean;
    invalidityType: Type | null;
};

type CellContentProps = Omit<ExpandableCellProps, 'width'> & {
    showIcon?: boolean;
};

type InvalidCellContentProps = {
    value: any;
    invalidityType: Type | null;
    showIcon: boolean;
};

type ValidCellContentProps = {
    formattedValue: string;
};

function isOverflown(element: Element): boolean {
    return (
        element.scrollHeight > element.clientHeight ||
        element.scrollWidth > element.clientWidth
    );
}

const InvalidCellContent = (props: InvalidCellContentProps) => {
    const { value, invalidityType, showIcon } = props;
    const translate = useTranslate();

    let label: string;
    switch (invalidityType) {
        case Type.InvalidDate:
            label = translate('resources.dataitem.preview.invalidDate');
            break;
        case Type.InvalidDatetime:
            label = translate('resources.dataitem.preview.invalidDatetime');
            break;
        default:
            label = translate('resources.dataitem.preview.invalidValue');
            break;
    }

    return (
        <Box display="flex" alignItems="center" gap={1}>
            {showIcon && <WarningAmberIcon />}
            <span className="cell-content">{value}</span>
        </Box>
    );
};

const ValidCellContent = (props: ValidCellContentProps) => {
    const { formattedValue } = props;

    return <span className="cell-content">{formattedValue}</span>;
};

const CellContent = (props: CellContentProps) => {
    const {
        isContentInvalid,
        value,
        formattedValue,
        invalidityType,
        showIcon = true,
    } = props;

    return (
        <>
            {isContentInvalid ? (
                <InvalidCellContent
                    value={value}
                    invalidityType={invalidityType}
                    showIcon={showIcon}
                />
            ) : (
                <ValidCellContent formattedValue={formattedValue} />
            )}
        </>
    );
};

const ExpandableCell = memo(function ExpandableCell(
    props: ExpandableCellProps
) {
    const { width, ...rest } = props;

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
                <CellContent {...rest} />
            </Box>

            {showPopper && (
                <Popper
                    open={showFullCell && anchorEl !== null}
                    //open={true}
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
                                overflowWrap: 'anywhere',
                            }}
                        >
                            <CellContent {...rest} showIcon={false} />
                        </Typography>
                    </Paper>
                </Popper>
            )}
        </Box>
    );
});

export const ExpandableCellWrapper = (props: ExpandableCellWrapperProps) => {
    const { params } = props;

    const isContentInvalid = PreviewHelper.isContentInvalid(
        params.row,
        params.field
    );
    const invalidityType = isContentInvalid
        ? params.row.invalidFieldsInfo?.find(
              (info: InvalidFieldInfo) => info.field === params.field
          )?.invalidityType
        : null;

    return (
        //TODO: remove "|| ''"
        <ExpandableCell
            value={params.value}
            formattedValue={params.formattedValue}
            width={params.colDef.computedWidth}
            isContentInvalid={isContentInvalid}
            invalidityType={invalidityType}
        />
    );
};
