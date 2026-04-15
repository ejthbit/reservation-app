export type Vacation = {
    id: number
    created_at: string
    start: string
    end: string
    workplace: number
    note?: string | null
    created_by: string
}

export type VacationPayload = {
    start: string
    end: string
    workplace: number
    note?: string
}
