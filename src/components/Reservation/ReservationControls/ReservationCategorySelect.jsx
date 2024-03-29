import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { useGetCategories } from '../../../hooks/useGetCategories'
import useReservationButton from '../../../hooks/useReservationButton'
import {
    getPreferredDoctor,
    getSelectedCategory,
    makeArrayOfLabelValue,
} from '../../../store/reservationProcess'
import { setSelectedCategory } from '../../../store/reservationProcess/reservationProcessSlice'
import { Dropdown } from '../../common'

const ReservationCategorySelect = ({ step, isRequired = false }) => {
    const dispatch = useDispatch()
    const selectedDoctorId = useSelector(getPreferredDoctor)
    const { data: categories, isLoading } = useGetCategories(selectedDoctorId)

    const selectedCategory = useSelector(getSelectedCategory)
    useReservationButton({ dependency: [selectedCategory], step, isRequired })

    if (isLoading) return null
    return (
        <Dropdown
            label="Typ vyšetření"
            value={selectedCategory}
            isLoading={isLoading}
            onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
            options={makeArrayOfLabelValue('name', 'category_id', categories ?? [])}
            required
        />
    )
}

ReservationCategorySelect.propTypes = {
    isRequired: PropTypes.bool,
    step: PropTypes.string,
}
export default ReservationCategorySelect
