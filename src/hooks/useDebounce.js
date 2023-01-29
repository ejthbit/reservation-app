import { useEffect, useState } from 'react'

const useDebounce = ({ value, delay = 500, onDebounce }) => {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay)

        return () => {
            clearTimeout(timer)
        }
    }, [value, delay])

    useEffect(() => {
        onDebounce(debouncedValue)
    }, [debouncedValue])

    return debouncedValue
}

export default useDebounce
