import { ICategory } from '@/types/lands-types/category'

import APIService from '../api-service'

export const getAllCategory = async () => {
    const response = await APIService.get<ICategory[]>(`/category`)
    return response.data
}
