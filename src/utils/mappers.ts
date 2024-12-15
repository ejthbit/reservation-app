import type { Ambulance, Category } from '../types'

export const getCategoryNameById = (categoryId: string, categories: Category[]) => {
    const category = categories.find((category) => category.category_id === parseInt(categoryId))
    return category ? category.name : null
}

export const getAmbulanceNameById = (selectedAmbulanceId: number, ambulances: Ambulance[]) => {
    const ambulance = ambulances.find((ambulance) => ambulance.workplace_id === selectedAmbulanceId)
    return ambulance?.name && ambulance?.address ? { name: ambulance.name, address: ambulance.address } : null
}
