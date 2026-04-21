const authHeader = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
        try {
            const user = JSON.parse(storedUser)
            if (user && user.token) return `Bearer ${user.token}`
        } catch {
            localStorage.removeItem('user')
        }
    }

    return undefined
}
export default authHeader
