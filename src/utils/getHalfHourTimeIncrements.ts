/**
 * It takes a start and end time in the format of `HH:MM` and returns an array of half-hour increments
 * between the two times
 * @param start - The start time of the day, in 24-hour format.
 * @param end - The end time of the day, in 24-hour format.
 * @returns An array of half-hour time increments between two times.
 */
export const getHalfHourTimeIncrements = (start: string, end: string) => {
    const startSlot = parseInt(start) * 2 + (+start.slice(-2) > 0 ? 1 : 0)
    const endSlot = parseInt(end) * 2 + (+end.slice(-2) > 0 ? 1 : 0) + 1

    return Array.from({ length: endSlot - startSlot }, (_, i) => {
        const slot = i + startSlot
        const hours = slot >> 1
        const minutes = (slot % 2) * 30
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    })
}
