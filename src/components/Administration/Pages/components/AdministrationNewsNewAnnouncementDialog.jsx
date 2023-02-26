import PropTypes from 'prop-types'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress } from '@mui/material'
import { DialogButtons, FormInput } from '../../../common'
import { isSuccess } from '../../../../utils'
import { useSnackbar } from 'notistack'
import { useCreateAnnouncementMutation } from '../../../../store/administration/services'
import { useSelector } from 'react-redux'
import { getUserInfo } from '../../../../store/userInfo'
const AdministrationNewsNewAnnouncementDialog = ({ open, onClose }) => {
    const { enqueueSnackbar } = useSnackbar()
    const { email } = useSelector(getUserInfo)

    const [createAnnouncement, { isFetching: isCreatingAnnouncement }] = useCreateAnnouncementMutation()
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
            })
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

    const onCreate = async (announcementValues) => {
        await createAnnouncement({
            ...announcementValues,
            author: email,
        })
            .unwrap()
            .then((payload) => {
                if (isSuccess(payload)) {
                    onClose()
                    enqueueSnackbar('Oznámení bylo úspěšně uloženo.', { variant: 'success' })
                }
            })
            .catch(() => enqueueSnackbar('Nastala chyba při vytváření.', { variant: 'error' }))
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

AdministrationNewsNewAnnouncementDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
}

export default AdministrationNewsNewAnnouncementDialog
