import { Box, CircularProgress, List, ListItem, ListItemText, ListSubheader } from '@mui/material'
import { useMemo } from 'react'
import { isNilOrEmpty } from '../../utils'
import { useAnnouncements } from '../../hooks'

const AnnouncementsList = ({ width = '100%' }) => {
    const { announcements, isFetchingAnnouncements } = useAnnouncements()

    const enabledAnnouncements = useMemo(
        () => announcements?.filter(({ enabled }) => enabled),
        [announcements],
    )

    return (
        <Box sx={{ bgcolor: 'rgba(255,192,203, 0.5)', m: 'auto', borderRadius: 6, width }}>
            {isFetchingAnnouncements && <CircularProgress />}
            {!isNilOrEmpty(enabledAnnouncements) && (
                <List
                    sx={{ width: '100%' }}
                    subheader={
                        <ListSubheader sx={{ bgcolor: 'transparent', borderRadius: 6 }}>
                            Oznámení
                        </ListSubheader>
                    }
                >
                    {enabledAnnouncements?.map(({ id, name, description }) => (
                        <ListItem key={id}>
                            <ListItemText primary={name} secondary={description} />
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    )
}

AnnouncementsList.propTypes = {}

export default AnnouncementsList
