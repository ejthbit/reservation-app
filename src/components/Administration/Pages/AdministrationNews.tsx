import { Add } from '@mui/icons-material'
import { Box, Button, CircularProgress, List } from '@mui/material'
import { useState } from 'react'
import { AdministrationNewsListItem, AdministrationNewsNewAnnouncementDialog } from './components'
import { useUser } from '../../../context/User/UserProvider'
import { useAnnouncements } from '../../../hooks'
import { Announcement } from '../../../types/Announcement'

const AdministrationNews = () => {
    const { announcements, isFetchingAnnouncements, deleteAnnouncement, updateAnnouncement } =
        useAnnouncements()

    const { email } = useUser()
    const [isCreationDialogOpen, setCreationDialogOpen] = useState(false)

    const handleToggleCreationDialog = () => setCreationDialogOpen((prevState) => !prevState)
    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm('Jste si jisti, že chcete smazat toto oznámení? ')
        if (confirmDelete) {
            return await deleteAnnouncement(id)
        }
    }
    const handleUpdate = async (
        updatedAnnouncement: Announcement,
        onSuccess: (payload: Announcement) => void,
    ) => await updateAnnouncement({ ...updatedAnnouncement, author: email! }, (payload) => onSuccess(payload))

    return (
        <Box sx={{ bgcolor: '#F9F9FB', borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button size="large" startIcon={<Add />} onClick={handleToggleCreationDialog}>
                Přidat nové oznámení
            </Button>
            {announcements && (
                <List sx={{ width: '100%', maxWidth: '100%' }}>
                    {announcements?.map((announcement, index) => (
                        <AdministrationNewsListItem
                            key={announcement.id}
                            index={index}
                            onDelete={() => handleDelete(announcement.id!)}
                            onUpdate={handleUpdate}
                            {...announcement}
                        />
                    ))}
                </List>
            )}
            {isFetchingAnnouncements && <CircularProgress />}
            <AdministrationNewsNewAnnouncementDialog
                onClose={handleToggleCreationDialog}
                open={isCreationDialogOpen}
            />
        </Box>
    )
}

export default AdministrationNews
