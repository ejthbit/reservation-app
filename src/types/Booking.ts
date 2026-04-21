import { Contact } from './Contact'

export type Booking = {
    id: number
    created_at: string
    name: string
    birthdate: string
    contact?: Contact | null
    start: string
    end: string
    workplace: number
    category: number
    completed: boolean
    note?: string | null
    selected_doctor_id?: number | string | null
}

export type UpdatedBooking = {
    id: number
    name: string
    start: string
    end: string
    category: number
    contact?: Contact
    note?: string
    completed?: boolean
    workplace: number
    birthdate: string
}
