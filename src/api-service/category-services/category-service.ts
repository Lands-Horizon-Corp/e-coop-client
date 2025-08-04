import { ICategory } from '@/types/lands-types/category'

import APIService from '../api-service'

export const getAllCategory = async () => {
    const response = await APIService.get<ICategory[]>(`/api/v1/category`)
    return response.data
}
