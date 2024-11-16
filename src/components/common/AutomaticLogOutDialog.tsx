import { Dialog, DialogContent, DialogContentText, DialogTitle, Slide } from '@mui/material'
import { forwardRef } from 'react'
import { useUser } from '../../context/User/UserProvider'
import { TransitionProps } from '@mui/material/transitions'

const AutomaticLogoutDialog = () => {
    const { automaticallyLoggedOut } = useUser()

    const Transition = forwardRef(function Transition(
        props: TransitionProps & {
            children: React.ReactElement<any, any>
        },
        ref: React.Ref<unknown>,
    ) {
        return <Slide direction="up" ref={ref} {...props} />
    })

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
            </Dialog>
        )
    )
}

export default AutomaticLogoutDialog
