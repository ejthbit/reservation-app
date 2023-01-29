import React from 'react'
import PropTypes from 'prop-types'
import { useReservationButton } from '../../../hooks'
import { useSelector } from 'react-redux'
import { makeReservationProcessInfo } from '../../../store/reservationProcess'
const getReservationProcessInfo = makeReservationProcessInfo()

// TODO
const ReservationButtonProvider = ({ dependencies }) => {
    const values = useSelector(getReservationProcessInfo)
    values.entries()
    useReservationButton({ dependency: [values] })
}

ReservationButtonProvider.propTypes = {}

export default ReservationButtonProvider
