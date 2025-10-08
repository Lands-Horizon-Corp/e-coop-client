import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'

import PageContainer from '@/components/containers/page-container'

import { useSubscribe } from '@/hooks/use-pubsub'

import MemberAccountingLedgerTable from '../member-accounting-ledger-table'

const MemberAccountingLedgerPage = () => {
    const queryClient = useQueryClient()
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()

    useSubscribe(`member_accounting_ledger.created.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-profile', 'paginated'],
        })
    })

    useSubscribe(`member_profile.updated.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-profile', 'paginated'],
        })
    })

    useSubscribe(`member_profile.deleted.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-profile', 'paginated'],
        })
    })

    return (
        <PageContainer>
            <MemberAccountingLedgerTable
                className="max-h-[90vh] min-h-[90vh] w-full"
                mode="branch"
            />
        </PageContainer>
    )
}

export default MemberAccountingLedgerPage
