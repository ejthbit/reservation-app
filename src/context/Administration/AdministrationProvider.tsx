import { useSnackbar } from 'notistack'
import { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react'
import { useUser } from '../User/UserProvider'

type SelectedViewDateRange = { from?: string; to?: string }
type Administration = {
    selectedWorkspace: string
    selectedViewDateRange?: SelectedViewDateRange
    selectWorkspace: (workspace: string) => void
    selectViewDateRange: ({ from, to }: SelectedViewDateRange) => void
}

const AdministrationProviderContext = createContext<Administration | undefined>(undefined)

export const useAdministration = () => {
    const context = useContext(AdministrationProviderContext)
    if (!context) {
        throw new Error('useAdministration must be used within a AdministrationProvider')
    }
    return context
}

export const AdministrationProvider = ({ children }: PropsWithChildren) => {
    const { enqueueSnackbar } = useSnackbar()
    const { default_workplace } = useUser()

    const [selectedWorkspace, setSelectedWorkspace] = useState(default_workplace)
    const [selectedViewDateRange, selectViewDateRange] = useState<SelectedViewDateRange | undefined>(
        undefined,
    )

    const value: Administration = useMemo(
        () => ({
            selectedViewDateRange,
            selectedWorkspace,
            selectViewDateRange,
            selectWorkspace: (workspace: string) => {
                setSelectedWorkspace(workspace)
                enqueueSnackbar(`Pracoviště bylo úspěšně změněno na ${workspace}`, { variant: 'success' })
            },
        }),
        [selectedWorkspace, selectedViewDateRange],
    )

    return (
        <AdministrationProviderContext.Provider value={value}>
            {children}
        </AdministrationProviderContext.Provider>
    )
}
