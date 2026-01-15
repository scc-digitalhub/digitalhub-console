// SPDX-FileCopyrightText: © 2025 DSLab - Fondazione Bruno Kessler
//
// SPDX-License-Identifier: Apache-2.0

import { Menu, MenuItem, Button } from '@mui/material';
import { Box } from '@mui/system';
import { useState, MouseEvent } from 'react';
import {
    useTranslate,
    useCreatePath,
    useGetResourceLabel,
    Button as RaButton,
} from 'react-admin';
import { Link } from 'react-router-dom';
import { ResourceIcon } from '../../../components/ResourceIcon';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentAdd from '@mui/icons-material/Add';

export const CreateDropDownButton = (props: { resources: string[] }) => {
    const { resources } = props;
    const translate = useTranslate();
    const createPath = useCreatePath();
    const getResourceLabel = useGetResourceLabel();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleOpen = (event: MouseEvent<HTMLElement>): void => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (): void => {
        setAnchorEl(null);
    };

    return (
        <Box className="CreateDropDownMenu" component="span">
            <Box>
                <Button
                    color="primary"
                    variant="contained"
                    aria-controls="simple-menu"
                    aria-label=""
                    aria-haspopup="true"
                    onClick={handleOpen}
                    startIcon={<ContentAdd />}
                    endIcon={<ExpandMoreIcon fontSize="small" />}
                >
                    {translate('ra.action.create')}
                </Button>
            </Box>
            <Menu
                id="root-selector-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {resources?.map(res => (
                    <MenuItem key={res}>
                        <RaButton
                            label={getResourceLabel(res, 1)}
                            to={createPath({ resource: res, type: 'create' })}
                            component={Link}
                        >
                            <ResourceIcon resource={res} />
                        </RaButton>
                    </MenuItem>
                ))}
            </Menu>
        </Box>
    );
};
