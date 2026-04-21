import { useEffect, useState } from 'react'

type UseDebounceParams = {
    value: string
    onDebounce: (value: string) => void
    delay?: number
}

const useDebounce = ({ value, delay = 500, onDebounce }: UseDebounceParams) => {
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
