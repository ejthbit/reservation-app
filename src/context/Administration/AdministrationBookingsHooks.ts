import useSWR from 'swr'
import { createBooking, deleteBooking, fetchBookings, updateBooking } from './AdministrationBookingsFetchers'
import useSWRMutation from 'swr/dist/mutation'
import { ReservationProcessData } from 'src/components/Reservation/ReservationDialog/helpers/prepareReservationForCreation'
import { UpdatedBooking } from 'src/types'

export const useGetBookings = ({ from, to, workplace }: { from: string; to: string; workplace?: string }) => {
    const { data, error, isLoading, mutate } = useSWR(
        ['administration/bookings', from, to, workplace], // The key for cache
        () => fetchBookings({ from, to, workplace }), // The fetcher function
    )

    return { data, error, isLoading, mutate }
}

export const useFastBooking = () => {
    const { trigger, data, error, isMutating } = useSWRMutation(
        'administration/bookings', // Cache key to optionally invalidate
        (key, { arg }: { arg: ReservationProcessData }) => createBooking(arg), // Mutation function
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
