const getDateWithCorrectOffset = (date) => {
    const newDate = new Date(date)
    let offset = newDate.getTimezoneOffset()
    offset *= 60000
    return new Date(newDate.valueOf() + offset)
}
export default getDateWithCorrectOffset
