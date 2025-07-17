import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { CategoryService } from '@/api-service/category-services'
import { serverRequestErrExtractor } from '@/helpers'
import { ICategory } from '@/types/lands-types/category'
import { withCatchAsync } from '@/utils'

export const useGetAllCategory = () => {
    return useQuery<ICategory[], string>({
        queryKey: ['category-all'],
        queryFn: async () => {
            const [error, response] = await withCatchAsync(
                CategoryService.getAllCategory()
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                throw errorMessage
            }

            return response
        },
    })
}
