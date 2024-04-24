const authHeader = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
        const user = JSON.parse(storedUser)
        if (user && user.token) return `Bearer ${user.token}`
    } else return undefined
}
export default authHeader
