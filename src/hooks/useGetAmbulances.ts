import useSWR from 'swr'
import axiosGynInstance from '../api/config'
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
    const { data: response } = await axiosGynInstance.get(url)
    if (!response.data) {
        throw Error(response.data.message)
    }
    return response.data
}

export const useGetAmbulances = () => {
    const url = `configuration/getAmbulances`

    return useSWR(url, fetcher, { revalidateOnFocus: false, errorRetryCount: 2 })
}
