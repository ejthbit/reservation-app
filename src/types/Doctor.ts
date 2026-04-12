export type Doctor = {
    id: number
    created_at: string
    doctor_id: string
    name: string
    workplace_id: string[]
    preferred_service_start: string
    categories?: string[]
}
