import useSWRMutation from 'swr/mutation'
import {
    fetchVacations,
    createVacation,
    updateVacation,
    deleteVacation,
} from './AdministrationVacationFetchers'
import { VacationPayload } from '../../types'

export const useGetVacations = () => {
    const { data, error, isMutating, trigger } = useSWRMutation(
        'administration/vacations',
        (key, { arg }: { arg: { from: string; to: string; workplace: string } }) =>
            fetchVacations(arg),
    )
    return { data, error, isMutating, trigger }
}

export const useCreateVacation = () => {
    const { trigger, data, error, isMutating } = useSWRMutation(
        'administration/vacations',
        (key, { arg }: { arg: VacationPayload }) => createVacation(arg),
    )
    return { trigger, data, error, isMutating }
}

export const useUpdateVacation = () => {
    const { trigger, data, error, isMutating } = useSWRMutation(
        'administration/vacations',
        (key, { arg }: { arg: VacationPayload & { id: number } }) => updateVacation(arg),
    )
    return { trigger, data, error, isMutating }
}

export const useDeleteVacation = () => {
    const { trigger, data, error, isMutating } = useSWRMutation(
        'administration/vacations',
        (key, { arg }: { arg: number }) => deleteVacation(arg),
    )
    return { trigger, data, error, isMutating }
}
