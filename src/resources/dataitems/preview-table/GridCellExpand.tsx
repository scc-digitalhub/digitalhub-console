import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';
import { GridColType, GridRenderCellParams } from '@mui/x-data-grid';
import { memo, useEffect, useRef, useState } from 'react';
import { InvalidFieldInfo, PreviewHelper, Type } from './PreviewHelper';
import { useTranslate } from 'react-admin';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Tooltip } from '@mui/material';

type ExpandableCellWrapperProps = {
    params: GridRenderCellParams<any>;
};

type ExpandableCellProps = {
    value: any;
    formattedValue: any;
    width: number;
    isContentInvalid: boolean;
    invalidityType: Type | null;
    type: GridColType | undefined;
};

type CellContentProps = Omit<ExpandableCellProps, 'width'> & {
    isCellContent?: boolean;
};

type InvalidCellContentProps = {
    value: any;
    invalidityType: Type | null;
    isCellContent: boolean;
};

type ValidCellContentProps = {
    formattedValue: any;
    type: GridColType | undefined;
};

function isOverflown(element: Element): boolean {
    return element.scrollWidth > element.clientWidth;
}

const InvalidContent = (props: InvalidCellContentProps) => {
    const { value, invalidityType, isCellContent } = props;
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
            {isCellContent && (
                <Tooltip title={label}>
                    <WarningAmberIcon />
                </Tooltip>
            )}
            <span className="cell-content">{value}</span>
        </Box>
    );
};

const ValidContent = (props: ValidCellContentProps) => {
    const { formattedValue, type } = props;

    const isBoolean =
        type && type === 'boolean' && typeof formattedValue === 'boolean';

    return (
        <>
            {isBoolean ? (
                <>
                    {formattedValue === true ? (
                        <CheckIcon sx={{ color: 'rgba(0, 0, 0, 0.6)' }} />
                    ) : (
                        <CloseIcon sx={{ color: 'rgba(0, 0, 0, 0.38)' }} />
                    )}
                </>
            ) : (
                <span className="cell-content">{formattedValue}</span>
            )}
        </>
    );
};

const Content = (props: CellContentProps) => {
    const {
        isContentInvalid,
        value,
        formattedValue,
        invalidityType,
        isCellContent = true,
        type,
    } = props;

    return (
        <>
            {isContentInvalid ? (
                <InvalidContent
                    value={value}
                    invalidityType={invalidityType}
                    isCellContent={isCellContent}
                />
            ) : (
                <ValidContent formattedValue={formattedValue} type={type} />
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
                    height: '24px',
                }}
            >
                <Content {...rest} />
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
                        style={{
                            minHeight: wrapper.current!.offsetHeight - 3,
                        }}
                    >
                        <Typography
                            variant="body2"
                            style={{
                                padding: 8,
                                overflowWrap: 'anywhere',
                            }}
                        >
                            <Content {...rest} isCellContent={false} />
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
        <ExpandableCell
            value={params.value}
            formattedValue={params.formattedValue}
            width={params.colDef.computedWidth}
            isContentInvalid={isContentInvalid}
            invalidityType={invalidityType}
            type={params.colDef.type}
        />
    );
};
