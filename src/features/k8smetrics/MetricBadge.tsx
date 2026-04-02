import { Typography, SvgIconOwnProps } from '@mui/material';
import { Stack, StackProps, TypographyProps } from '@mui/system';
import { isValidElement, ReactElement } from 'react';

import CpuIcon from '@mui/icons-material/Memory';
import MemoryIcon from '@mui/icons-material/StackedBarChart';
import DiskIcon from '@mui/icons-material/Storage';
import GroupIcon from '@mui/icons-material/GroupWork';
import PodsIcon from '@mui/icons-material/ViewInAr';

import { useTranslate } from 'react-admin';

export const icons = {
    cpu: CpuIcon,
    memory: MemoryIcon,
    disk: DiskIcon,
    pods: PodsIcon,
    containers: GroupIcon,
};

const validSizes = ['inherit', 'small', 'medium', 'large'] as const;
function isStandardSize(size: any): size is (typeof validSizes)[number] {
    return validSizes.includes(size);
}

export const MetricBadge = (props: MetricProps) => {
    const {
        value,
        name: key,
        title,
        icon: iconProps,
        color = 'secondary',
        size = '64px',
        fontSize: fontSizeProp,
        direction = 'column',
        gap = 0,
        sx = {},
    } = props;
    const translate = useTranslate();
    const icon =
        iconProps && isValidElement(iconProps)
            ? iconProps
            : iconProps !== false && key
            ? (() => {
                  const IconComponent = Object.entries(icons).find(
                      ([k]) => k == key.toLowerCase()
                  )?.[1];
                  if (IconComponent) {
                      return (
                          <IconComponent
                              fontSize={isStandardSize(size) ? size : undefined}
                              color={color}
                              sx={
                                  isStandardSize(size) ? {} : { fontSize: size }
                              }
                          />
                      );
                  }
              })()
            : null;

    const fontSize = fontSizeProp
        ? fontSizeProp
        : isStandardSize(size)
        ? size
        : 'h6.fontSize';

    const titleElement =
        title && isValidElement(title) ? (
            title
        ) : typeof title === 'string' ? (
            <Typography variant="body1" color={color} sx={{ fontSize: '90%' }}>
                {translate(title)}
            </Typography>
        ) : null;

    return (
        <Stack
            direction={direction}
            gap={gap}
            sx={{ alignItems: 'center', textAlign: 'center', ...sx }}
        >
            {icon && isValidElement(icon) ? icon : null}
            <Typography fontSize={fontSize} color={color}>
                {value}
            </Typography>
            {titleElement}
        </Stack>
    );
};

export type MetricProps = {
    value: string | number | ReactElement;
    name?: string;
    title?: string | ReactElement | false;
    icon?: ReactElement | false;
    size?: SvgIconOwnProps['fontSize'] | string;
    fontSize?: TypographyProps['fontSize'];
} & Pick<SvgIconOwnProps, 'color'> &
    Pick<StackProps, 'direction' | 'gap' | 'sx'>;
