import { reject } from 'ramda'
import { PropsWithChildren, useMemo } from 'react'
import { useReservationButton } from '../../../hooks'
import { useReservation } from '../../../context/Reservation'

type ReservationContactInformationDisableProviderParams = {
    nameDep?: boolean
    emailDep?: boolean
    phoneDep?: boolean
    birthDateDep?: boolean
    step: string
}

const ReservationContactInformationDisableProvider = ({
    nameDep,
    emailDep,
    phoneDep,
    birthDateDep,
    step,
    children,
}: PropsWithChildren<ReservationContactInformationDisableProviderParams>) => {
    const {
        contactInformation: { name, email, phone, birthdate },
    } = useReservation()

    const collection = useMemo(
        () => ({
            ...(nameDep && { name }),
            ...(emailDep && { email }),
            ...(birthDateDep && { birthdate }),
            ...(phoneDep && { phone }),
        }),
        [name, email, birthdate, phone],
    )

    useReservationButton({
        dependency: reject(
            (value) => value === undefined,
            Object.values(collection).map((value) => value),
        ),
        step,
        isRequired: true,
    })

    return children
}

export default ReservationContactInformationDisableProvider
