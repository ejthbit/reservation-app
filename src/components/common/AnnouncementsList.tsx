import { Box, CircularProgress, List, ListItem, ListItemText } from '@mui/material'
import { useMemo } from 'react'
import { useAnnouncements } from '../../hooks'
import { isNilOrEmpty } from '../../utils'

const AnnouncementsList = ({ width = '100%' }) => {
    const { announcements, isFetchingAnnouncements } = useAnnouncements()

    const enabledAnnouncements = useMemo(
        () => announcements?.filter(({ enabled }) => enabled),
        [announcements],
    )
    if (!enabledAnnouncements) {
        return null
    }

    return (
        <Box sx={{ bgcolor: 'rgb(244, 196, 204)', m: 'auto', width, position: 'relative' }}>
            {isFetchingAnnouncements && <CircularProgress />}
            {!isNilOrEmpty(enabledAnnouncements) && (
                <List sx={{ width: '100%' }}>
                    {enabledAnnouncements?.map(({ id, description = '' }) => (
                        <ListItem key={id}>
                            <ListItemText
                                secondary={<div dangerouslySetInnerHTML={{ __html: description }} />}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    )
}

AnnouncementsList.propTypes = {}

export default AnnouncementsList
