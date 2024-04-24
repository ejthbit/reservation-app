import { SelectChangeEvent } from '@mui/material'
import { useReservation } from 'src/context/Reservation/useReservation'
import { useGetCategories } from '../../../hooks/useGetCategories'
import useReservationButton from '../../../hooks/useReservationButton'
//@ts-ignore
import { Dropdown } from '../../common'
import { makeArrayOfLabelValue } from 'src/context/Reservation'

const ReservationCategorySelect = ({ step, isRequired = false }: { step: string; isRequired?: boolean }) => {
    const {
        preferredDoctor: selectedDoctorId,
        selectedCategory,
        setters: { setSelectedCategory },
    } = useReservation()
    const { data: categories, isLoading } = useGetCategories(selectedDoctorId as string)

    useReservationButton({ dependency: [selectedCategory], step, isRequired })

    if (isLoading) return null
    return (
        <Dropdown
            label="Typ vyšetření"
            value={selectedCategory}
            isLoading={isLoading}
            onChange={(e: SelectChangeEvent<any>) => setSelectedCategory(e.target.value)}
            options={makeArrayOfLabelValue('name', 'category_id', categories ?? [])}
            required
        />
    )
}

export default ReservationCategorySelect
