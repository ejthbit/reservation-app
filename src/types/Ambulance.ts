import { Contact } from './Contact'

export type Ambulance = {
    id: number
    created_at: string
    name: string
    full_name?: string
    address: string
    workplace_id: number
    contact?: Contact
}
