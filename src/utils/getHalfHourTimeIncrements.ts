//@ts-nocheck
/**
 * It takes a start and end time in the format of `HH:MM` and returns an array of half-hour increments
 * between the two times
 * @param start - The start time of the day, in 24-hour format.
 * @param end - The end time of the day, in 24-hour format.
 * @returns An array of half-hour time increments between two times.
 */
export const getHalfHourTimeIncrements = (start: string, end: string) => {
    // Convert to number of half-hours
    start = parseInt(start) * 2 + (+start.slice(-2) > 0)
    end = parseInt(end) * 2 + (+end.slice(-2) > 0) + 1
    // Produce series
    return Array.from({ length: end - start }, (_, i) =>
        (((i + start) >> 1) + ':' + ((i + start) % 2) * 3 + '0').replace(/^\d:/, '0$&'),
    )
}
