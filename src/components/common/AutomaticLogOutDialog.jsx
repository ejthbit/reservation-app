import { Dialog, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material'
import { forwardRef } from 'react'
import { useSelector } from 'react-redux'
import { getUserInfo } from '../../store/userInfo/selectors'

const AutomaticLogoutDialog = () => {
    const { automaticallyLoggedOut } = useSelector(getUserInfo)
    const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />)
    Transition.displayName = 'Transition'

    return (
        automaticallyLoggedOut && (
            <Dialog open={automaticallyLoggedOut} TransitionComponent={Transition} keepMounted>
                <DialogTitle>Automatické odhlašení</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Vypršela platnost Vaší přihlašovací relace, z toho důvodu jsme byli nuceni vás
                        automaticky odhlásit. Odhlášení proběhne v průběhů jedné minuty. Pro pokračování se
                        prosím znovu přihlašte.
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        )
    )
}

export default AutomaticLogoutDialog
