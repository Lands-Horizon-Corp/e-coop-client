// import { serverRequestErrExtractor } from '@/helpers'
// import { IMemberProfilePaginatedPicker } from '@/server'
// import MemberProfileService, {
//     IMemberProfilePickerParams,
// } from '@/server/api-service/member-services/member-profile-service'
// import { withCatchAsync, toBase64 } from '@/utils'
// import { useQuery } from '@tanstack/react-query'
// import { toast } from 'sonner'

// export const useMemberProfilesPicker = ({
//     sort,
//     enabled = true,
//     filters,
//     pagination = { pageIndex: 1, pageSize: 10 },
// }: IMemberProfilePickerParams & { enabled?: boolean } = {}) => {
//     return useQuery<IMemberProfilePaginatedPicker, string>({
//         queryKey: ['member-profiles-picker', filters, pagination, sort],
//         queryFn: async () => {
//             const [error, result] = await withCatchAsync(
//                 MemberProfileService.getMemberProfilesForPicker({
//                     pagination,
//                     sort: sort && toBase64(sort),
//                     filters: filters && toBase64(filters),
//                 })
//             )

//             if (error) {
//                 const errorMessage = serverRequestErrExtractor({ error })
//                 toast.error(errorMessage)
//                 throw errorMessage
//             }

//             return result
//         },
//         initialData: {
//             data: [],
//             pages: [],
//             totalSize: 0,
//             totalPage: 1,
//             ...pagination,
//         },
//         retry: 1,
//         enabled,
//     })
// }
