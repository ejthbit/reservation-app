import { getDateWithCorrectOffset, isNilOrEmpty } from '../../../../../utils'

type TimeRange = { start: string; end: string }

export const getTimeValuesToFilterOut = (rowArray: TimeRange[], originalArray: string[] = []): string[] => {
    // Create a deep copy of rowArray
    const deepCopy: TimeRange[] = [...rowArray]

    // Create a new array with time ranges
    const newArray: [string, string][] = deepCopy.reduce((acc: [string, string][], { start, end }) => {
        if (!isNilOrEmpty(start) && !isNilOrEmpty(end)) acc.push([start, end])
        return acc
    }, [])

    // Map time ranges to formatted hours and minutes
    const timeArray: [string, string][] = newArray.map(([start, end]) => {
        const startDate = getDateWithCorrectOffset(start)
        const endDate = getDateWithCorrectOffset(end)
        const startHours = startDate.getHours().toString().padStart(2, '0')
        const startMinutes = startDate.getMinutes().toString().padStart(2, '0')
        const endHours = endDate.getHours().toString().padStart(2, '0')
        const endMinutes = endDate.getMinutes().toString().padStart(2, '0')
        return [`${startHours}:${startMinutes}`, `${endHours}:${endMinutes}`]
    })

    // Generate the time ranges for 30-minute intervals
    const updatedTimeArray: string[][] = timeArray.map(([start, end]) => {
        let startTime = new Date('1970-01-01 ' + start + ':00')
        let endTime = new Date('1970-01-01 ' + end + ':00')
        let hours: string[] = []

        for (let time = startTime; time < endTime; time.setMinutes(time.getMinutes() + 30)) {
            let hour = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            hours.push(hour)
        }

        return [start, ...hours]
    })

    // Flatten the array of time ranges
    const flattenedArray: string[] = updatedTimeArray.reduce((accumulator, currentArray) => {
        return accumulator.concat(currentArray)
    }, [])

    // Filter out times from originalArray that are in the flattened array
    return originalArray.filter((time) => !flattenedArray.includes(time))
}
