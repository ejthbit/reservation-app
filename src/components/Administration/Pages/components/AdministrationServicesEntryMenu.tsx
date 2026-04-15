import { Add, Delete, MoreVert } from '@mui/icons-material'
import { IconButton, Menu, MenuItem, PopoverVirtualElement } from '@mui/material'
import * as React from 'react'
const ITEM_HEIGHT = 48

type AdministrationServicesEntryMenuProps = {
    onDelete: React.MouseEventHandler<HTMLLIElement>
    onAssign: React.MouseEventHandler<HTMLLIElement>
    disabled: boolean
    disabledAdd: boolean
}

const AdministrationServicesEntryMenu = ({
    onDelete,
    onAssign,
    disabled,
    disabledAdd,
}: AdministrationServicesEntryMenuProps) => {
    const [anchorEl, setAnchorEl] = React.useState<
        Element | (() => Element) | PopoverVirtualElement | (() => PopoverVirtualElement) | null | undefined
    >(null)
    const open = Boolean(anchorEl)

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) =>
        setAnchorEl(event.currentTarget)

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
                    Smazat zaměstnance
                </MenuItem>
                <MenuItem onClick={onAssign} disableRipple disabled={disabledAdd}>
                    <Add />
                    Přidat zaměstnance
                </MenuItem>
            </Menu>
        </div>
    )
}

export default AdministrationServicesEntryMenu
