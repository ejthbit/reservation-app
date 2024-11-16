import { PropsWithChildren, createContext, useContext, useState } from 'react'
import { Key } from 'swr'
import useSWRMutation from 'swr/mutation'
import { useSnackbar } from 'notistack'
import { User } from '../../types'
import axiosGynInstance from '../../api/config'

// Define the type for user data
interface UserData {
    success?: boolean
    token: string
    exp: number
    user?: User
}

// Define the type for the context value
interface UserContextType extends User {
    userError: Error | undefined
    isLoadingUser: boolean
    isLoggedIn: boolean
    automaticallyLoggedOut: boolean
    userRole: number
    defaultWorkplace: string
    logIn: (data: { email: string; password: string }) => void
    logOut: () => void
    logOutAutomatically: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}

type SignInPayload = { arg: { email: string; password: string } }
const signIn = async (key: Key, { arg }: SignInPayload) =>
    (await axiosGynInstance.post<UserData>('administration/signIn', arg, { withCredentials: true })).data

export const UserProvider = ({ children }: PropsWithChildren) => {
    const { enqueueSnackbar } = useSnackbar()

    const [automaticallyLoggedOut, logOutAutomatically] = useState(false)

    const {
        data: userData,
        error: userError,
        isMutating: isLoadingUser,
        trigger: logIn,
        reset,
    } = useSWRMutation<UserData, Error, string, { email: string; password: string }>('api/user', signIn, {
        onSuccess: (data) => localStorage.setItem('user', JSON.stringify(data)),
    })

    const isLoggedIn = userData?.success ?? false
    const id = userData?.user?.id
    const email = userData?.user?.email
    const name = userData?.user?.name
    // TODO: Rename me to camelCase
    const defaultWorkplace = userData?.user?.default_workplace ?? '1'
    const userRole = userData?.user?.user_role ?? 1

    const value: UserContextType = {
        userError,
        isLoadingUser,
        isLoggedIn,
        automaticallyLoggedOut,
        id,
        email,
        name,
        defaultWorkplace,
        userRole: userRole,
        logIn,
        logOut: () => {
            reset()
            localStorage.clear()
        },
        logOutAutomatically: () => logOutAutomatically((state) => !state),
    }

    if (userError) {
        enqueueSnackbar('Příhlášení nebylo úspěšné, prosím zkuste to později.', { variant: 'error' })
    }

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
