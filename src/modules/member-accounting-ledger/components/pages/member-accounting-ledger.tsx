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
            queryKey: ['member-profile', 'resource-query'],
        })
    })

    useSubscribe(`member_profile.updated.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-profile', 'resource-query'],
        })
    })

    useSubscribe(`member_profile.deleted.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-profile', 'resource-query'],
        })
    })

    return (
        <PageContainer>
            <MemberAccountingLedgerTable
                mode="branch"
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}

export default MemberAccountingLedgerPage
