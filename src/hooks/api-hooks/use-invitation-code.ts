import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { InvitationCodeService } from '@/api-service/invitation-code-services'
import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'

import {
    IAPIFilteredPaginatedHook,
    IAPIHook,
    IInvitationCode,
    IInvitationCodePaginated,
    IInvitationCodeRequest,
    IQueryProps,
    TEntityId,
} from '@/types'

import { createMutationHook } from '../../factory/api-hook-factory'

export const useInvitationCodeByCode = ({
    code,
    onError,
    onSuccess,
    showMessage,
    ...other
}: IAPIHook<IInvitationCode> &
    IQueryProps<IInvitationCode> & { code: string }) => {
    return useQuery<IInvitationCode, string>({
        queryKey: ['invitation-code', code],
        queryFn: async () => {
            const [error, data] = await withCatchAsync(
                InvitationCodeService.verifyInvitationCode(code)
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage)
                    toast.error(
                        errorMessage +
                            ' Branch might not exist or you are not allowed to join any branches'
                    )
                onError?.(errorMessage, error)
                throw errorMessage
            }

            if (showMessage) toast.success('Invitation code found')
            onSuccess?.(data)
            return data
        },
        ...other,
    })
}

export const useFilteredPaginatedInvitationCode = ({
    sort,
    enabled,
    filterPayload,
    showMessage = true,
    pagination = { pageSize: 10, pageIndex: 1 },
}: IAPIFilteredPaginatedHook<IInvitationCodePaginated, string> &
    IQueryProps = {}) => {
    return useQuery<IInvitationCodePaginated, string>({
        queryKey: [
            'invitation-code',
            'resource-query',
            filterPayload,
            pagination,
            sort,
        ],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                InvitationCodeService.getPaginatedInvitationCode({
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
    }
>(
    (payload) => InvitationCodeService.createInvitationCode(payload.data),
    'New Invitation Code Created'
)

export const useDeleteInvitationCode = createMutationHook<
    IInvitationCode,
    string,
    TEntityId
>(
    (invitationCodeId) =>
        InvitationCodeService.deleteInvitationCode(invitationCodeId),
    'Invitation Code Deleted'
)

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
