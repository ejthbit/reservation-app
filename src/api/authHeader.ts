const authHeader = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
        const user = JSON.parse(storedUser)
        if (user && user.token) return `Bearer ${user.token}`
    }

    return undefined
}
export default authHeader
