import FileCopyIcon from '@mui/icons-material/FileCopy';
import { Button, ButtonProps } from 'react-admin';
import { useNavigate } from 'react-router-dom';

export const NewVersionButton = (props: ButtonProps) => {
    const navigate = useNavigate();
    const { label = 'buttons.newVersion', ...rest } = props;
    return (
        <Button label={label} onClick={() => navigate('update')} {...rest}>
            <FileCopyIcon />
        </Button>
    );
};
