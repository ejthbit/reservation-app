import useSWRMutation from 'swr/mutation'
import { AmbulanceService } from '../types/AmbulanceService'
import axiosGynInstance from '../api/config'

type GetDoctorServicesByRangeFetcherProps = {
    start: string
    end: string
    workplace: number
}

type GetDoctorServicesForMonthFetcherProps = { month: string; workplace: number }
const getDoctorServicesByRangeFetcher = async ({
    start,
    end,
    workplace,
}: GetDoctorServicesByRangeFetcherProps) =>
    (await axiosGynInstance.get(`/bookings/getDoctorServicesByRange/${start}/${end}/${workplace}`)).data.data

const getDoctorServicesForMonthFetcher = async ({
    month,
    workplace,
}: GetDoctorServicesForMonthFetcherProps) =>
    (await axiosGynInstance.get(`/bookings/getDoctorServicesForMonth/${month}/${workplace}`)).data

export const useDoctorServices = () => {
    const {
        data: servicesDays,
        trigger: fetchDoctorServicesByRange,
        error: servicesDaysError,
        reset: clearDoctorServicesByRange,
        isMutating: isLoadingServicesDays,
    } = useSWRMutation<AmbulanceService, Error, string, GetDoctorServicesByRangeFetcherProps>(
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

    return {
        servicesDays,
        doctorsServicesForSelectedAmbulance,
        servicesDaysError,
        doctorsServicesForSelectedAmbulanceError,
        isLoadingServicesDays,
        isLoadingDoctorsServicesForSelectedAmbulance,
        api: {
            fetchDoctorServicesByRange,
            fetchDoctorServicesForSelectedMonth,
            clearDoctorServicesByRange,
            clearDoctorServicesForSelectedMonth,
        },
    }
}
