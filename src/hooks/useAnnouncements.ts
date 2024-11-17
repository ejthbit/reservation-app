import { useSnackbar } from 'notistack'
import { useState } from 'react'
import useSWR from 'swr'
import axiosGynInstance from '../api/config'
import { Announcement } from '../types/Announcement'

const getAnnouncementsFetcher = async () =>
    await axiosGynInstance.get('configuration/getAnnouncements').then((res) => res.data)

export const useAnnouncements = () => {
    const { enqueueSnackbar } = useSnackbar()

    const [isSendingAnnouncementAction, setIsSendingAnnouncementAction] = useState(false)
    const {
        data: announcements,
        isLoading: isFetchingAnnouncements,
        error: getAnnouncementsError,
        mutate,
    } = useSWR<Announcement[]>(`configuration/getAnnouncements`, getAnnouncementsFetcher)

    const createAnnouncement = async (announcement: Announcement, onSuccess?: () => void) => {
        try {
            setIsSendingAnnouncementAction(true)
            await axiosGynInstance.post('administration/announcements/announcement', announcement)
            setIsSendingAnnouncementAction(false)
            mutate()
            onSuccess && onSuccess()
            enqueueSnackbar('Oznámení bylo úspěšně uloženo.', { variant: 'success' })
        } catch (error) {
            enqueueSnackbar('Nastala chyba při vytváření oznámení.', { variant: 'error' })
        }
    }

    const updateAnnouncement = async (editedAnnouncement: Announcement, onSuccess?: () => void) => {
        try {
            setIsSendingAnnouncementAction(true)
            await axiosGynInstance.put('administration/announcements/announcement', editedAnnouncement)
            setIsSendingAnnouncementAction(false)
            mutate()
            onSuccess && onSuccess()
            enqueueSnackbar('Oznámení bylo úspěšně uloženo.', { variant: 'success' })
        } catch (error) {
            enqueueSnackbar('Nastala chyba při úpravě oznámení.', { variant: 'error' })
        }
    }

    const deleteAnnouncement = async (announcementId: string, onSuccess?: () => void) => {
        try {
            setIsSendingAnnouncementAction(true)
            await axiosGynInstance.delete(`administration/announcements/announcement/${announcementId}`)
            setIsSendingAnnouncementAction(false)
            mutate()
            onSuccess && onSuccess()
            enqueueSnackbar('Oznámení bylo úspěšně smazáno.', { variant: 'success' })
        } catch (error) {
            enqueueSnackbar('Nastala chyba při mazání oznámení.', { variant: 'error' })
        }
    }

    return {
        announcements,
        isFetchingAnnouncements,
        isSendingAnnouncementAction,
        getAnnouncementsError,
        createAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
    }
}
