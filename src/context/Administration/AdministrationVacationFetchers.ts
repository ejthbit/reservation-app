import axiosGynInstance from '../../api/config'
import { Vacation, VacationPayload } from '../../types'

export const fetchVacations = async ({
    from,
    to,
    workplace,
}: {
    from: string
    to: string
    workplace: string
}) => {
    const { data } = await axiosGynInstance.get<Vacation[]>(
        `administration/vacations/${from}/${to}/${workplace}`,
    )
    return data
}

export const createVacation = async (payload: VacationPayload) => {
    const { data } = await axiosGynInstance.post<Vacation>('administration/vacation', payload)
    return data
}

export const updateVacation = async ({ id, ...payload }: VacationPayload & { id: number }) => {
    const { data } = await axiosGynInstance.put<Vacation>(`administration/vacation/${id}`, payload)
    return data
}

export const deleteVacation = async (id: number) => {
    const { data } = await axiosGynInstance.delete(`administration/vacation/${id}`)
    return data
}
