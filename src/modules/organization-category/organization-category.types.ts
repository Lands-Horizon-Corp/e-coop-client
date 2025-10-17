import { IAuditable, ITimeStamps, TEntityId } from '@/types'

import { ICategory } from '../category'
import { IOrganization } from '../organization/organization.types'

export interface IOrganizationCategory extends ITimeStamps, IAuditable {
    id: TEntityId
    organization_id: TEntityId
    organization: IOrganization

    category_id: TEntityId
    category: ICategory
}

export interface IOrganizationCategoryRequest {
    id?: TEntityId
    category_id: TEntityId
}
