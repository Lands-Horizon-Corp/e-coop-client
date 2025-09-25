import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'

import PageContainer from '@/components/containers/page-container'

import { useSubscribe } from '@/hooks/use-pubsub'

import { cashCountBaseKey } from '../../cash-count.service'
import CashCountTable from '../cash-count-table'
import CashCountAction from '../cash-count-table/row-action-context'

const CashCountPage = () => {
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()
    const queryClient = useQueryClient()

    useSubscribe(`cash_count.create.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: [cashCountBaseKey, 'paginated'],
        })
    )

    useSubscribe(`cash_count.update.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: [cashCountBaseKey, 'paginated'],
        })
    )

    useSubscribe(`cash_count.delete.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: [cashCountBaseKey, 'paginated'],
        })
    )

    return (
        <PageContainer>
            <CashCountTable className="max-h-[90vh] min-h-[90vh] w-full" />
        </PageContainer>
    )
}

export default CashCountPage
