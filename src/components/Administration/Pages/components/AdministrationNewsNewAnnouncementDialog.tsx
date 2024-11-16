import { yupResolver } from '@hookform/resolvers/yup'
import { Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useUser } from 'src/context/User/UserProvider'
import { useAnnouncements } from 'src/hooks'
import { Announcement } from 'src/types/Announcement'
import * as yup from 'yup'
import { DialogButtons, FormInput } from '../../../common'
const AdministrationNewsNewAnnouncementDialog = ({
    open,
    onClose,
}: {
    open: boolean
    onClose: () => void
}) => {
    const { email } = useUser()

    const { createAnnouncement, isSendingAnnouncementAction: isCreatingAnnouncement } = useAnnouncements()
    const {
        handleSubmit,
        control,
        reset,
        formState: { isDirty, isValid },
    } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        resolver: yupResolver(
            yup.object({
                name: yup.string().required(),
                description: yup.string().required(),
            }),
        ),
        defaultValues: {
            name: '',
            description: '',
            enabled: false,
        },
    })

    const handleClose = () => {
        reset()
        onClose()
    }

    const onCreate = async (announcementValues: Omit<Announcement, 'author' | 'id'>) => {
        await createAnnouncement(
            {
                ...announcementValues,
                author: email!,
            },
            onClose,
        )
    }

    return (
        open && (
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle id="form-dialog-title">Vytvořit nové oznámení</DialogTitle>
                <DialogContent sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                    <FormInput
                        name="name"
                        label="Jméno"
                        placeholder="Zadejte prosím název oznámení"
                        control={control}
                        fullWidth
                        required
                    />
                    <FormInput
                        label="Text"
                        placeholder="Text"
                        control={control}
                        name="description"
                        multiline
                        rows={5}
                        fullWidth
                        required
                    />
                </DialogContent>
                {isCreatingAnnouncement ? (
                    <LinearProgress />
                ) : (
                    <DialogActions>
                        <DialogButtons
                            onSecondaryClick={onClose}
                            secondaryLabel="Zavřit"
                            primaryLabel="Vytvořit nové oznámení"
                            onPrimaryClick={handleSubmit(onCreate)}
                            disabledPrimary={!isDirty || !isValid}
                        />
                    </DialogActions>
                )}
            </Dialog>
        )
    )
}

export default AdministrationNewsNewAnnouncementDialog
