export type DoctorService = {
    doctorId: string
    start: string
    end: string
    note: string
    id: string
}

export type AmbulanceServiceDay = {
    /**
     *@example "2024-05-01"
     */
    date: string
    doctors: DoctorService[]
}

export type AmbulanceService = {
    id: number
    created_at: string
    month: string
    workplace: number
    days: AmbulanceServiceDay[]
}
