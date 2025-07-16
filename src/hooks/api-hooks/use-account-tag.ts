import { AccountTagServices } from '@/api-service/accounting-services'
import {
    createMutationHook,
    createMutationInvalidateFn,
    deleteMutationInvalidationFn,
    updateMutationInvalidationFn,
} from '@/factory/api-hook-factory'

import { IAccounTagRequest, IAccountTag, TEntityId } from '@/types'

const KEY = 'account-tags'

export const useCreateAccountTag = createMutationHook<
    IAccountTag,
    string,
    IAccounTagRequest
>(
    (payload) => AccountTagServices.create(payload),
    'Account Tag Created',
    (args) => createMutationInvalidateFn(KEY, args)
)

export const useUpdateAccountTag = createMutationHook<
    IAccountTag,
    string,
    {
        accountTagId: TEntityId
        data: IAccounTagRequest
    }
>(
    (payload) =>
        AccountTagServices.updateById(payload.accountTagId, payload.data),
    'Account Tag Updated',
    (args) => updateMutationInvalidationFn(KEY, args)
)

export const useDeleteAccountTag = createMutationHook<void, string, TEntityId>(
    (accountTagId) => AccountTagServices.deleteById(accountTagId),
    'Account Tag Deleted',
    (args) => deleteMutationInvalidationFn(KEY, args)
)

export const useDeleteAccountTagsBulk = createMutationHook<
    void,
    string,
    TEntityId[]
>(
    (accountTagIds) => AccountTagServices.deleteMany(accountTagIds),
    'Account Tags Deleted',
    (args) => deleteMutationInvalidationFn(KEY, args)
)
