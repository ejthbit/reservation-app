const getISODateStringWithCorrectOffset = (date) =>
    new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString()
export default getISODateStringWithCorrectOffset
