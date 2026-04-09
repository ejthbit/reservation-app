const isNilOrEmpty = (value: unknown): boolean => {
    if (value == null) return true
    if (typeof value === 'string' || Array.isArray(value)) return value.length === 0
    if (typeof value === 'object') return Object.keys(value).length === 0
    return false
}
export default isNilOrEmpty
