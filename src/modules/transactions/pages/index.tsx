import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'

import PageContainer from '@/components/containers/page-container'

import { useSubscribe } from '@/hooks/use-pubsub'

import TransactionsTable from '../components/tables'

export default function TransactionPage() {
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()
    const queryClient = useQueryClient()

    useSubscribe(`transaction.create.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['transaction', paginated, 'current-branch'],
        })
    })

    useSubscribe(`transaction.update.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['transaction', paginated, 'current-branch'],
        })
    })

    useSubscribe(`transaction.delete.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['transaction', paginated, 'current-branch'],
        })
    })

    return (
        <PageContainer>
            <TransactionsTable
                mode="current-branch"
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
