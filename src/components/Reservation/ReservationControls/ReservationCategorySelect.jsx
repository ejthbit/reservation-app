import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSelectedCategory, useLazyGetBookingCategoriesQuery } from '../../../store/reservationProcess'
import { setSelectedCategory } from '../../../store/reservationProcess/reservationProcessSlice'
import { isNilOrEmpty } from '../../../utils'
import PropTypes from 'prop-types'
import useReservationButton from '../../../hooks/useReservationButton'
import { Dropdown } from '../../common'

const ReservationCategorySelect = ({ step, isRequired = false }) => {
    const dispatch = useDispatch()
    const [getReservationCategories, { data: categories, isLoading }] = useLazyGetBookingCategoriesQuery()
    const selectedCategory = useSelector(getSelectedCategory)
    useReservationButton({ dependency: [selectedCategory], step, isRequired })

    useEffect(() => {
        if (isNilOrEmpty(categories)) getReservationCategories()
    }, [])

    return (
        <Dropdown
            label="Typ vyšetření"
            value={selectedCategory}
            isLoading={isLoading}
            onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
            options={categories}
        />
    )
}

ReservationCategorySelect.propTypes = {
    isRequired: PropTypes.bool,
    step: PropTypes.string,
}
export default ReservationCategorySelect
