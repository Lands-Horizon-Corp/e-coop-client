import z from 'zod'

import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IGeneratedReport } from '../generated-report/generated-report.types'
import { IMedia } from '../media'
import { IUser } from '../user'
import { IUserOrganization } from '../user-organization'
import { GeneratedReportsDownloadUsersSchema } from './generated-reports-download-users.validation'

export interface IGeneratedReportsDownloadUsers extends IBaseEntityMeta {
    user_organization_id: TEntityId
    user_organization: IUserOrganization

    user: IUser
    user_id: TEntityId
    media: IMedia
    media_id: TEntityId

    generated_report_id: TEntityId
    generated_report: IGeneratedReport
}

export type IGeneratedReportsDownloadUsersRequest = z.infer<
    typeof GeneratedReportsDownloadUsersSchema
>

export interface IGeneratedReportsDownloadUsersPaginated
    extends IPaginatedResult<IGeneratedReportsDownloadUsers> {}
