import React from 'react'
import PropTypes from 'prop-types'
import { equals, map } from 'ramda'
import { Link, useNavigate } from 'react-router-dom'
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useDispatch } from 'react-redux'

const AdministrationDrawerListItems = ({ arrayOfItems, selectedItem, isOpen, setSelectedItem }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    return (
        <List disablePadding>
            {map(
                ({ id, icon, text, link, disabled, onClick }) => (
                    <ListItem key={text} disablePadding title={text}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: isOpen ? 'initial' : 'center',
                                px: 2.5,
                            }}
                            disabled={disabled}
                            selected={equals(id, selectedItem)}
                            component={Link}
                            to={link}
                            onClick={() => {
                                setSelectedItem(id)
                                onClick && onClick(dispatch, navigate)
                            }}
                        >
                            <ListItemIcon
                                sx={(theme) => ({
                                    minWidth: 0,
                                    mr: isOpen ? 2 : 'auto',
                                    justifyContent: 'center',
                                    '& svg': {
                                        fill: theme.palette.primary.main,
                                    },
                                })}
                            >
                                {icon}
                            </ListItemIcon>
                            {isOpen && (
                                <ListItemText
                                    primary={text}
                                    sx={{
                                        fontWeight: equals(id, selectedItem) ? '700' : '400',
                                    }}
                                />
                            )}
                        </ListItemButton>
                    </ListItem>
                ),
                arrayOfItems
            )}
        </List>
    )
}

AdministrationDrawerListItems.propTypes = {}

export default AdministrationDrawerListItems
