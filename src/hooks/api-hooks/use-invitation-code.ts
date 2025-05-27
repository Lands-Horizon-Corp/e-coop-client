import { InvitationCodeService } from '@/api-service/invitation-code-services'
import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createMutationHook } from './api-hook-factory'
import {
    IAPIFilteredPaginatedHook,
    IInvitationCode,
    IInvitationCodePaginated,
    IInvitationCodeRequest,
    IQueryProps,
    TEntityId,
} from '@/types'

export const useVerifyInvitationCode = (code: string) => {
    return useQuery({
        queryKey: ['invitation-code', code],
        queryFn: async () => {
            const [error, response] = await withCatchAsync(
                InvitationCodeService.verifyInvitationCode(code)
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(
                    errorMessage +
                        ' Branch might not exist or you are not allowed to join any branches'
                )
                throw new Error(errorMessage)
            }

            return response
        },
        enabled: !!code,
        staleTime: 5000,
    })
}

// export const useVerifyInvitationCode = (code: string) => {
//     return createQueryHook<IInvitationCode, string>(
//         ['invitation-code', 'verify'],
//         () => InvitationCodeService.verifyInvitationCode(code),
//         !!code,
//         5000
//     )
// }

export const useFilteredPaginatedInvitationCode = ({
    sort,
    enabled,
    filterPayload,
    preloads = [],
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IInvitationCodePaginated, string> &
    IQueryProps = {}) => {
    return useQuery<IInvitationCodePaginated, string>({
        queryKey: ['bank', 'resource-query', filterPayload, pagination, sort],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                InvitationCodeService.getPaginatedInvitationCode({
                    preloads,
                    pagination,
                    sort: sort && toBase64(sort),
                    filters: filterPayload && toBase64(filterPayload),
                })
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: {
            data: [],
            pages: [],
            totalSize: 0,
            totalPage: 1,
            ...pagination,
        },
        enabled,
        retry: 1,
    })
}

export const useCreateInvitationCode = createMutationHook<
    IInvitationCode,
    string,
    {
        data: IInvitationCodeRequest
        organizationId: TEntityId
        branchId: TEntityId
    }
>(
    (payload) =>
        InvitationCodeService.createInvitationCode(
            payload.data,
            payload.organizationId,
            payload.branchId
        ),
    'New Invitation Code Created'
)

export const useDeleteInvitationCode = (
    invitationCodeId: TEntityId,
    organizationId: TEntityId,
    branchId: TEntityId
) => {
    return createMutationHook<IInvitationCode, string, void>(
        () =>
            InvitationCodeService.deleteInvitationCode(
                invitationCodeId,
                organizationId,
                branchId
            ),
        'Invitation Code Deleted'
    )
}

export const useUpdateInvitationCode = createMutationHook<
    IInvitationCode,
    string,
    {
        data: IInvitationCodeRequest
        invitationCodeId: TEntityId
    }
>(
    (payload) =>
        InvitationCodeService.updateInvitationCode(
            payload.invitationCodeId,
            payload.data
        ),
    'Invitation Code Updated'
)
