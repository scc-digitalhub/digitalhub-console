import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box, Paper, Popper, Tooltip, Typography } from '@mui/material';
import { GridColType, GridRenderCellParams } from '@mui/x-data-grid';
import { forwardRef, memo, useEffect, useRef, useState } from 'react';
import { useTranslate } from 'react-admin';
import { InvalidFieldInfo, PreviewHelper, Type } from './PreviewHelper';

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

type InvalidCellContentProps = {
    value: any;
    invalidityType: Type | null;
};

type ValidCellContentProps = {
    formattedValue: any;
    type: GridColType | undefined;
};

type PopperContentProps = {
    value: any;
    minHeight: number;
};

function isOverflown(element: Element): boolean {
    return element.scrollWidth > element.clientWidth;
}

const InvalidCellContent = forwardRef<
    HTMLParagraphElement,
    InvalidCellContentProps
>((props, ref) => {
    const { value, invalidityType } = props;
    const translate = useTranslate();

    let label: string;
    switch (invalidityType) {
        case Type.InvalidDate:
            label = translate('validation.invalidDate');
            break;
        case Type.InvalidDatetime:
            label = translate('validation.invalidDatetime');
            break;
        default:
            label = translate('validation.invalidValue');
            break;
    }

    return (
        <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{
                width: '100%',
            }}
        >
            <Tooltip title={label}>
                <WarningAmberIcon sx={{ zIndex: 2 }} />
            </Tooltip>

            <Typography
                ref={ref}
                variant="body2"
                className="cell-content"
                sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            >
                {value}
            </Typography>
        </Box>
    );
});
InvalidCellContent.displayName = 'InvalidCellContent';

const ValidCellContent = forwardRef<
    HTMLParagraphElement,
    ValidCellContentProps
>((props, ref) => {
    const { formattedValue, type } = props;
    const translate = useTranslate();

    const isBoolean =
        type && type === 'boolean' && typeof formattedValue === 'boolean';

    return (
        <>
            {isBoolean ? (
                <>
                    {formattedValue === true ? (
                        <Tooltip
                            title={translate('resources.dataitems.preview.true')}
                        >
                            <CheckIcon
                                sx={{ color: 'rgba(0, 0, 0, 0.6)', zIndex: 2 }}
                            />
                        </Tooltip>
                    ) : (
                        <Tooltip
                            title={translate(
                                'resources.dataitems.preview.false'
                            )}
                        >
                            <CloseIcon
                                sx={{ color: 'rgba(0, 0, 0, 0.38)', zIndex: 2 }}
                            />
                        </Tooltip>
                    )}
                </>
            ) : (
                <Typography
                    ref={ref}
                    variant="body2"
                    className="cell-content"
                    sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {formattedValue}
                </Typography>
            )}
        </>
    );
});
ValidCellContent.displayName = 'ValidCellContent';

const PopperContent = (props: PopperContentProps) => {
    const { value, minHeight } = props;

    return (
        <Paper
            elevation={4}
            sx={{
                minHeight: minHeight,
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <Typography
                variant="body2"
                sx={{
                    padding: 1.25,
                    overflowWrap: 'anywhere',
                }}
            >
                {value}
            </Typography>
        </Paper>
    );
};

const ExpandableCell = memo(function ExpandableCell(
    props: ExpandableCellProps
) {
    const {
        width,
        value,
        formattedValue,
        isContentInvalid,
        invalidityType,
        type,
    } = props;

    const cellWrapper = useRef<HTMLDivElement | null>(null);
    const popperDiv = useRef<HTMLDivElement | null>(null);
    const cellContent = useRef<HTMLDivElement | null>(null);
    const cellText = useRef<HTMLParagraphElement | null>(null);

    const [anchorEl, setanchorEl] = useState<null | HTMLElement>(null);
    const [showFullCell, setShowFullCell] = useState(false);
    const [showPopper, setShowPopper] = useState(false);

    const handleMouseEnter = () => {
        if (cellText && cellText.current) {
            const isCurrentlyOverflown = isOverflown(cellText.current);
            setShowPopper(isCurrentlyOverflown);
            setanchorEl(popperDiv.current);
            setShowFullCell(true);
        }
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
            ref={cellWrapper}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{
                width: '100%',
                height: '100%',
                position: 'relative',
                lineHeight: '24px',
            }}
        >
            <Box
                ref={popperDiv}
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
                ref={cellContent}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                }}
            >
                {isContentInvalid ? (
                    <InvalidCellContent
                        ref={cellText}
                        value={value}
                        invalidityType={invalidityType}
                    />
                ) : (
                    <ValidCellContent
                        ref={cellText}
                        formattedValue={formattedValue}
                        type={type}
                    />
                )}
            </Box>

            {showPopper && (
                <Popper
                    open={showFullCell && anchorEl !== null}
                    //open={true}
                    anchorEl={anchorEl}
                    sx={{ width, zIndex: 1 }}
                >
                    <PopperContent
                        value={isContentInvalid ? value : formattedValue}
                        minHeight={
                            cellWrapper && cellWrapper.current
                                ? cellWrapper.current.offsetHeight - 3
                                : 0
                        }
                    />
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
