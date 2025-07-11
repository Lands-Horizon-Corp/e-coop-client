import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { GeneralLedgerDefinitionAccountsGroupingServices } from '@/api-service/general-ledger-services'
import { serverRequestErrExtractor } from '@/helpers'
import { IGeneralLedgerAccountsGrouping } from '@/types/coop-types/general-ledger-accounts-grouping'
import { withCatchAsync } from '@/utils'

import { IAPIHook, IQueryProps } from '@/types'

export const useGetAllGeneralLedgerAccountsGroupings = ({
    enabled,
    showMessage = true,
}: IAPIHook<IGeneralLedgerAccountsGrouping[], string> & IQueryProps = {}) => {
    return useQuery<IGeneralLedgerAccountsGrouping[], string>({
        queryKey: ['general-ledger-accounts-groupings'],
        queryFn: async () => {
            const [error, result] = await withCatchAsync(
                GeneralLedgerDefinitionAccountsGroupingServices.getAllGeneralLedgerAccountsGrouping()
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                if (showMessage) toast.error(errorMessage)
                throw errorMessage
            }

            return result
        },
        initialData: [],
        enabled,
        retry: 1,
    })
}
