export const getCategoryNameById = (categoryId, categories) => {
    const category = categories.find((category) => category.category_id === parseInt(categoryId))
    return category ? category.name : null
}
export const getAmbulanceNameById = (selectedAmbulanceId, ambulances) => {
    const { name, address } = ambulances.find((ambulance) => ambulance.workplace_id === selectedAmbulanceId)
    return name && address ? { name, address } : null
}
