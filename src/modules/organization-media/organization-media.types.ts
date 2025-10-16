import z from 'zod'

import { IAuditable, IPaginatedResult, TEntityId } from '@/types'

import { IMedia } from '../media'
import { IOrganization } from '../organization/organization.types'
import { OrganizationMediaSchema } from './organization-media.validation'

export interface IOrganizationMedia extends IAuditable {
    id: TEntityId
    name: string
    description?: string | null
    organization_id: TEntityId
    organization?: IOrganization
    media_id: TEntityId
    media?: IMedia
}
export type IOrganizationMediaRequest = z.infer<typeof OrganizationMediaSchema>

export interface IOrganizationMediaPaginated
    extends IPaginatedResult<IOrganizationMedia> {}
