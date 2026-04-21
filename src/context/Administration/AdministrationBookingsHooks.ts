import { createBooking, deleteBooking, fetchBookings, updateBooking } from './AdministrationBookingsFetchers'
import useSWRMutation from 'swr/mutation'
import { UpdatedBooking } from '../../types'
import { ReservationProcessData } from '../../components/Reservation/ReservationDialog/helpers/prepareReservationForCreation'
import useSWR from 'swr'

export const useGetImmediateBookings = ({
    from,
    to,
    workplace,
}: {
    from: string
    to: string
    workplace: string
}) => {
    const { data, error, isLoading, isValidating } = useSWR(
        ['administration/bookings', { from, to, workplace }],
        ([_, arg]) => fetchBookings(arg),
        { refreshInterval: 300_000 },
    )

    return { data, error, isLoading, isValidating }
}

export const useGetBookings = () => {
    const { data, error, isMutating, trigger } = useSWRMutation(
        'administration/bookings',
        (
            key,
            { arg }: { arg: { from: string; to: string; workplace: string } },
        ) => fetchBookings(arg),
    )

    return { data, error, isMutating, trigger }
}

export const useFastBooking = () => {
    const { trigger, data, error, isMutating } = useSWRMutation(
        'administration/bookings',
        (key, { arg }: { arg: ReservationProcessData }) => createBooking(arg),
    )

    return { trigger, data, error, isMutating }
}

export const useUpdateBooking = () => {
    const { trigger, data, error, isMutating } = useSWRMutation(
        'administration/bookings',
        (key, { arg }: { arg: UpdatedBooking }) => updateBooking(arg),
    )

    return { trigger, data, error, isMutating }
}

export const useDeleteBooking = () => {
    const { trigger, data, error, isMutating } = useSWRMutation(
        'administration/bookings',
        (key, { arg }: { arg: string }) => deleteBooking(arg),
    )

    return { trigger, data, error, isMutating }
}
