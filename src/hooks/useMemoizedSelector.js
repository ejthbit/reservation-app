import { useMemo } from 'react'
import { useSelector } from 'react-redux'

const useMemoizedSelector = (selector, argObj, dependencies) => {
    const memoizedSelector = useMemo(selector, dependencies)
    const memoizedArgs = useMemo(() => argObj, dependencies)
    return useSelector((state) => memoizedSelector(state, memoizedArgs))
}
export default useMemoizedSelector
