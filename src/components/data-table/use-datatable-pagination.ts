import { useEffect, useRef } from 'react'

import type { IPaginatedResult } from '@/types'

type UseDataTablePaginationOptions = {
    fallbackPageSize: number
    initialTotalPage?: number
    initialTotalSize?: number
}

export const useDataTablePagination = <TData>(
    paginatedData: IPaginatedResult<TData> | undefined,
    {
        fallbackPageSize,
        initialTotalPage = 1,
        initialTotalSize = 0,
    }: UseDataTablePaginationOptions
) => {
    const paginationMetaRef = useRef({
        totalPage: initialTotalPage,
        pageSize: fallbackPageSize,
        totalSize: initialTotalSize,
    })

    useEffect(() => {
        if (!paginatedData) return

        paginationMetaRef.current = {
            totalPage: paginatedData.totalPage,
            pageSize: paginatedData.pageSize,
            totalSize: paginatedData.totalSize,
        }
    }, [paginatedData])

    const data = paginatedData?.data ?? []
    const totalPage =
        paginatedData?.totalPage ?? paginationMetaRef.current.totalPage
    const pageSize =
        paginatedData?.pageSize ?? paginationMetaRef.current.pageSize
    const totalSize =
        paginatedData?.totalSize ?? paginationMetaRef.current.totalSize

    return {
        data,
        totalPage,
        pageSize,
        totalSize,
    }
}
