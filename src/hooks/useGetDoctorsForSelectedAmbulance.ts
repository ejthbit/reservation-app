import useSWRMutation from 'swr/mutation'
import axiosGynInstance from '../api/config'
import { Doctor } from '../types/Doctor'

const getDoctorsForSelectedAmbulanceFetcher = async (ambulanceId: number) =>
    (await axiosGynInstance.get(`configuration/getDoctors/${ambulanceId}`)).data.data

export const useGetDoctorsForSelectedAmbulance = () => {
    const {
        data: doctorsForSelectedAmbulance,
        trigger: getDoctorsForSelectedAmbulance,
        error: doctorsForSelectedAmbulanceError,
        reset: clearDoctorsForSelectedAmbulance,
        isMutating: isLoadingDoctorsForSelectedAmbulance,
    } = useSWRMutation<Doctor[], Error, string, number>(
        'configuration/getDoctorsForSelectedAmbulance',
        (key, { arg }) => getDoctorsForSelectedAmbulanceFetcher(arg),
    )

    return {
        doctorsForSelectedAmbulance,
        doctorsForSelectedAmbulanceError,
        isLoadingDoctorsForSelectedAmbulance,
        api: {
            getDoctorsForSelectedAmbulance,
            clearDoctorsForSelectedAmbulance,
        },
    }
}
