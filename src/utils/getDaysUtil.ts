import { format, isWeekend, parseISO } from 'date-fns'
/**
 * @param {int} The month number, 0 based
 * @param {int} The year, not zero based, required to account for leap years
 * @return {DateString[]} List with date string in isoFormat for each day of the month
 */
const getDaysInMonth = (month: number, year: number) => {
    const date = new Date(Date.UTC(year, month, 1))
    const days = []
    while (date.getUTCMonth() === month) {
        days.push(format(new Date(date), 'yyyy-MM-dd'))
        date.setUTCDate(date.getUTCDate() + 1)
    }
    return days
}
export const getWorkDaysInMonth = (month: number, year: number) => {
    const daysInMonth = getDaysInMonth(month, year)
    return daysInMonth.filter((date: string) => !isWeekend(parseISO(date)))
}

export default getDaysInMonth
