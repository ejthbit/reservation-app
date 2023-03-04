import { getDateWithCorrectOffset, isNilOrEmpty } from '../../../../../utils'

export const getTimeValuesToFilterOut = (rowArray, originalArray = []) => {
    const deepCopy = [...rowArray]
    const newArray = deepCopy.reduce((acc, { start, end }) => {
        if (!isNilOrEmpty(start) && !isNilOrEmpty(end)) acc.push([start, end])
        return acc
    }, [])

    const timeArray = newArray.map(([start, end]) => {
        const startDate = getDateWithCorrectOffset(start)
        const endDate = getDateWithCorrectOffset(end)
        const startHours = startDate.getHours().toString().padStart(2, '0')
        const startMinutes = startDate.getMinutes().toString().padStart(2, '0')
        const endHours = endDate.getHours().toString().padStart(2, '0')
        const endMinutes = endDate.getMinutes().toString().padStart(2, '0')
        return [`${startHours}:${startMinutes}`, `${endHours}:${endMinutes}`]
    })
    const updatedTimeArray = timeArray.map(([start, end]) => {
        let startTime = new Date('1970-01-01 ' + start + ':00')
        let endTime = new Date('1970-01-01 ' + end + ':00')
        let hours = []
        for (let time = startTime; time < endTime; time.setMinutes(time.getMinutes() + 30)) {
            let hour = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            hours.push(hour)
        }
        return [start, ...hours]
    })
    const result = updatedTimeArray
    let flattenedArray = result.reduce(function (accumulator, currentArray) {
        return accumulator.concat(currentArray)
    }, [])
    return originalArray.filter((time) => !flattenedArray.includes(time))
}
