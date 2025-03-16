import { indexOf } from 'ramda'
import { isNilOrEmpty } from '../../../../../utils'

//TODO
export const checkArrayStartEndValues = (value: string | undefined, p: any) => {
    if (!isNilOrEmpty(value)) {
        const indexOfCurrent = indexOf(p.from[0].value, p.from[1].value.doctors)
        if (indexOfCurrent >= 1) {
            return (
                p.from[1].value.doctors[indexOfCurrent].start >=
                p.from[1].value.doctors[indexOfCurrent - 1].end
            )
        } else return true
    } else return true
}
