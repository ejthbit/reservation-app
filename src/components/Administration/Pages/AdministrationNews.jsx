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

const mockData = [
    {
        created_at: '2023-02-26 12:00:00:000',
        id: 1,
        author: 123,
        enabled: true,
        name: 'Object 1',
        description: 'This is the first object',
    },
    {
        created_at: '2023-02-26 12:05:00:000',
        id: 2,
        author: 456,
        enabled: false,
        name: 'Object 2',
        description: 'This is the second object',
    },
    {
        created_at: '2023-02-26 12:10:00:000',
        id: 3,
        author: 789,
        enabled: true,
        name: 'Object 3',
        description: 'This is the third object',
    },
    {
        created_at: '2023-02-26 12:15:00:000',
        id: 4,
        author: 123,
        enabled: true,
        name: 'Object 4',
        description: 'This is the fourth object',
    },
    {
        created_at: '2023-02-26 12:20:00:000',
        id: 5,
        author: 456,
        enabled: false,
        name: 'Object 5',
        description: 'This is the fifth object',
    },
    {
        created_at: '2023-02-26 12:25:00:000',
        id: 6,
        author: 789,
        enabled: false,
        name: 'Object 6',
        description: 'This is the sixth object',
    },
    {
        created_at: '2023-02-26 12:30:00:000',
        id: 7,
        author: 123,
        enabled: false,
        name: 'Object 7',
        description: 'This is the seventh object',
    },
    {
        created_at: '2023-02-26 12:35:00:000',
        id: 8,
        author: 456,
        enabled: false,
        name: 'Object 8',
        description: 'This is the eighth object',
    },
    {
        created_at: '2023-02-26 12:40:00:000',
        id: 9,
        author: 789,
        enabled: false,
        name: 'Object 9',
        description: 'This is the ninth object',
    },
    {
        created_at: '2023-02-26 12:45:00:000',
        id: 10,
        author: 123,
        enabled: false,
        name: 'Object 10',
        description: 'This is the tenth object',
    },
]

const AdministrationNews = () => {
    const { enqueueSnackbar } = useSnackbar()
    const { data: announcements, isFetching: isFetchingAnnouncements } = useGetAnnouncementsQuery()
    const [deleteAnnouncement, { isFetching: isDeleting }] = useDeleteAnnouncementMutation()
    const [updateAnnouncement, { isFetching: isUpdating }] = useUpdateAnnouncementMutation()
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
