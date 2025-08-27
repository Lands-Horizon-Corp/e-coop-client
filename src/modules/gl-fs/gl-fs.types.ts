import { TEntityId } from '@/types'

export type CreateAPIProps = {
    url: string
    baseKey: string
    connectAccountMutationKey: string
    updateIndexMutationKey: string
}

export type ConnectAccountType = {
    id: TEntityId
    accountId: TEntityId
}
