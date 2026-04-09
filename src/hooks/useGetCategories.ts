import useSWR from 'swr'
import axiosGynInstance from '../api/config'
import { isNilOrEmpty } from '../utils'
import { Category } from '../types'
/**
 * The function fetcher is an asynchronous function that fetches data from a specified URL using
 * axiosGynInstance and returns the data if it exists, otherwise throws an error with the message from
 * the response.
 * @param url - The `url` parameter in the `fetcher` function is a string representing the URL from
 * which data will be fetched using an HTTP GET request.
 * @returns The function `fetcher` is returning the data from the response (`res.data`) if it exists.
 * If there is no data in the response, it will throw an error with the message from
 * `res.data.message`.
 */

const fetcher = async (url: string) => {
    const { data: response, statusText } = await axiosGynInstance.get<{
        data: Category[]
        status: number
    }>(url)
    if (!response.data) {
        throw Error(statusText)
    }
    return response.data
}

/**
 * The `useGetCategories` function fetches booking categories based on a selected doctor ID or all
 * categories if no ID is provided.
 * @returns The `useGetCategories` function returns the result of calling the `useSWR` hook with the
 * provided URL, fetcher function, and options object. The `onSuccess` callback in the options object
 * transforms the data received from the API into an array of objects with `name` and `category_id`
 * properties using the `makeArrayOfLabelValue` function.
 */
export const useGetCategories = (selectedDoctorId?: string | null) => {
    const url = !isNilOrEmpty(selectedDoctorId)
        ? `configuration/getBookingCategories/${selectedDoctorId}`
        : `configuration/getBookingCategories`

    return useSWR(url, fetcher, { revalidateOnFocus: false, dedupingInterval: 60000, errorRetryCount: 2 })
}
