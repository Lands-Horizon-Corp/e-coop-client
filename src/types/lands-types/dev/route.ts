export interface IRoute {
    route: string
    request: string
    response: string
    method: string
    note: string
}

export interface IGroupedRoute {
    key: string
    routes: IRoute[]
}
