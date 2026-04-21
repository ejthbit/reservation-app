import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material'
import { forwardRef } from 'react'
import { useUser } from '../../context/User/UserProvider'
import { TransitionProps } from '@mui/material/transitions'

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />
})

const AutomaticLogoutDialog = () => {
    const { automaticallyLoggedOut, logOut } = useUser()

    return (
        automaticallyLoggedOut && (
            <Dialog open={automaticallyLoggedOut} TransitionComponent={Transition} keepMounted>
                <DialogTitle>Automatické odhlašení</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Vypršela platnost Vaší přihlašovací relace, z toho důvodu jsme byli nuceni vás
                        automaticky odhlásit. Odhlášení proběhne v průběhů 30 sekund. Pro pokračování se
                        prosím znovu přihlašte.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={logOut} variant="contained">
                        Odhlásit se nyní
                    </Button>
                </DialogActions>
            </Dialog>
        )
    )
}

export default AutomaticLogoutDialog
