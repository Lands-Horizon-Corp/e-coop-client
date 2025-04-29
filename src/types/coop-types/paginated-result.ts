interface IPages {
    page: string
    pageIndex: string
}

export interface IPaginatedResult<T> {
    data: T[]
    pageIndex: number
    totalPage: number
    pageSize: number
    totalSize: number // Total size of all data including all pages
    pages: IPages[]
}
