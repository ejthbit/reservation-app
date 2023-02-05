const authHeader = () => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    if (user && user.token) return `Bearer ${user.token}`
    else return undefined
}
export default authHeader
