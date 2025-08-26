export interface IAPIKey {
    developer_secret_key: string
}

export interface IRoute {
    route: string
    method: string
    note: string
    private?: boolean
    response?: string
    request?: string
}

export interface IGroupedRoute {
    key: string
    routes: IRoute[]
}

export interface IAPIInterface {
    key: string
    value: string
}

export interface IAPIList {
    grouped_routes: IGroupedRoute[]
    requests: IAPIInterface[]
    responses: IAPIInterface[]
}
