import { IBranch } from '@/modules/branch'
import { IOrganization } from '@/modules/organization'

export type SortBy = 'recent' | 'popular' | 'name' | 'location'

export const sortOrganizations = (
    organizations: IOrganization[],
    sortBy: SortBy
) => {
    return organizations.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name)
            case 'recent':
                return (
                    new Date(b.created_at || 0).getTime() -
                    new Date(a.created_at || 0).getTime()
                )
            case 'popular':
                return (
                    (b.subscription_plan ? 1 : 0) -
                    (a.subscription_plan ? 1 : 0)
                )
            default:
                return 0
        }
    })
}

export const sortBranches = (branches: IBranch[], sortBy: SortBy) => {
    return branches.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name)
            case 'recent':
                return (
                    new Date(b.created_at || 0).getTime() -
                    new Date(a.created_at || 0).getTime()
                )
            case 'location':
                return a.city.localeCompare(b.city)
            default:
                return 0
        }
    })
}
