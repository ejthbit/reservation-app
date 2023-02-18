import PropTypes from 'prop-types'
import * as React from 'react'
import { IconButton, MenuItem, Menu } from '@mui/material'
import { Add, Delete, MoreVert } from '@mui/icons-material'
const ITEM_HEIGHT = 48
const AdministrationServicesEntryMenu = ({ onDelete, onAssign, disabled, disabledAdd }) => {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)

    const handleClick = (event) => setAnchorEl(event.currentTarget)

    const handleClose = () => setAnchorEl(null)

    return (
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVert />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '20ch',
                    },
                }}
            >
                <MenuItem onClick={onDelete} disableRipple disabled={disabled}>
                    <Delete />
                    Smazat
                </MenuItem>
                <MenuItem onClick={onAssign} disableRipple disabled={disabledAdd}>
                    <Add />
                    Přidat doktora
                </MenuItem>
            </Menu>
        </div>
    )
}

AdministrationServicesEntryMenu.propTypes = {
    onDelete: PropTypes.func,
    disabled: PropTypes.bool,
}

export default AdministrationServicesEntryMenu
