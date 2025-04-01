import { Button, SaveButton, Toolbar, useTranslate } from "react-admin";
import { useNavigate } from "react-router-dom";
import ClearIcon from '@mui/icons-material/Clear';

export const EditToolbar = () => {
    const translate = useTranslate();
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(-1);
    };

    return (
        <Toolbar sx={{ justifyContent: 'space-between' }}>
            <SaveButton />
            <Button
                color="info"
                label={translate('actions.cancel')}
                onClick={handleClick}
            >
                <ClearIcon />
            </Button>
        </Toolbar>
    );
};
