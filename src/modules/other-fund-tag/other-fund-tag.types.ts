import { IBaseEntityMeta, IPaginatedResult, TEntityId } from '@/types'

import { IOtherFund } from '../other-fund/other-fund.types'

// import { OtherFundTagSchema } from './other-fund-tag.validation'

export interface IOtherFundTag extends IBaseEntityMeta {
    other_fund_id?: TEntityId
    other_fund?: IOtherFund

    name: string
    description?: string
    category: string
    color: string
    icon: string
}
export type IOtherFundTagRequest = {
    other_fund_id?: TEntityId
    name?: string
    description?: string
    category?: string
    color?: string
    icon?: string
}

// export type IOtherFundTagRequest = z.infer<typeof OtherFundTagSchema>

export interface IOtherFundTagPaginated extends IPaginatedResult<IOtherFundTag> {}
