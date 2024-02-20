import { ButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';

export const RowButtonGroup = styled(ButtonGroup, {
    name: 'RaRowButtonGroup',
    overridesResolver: (props, styles) => styles.root,
})({
    '&.MuiButtonGroup-root': {
        display: 'flex',
        justifyContent: 'end',
    },
});
