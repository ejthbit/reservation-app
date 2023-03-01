import { Box, CircularProgress, List, ListItem, ListItemText, ListSubheader, Typography } from '@mui/material'
import { useMemo } from 'react'
import { useGetAnnouncementsQuery } from '../../store/administration/services'
import { isNilOrEmpty } from '../../utils'

const AnnouncementsList = () => {
    const { data: announcements, isFetching: isFetchingAnnouncements } = useGetAnnouncementsQuery()

    const enabledAnnouncements = useMemo(
        () => announcements?.filter(({ enabled }) => enabled),
        [announcements]
    )

    return (
        <Box sx={{ bgcolor: '#F9F9FB', m: 2, borderRadius: 4 }}>
            {isFetchingAnnouncements && <CircularProgress />}
            {!isNilOrEmpty(enabledAnnouncements) && (
                <List
                    sx={{ width: '100%' }}
                    subheader={<ListSubheader sx={{ bgcolor: '#F9F9FB' }}>Aktuality</ListSubheader>}
                >
                    {enabledAnnouncements.map(({ id, name, description }) => (
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
