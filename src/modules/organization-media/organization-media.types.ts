import z from 'zod'

import { IAuditable, IPaginatedResult, ITimeStamps, TEntityId } from '@/types'

import { IMedia } from '../media'
import { IOrganization } from '../organization/organization.types'
import { OrganizationMediaSchema } from './organization-media.validation'

export interface IOrganizationMedia extends IAuditable, ITimeStamps {
    id: TEntityId
    name: string
    description?: string
    organization_id: TEntityId
    organization?: IOrganization
    media_id: TEntityId
    media?: IMedia
}
export type IOrganizationMediaRequest = z.infer<typeof OrganizationMediaSchema>

export interface IOrganizationMediaPaginated
    extends IPaginatedResult<IOrganizationMedia> {}
