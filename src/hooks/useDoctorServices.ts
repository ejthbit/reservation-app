import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { AmbulanceService, AmbulanceServiceDay, DoctorService } from '../types/AmbulanceService'
import axiosGynInstance from '../api/config'

type GetDoctorServicesByRangeFetcherProps = {
    start: string
    end: string
    workplace: number
}

type GetDoctorServicesForMonthFetcherProps = { month: string; workplace: number }

type CreateServiceForMonthProps = {
    month: string
    days: AmbulanceServiceDay[]
    workplace: string | number
}

type UpdateServiceForMonthProps = {
    month: string
    workplace: string | number
    days: AmbulanceServiceDay[]
}
const getDoctorServicesByRangeFetcher = async ({
    start,
    end,
    workplace,
}: GetDoctorServicesByRangeFetcherProps) =>
    (await axiosGynInstance.get(`/bookings/getDoctorServicesByRange/${start}/${end}/${workplace}`)).data

const getDoctorServicesForMonthFetcher = async ({
    month,
    workplace,
}: GetDoctorServicesForMonthFetcherProps) =>
    (await axiosGynInstance.get(`/bookings/getDoctorServicesForMonth/${month}/${workplace}`)).data

const createServiceForMonthFetcher = async (data: CreateServiceForMonthProps) =>
    (await axiosGynInstance.post(`/administration/doctorService`, data)).data

const updateServiceForMonthFetcher = async ({ month, workplace, days }: UpdateServiceForMonthProps) =>
    (await axiosGynInstance.put(`/administration/doctorService/${month}/${workplace}`, { days })).data

export const useGetDoctorServicesByRange = (params: GetDoctorServicesByRangeFetcherProps | null) => {
    const { data, error, isLoading } = useSWR<DoctorService[]>(
        params ? ['bookings/getDoctorServicesByRange', params.start, params.end, params.workplace] : null,
        () => getDoctorServicesByRangeFetcher(params!),
    )
    return { data: data ?? [], error, isLoading }
}

export const useDoctorServices = () => {
    const {
        data: servicesDays,
        trigger: fetchDoctorServicesByRange,
        error: servicesDaysError,
        reset: clearDoctorServicesByRange,
        isMutating: isLoadingServicesDays,
    } = useSWRMutation<DoctorService[], Error, string, GetDoctorServicesByRangeFetcherProps>(
        'bookings/getDoctorServicesByRange',
        (key, { arg }) => getDoctorServicesByRangeFetcher(arg),
    )

    const {
        data: doctorsServicesForSelectedAmbulance,
        trigger: fetchDoctorServicesForSelectedMonth,
        error: doctorsServicesForSelectedAmbulanceError,
        reset: clearDoctorServicesForSelectedMonth,
        isMutating: isLoadingDoctorsServicesForSelectedAmbulance,
    } = useSWRMutation<AmbulanceService, Error, string, GetDoctorServicesForMonthFetcherProps>(
        'bookings/getDoctorServicesForMonth',
        (key, { arg }) => getDoctorServicesForMonthFetcher(arg),
    )

    const {
        trigger: createServiceForMonth,
        isMutating: isCreatingService,
    } = useSWRMutation<AmbulanceService, Error, string, CreateServiceForMonthProps>(
        'administration/createDoctorService',
        (key, { arg }) => createServiceForMonthFetcher(arg),
    )

    const {
        trigger: updateServiceForMonth,
        isMutating: isUpdatingService,
    } = useSWRMutation<AmbulanceService, Error, string, UpdateServiceForMonthProps>(
        'administration/updateDoctorService',
        (key, { arg }) => updateServiceForMonthFetcher(arg),
    )

    return {
        servicesDays,
        doctorsServicesForSelectedAmbulance,
        servicesDaysError,
        doctorsServicesForSelectedAmbulanceError,
        isLoadingServicesDays,
        isLoadingDoctorsServicesForSelectedAmbulance,
        isCreatingService,
        isUpdatingService,
        api: {
            fetchDoctorServicesByRange,
            fetchDoctorServicesForSelectedMonth,
            clearDoctorServicesByRange,
            clearDoctorServicesForSelectedMonth,
            createServiceForMonth,
            updateServiceForMonth,
        },
    }
}
