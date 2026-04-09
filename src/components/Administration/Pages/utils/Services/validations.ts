import { isNilOrEmpty } from '../../../../../utils'

//TODO
export const checkArrayStartEndValues = (value: string | undefined, p: any) => {
    if (!isNilOrEmpty(value)) {
        const indexOfCurrent = p.from[1].value.doctors.indexOf(p.from[0].value)
        if (indexOfCurrent >= 1) {
            return (
                p.from[1].value.doctors[indexOfCurrent].start >=
                p.from[1].value.doctors[indexOfCurrent - 1].end
            )
        } else return true
    } else return true
}
