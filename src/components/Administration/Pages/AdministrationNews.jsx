import { Add } from '@mui/icons-material'
import { Box, Button, CircularProgress, List } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import {
    useDeleteAnnouncementMutation,
    useGetAnnouncementsQuery,
    useUpdateAnnouncementMutation,
} from '../../../store/administration/services'
import { getUserInfo } from '../../../store/userInfo'
import { isNilOrEmpty } from '../../../utils'
import { AdministrationNewsListItem, AdministrationNewsNewAnnouncementDialog } from './components'

const AdministrationNews = () => {
    const { enqueueSnackbar } = useSnackbar()
    const { data: announcements, isFetching: isFetchingAnnouncements } = useGetAnnouncementsQuery()
    const [deleteAnnouncement] = useDeleteAnnouncementMutation()
    const [updateAnnouncement] = useUpdateAnnouncementMutation()
    const { email } = useSelector(getUserInfo)
    const [isCreationDialogOpen, setCreationDialogOpen] = useState(false)

    const handleToggleCreationDialog = () => setCreationDialogOpen((prevState) => !prevState)
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Jste si jisti, že chcete smazat toto oznámení? ')
        if (confirmDelete) {
            return await deleteAnnouncement(id)
                .unwrap()
                .then((payload) => {
                    if (payload) {
                        enqueueSnackbar('Oznámení bylo úspěšně vymazáno.', {
                            variant: 'success',
                        })
                        return payload
                    }
                })
                .catch(() =>
                    enqueueSnackbar('Nastala chyba při mazání vybranného oznámení!', { variant: 'error' })
                )
        }
    }
    const handleUpdate = async (updatedAnnouncement) =>
        await updateAnnouncement({ ...updatedAnnouncement, author: email })
            .unwrap()
            .then((payload) => {
                if (payload) {
                    enqueueSnackbar('Oznámení bylo úspěšně upraveno.', {
                        variant: 'success',
                    })
                    return payload
                }
            })
            .catch(() =>
                enqueueSnackbar('Nastala chyba při úpravě vybranného oznámení!', { variant: 'error' })
            )

    return (
        <Box sx={{ bgcolor: '#F9F9FB', borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button size="large" startIcon={<Add />} onClick={handleToggleCreationDialog}>
                Přidat nové oznámení
            </Button>
            {!isNilOrEmpty(announcements) && (
                <List sx={{ width: '100%', maxWidth: '100%' }}>
                    {announcements.map((announcement, index) => (
                        <AdministrationNewsListItem
                            key={announcement.id}
                            index={index}
                            onDelete={() => handleDelete(announcement.id)}
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
