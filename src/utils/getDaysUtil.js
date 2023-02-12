import { format, isWeekend, parseISO } from 'date-fns'
import { equals, filter } from 'ramda'
/**
 * @param {int} The month number, 0 based
 * @param {int} The year, not zero based, required to account for leap years
 * @return {DateString[]} List with date string in isoFormat for each day of the month
 */
const getDaysInMonth = (month, year) => {
    const date = new Date(Date.UTC(year, month, 1))
    const days = []
    while (equals(date.getUTCMonth(), month)) {
        days.push(format(new Date(date), 'yyyy-MM-dd'))
        date.setUTCDate(date.getUTCDate() + 1)
    }
    return days
}
export const getWorkDaysInMonth = (month, year) => {
    const daysInMonth = getDaysInMonth(month, year)
    return filter((date) => !isWeekend(parseISO(date)), daysInMonth)
}

export default getDaysInMonth
