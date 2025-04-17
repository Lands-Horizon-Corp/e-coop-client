export interface IPaginatedResponse<T> extends IPaginationState {
    data: T[]
}

export interface IPaginationState {
    pageIndex: number
    totalPage: number
    pageSize: number
    totalSize: number
    pages: IPaginationPages[]
}

export interface IPaginationPages {
    page: string
    pageIndex: number
}
