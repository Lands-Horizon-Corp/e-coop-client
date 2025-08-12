import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import { MemberProfileQuickCreateFormModal } from '@/components/forms/member-forms/member-profile-quick-create-form'
import MemberAccountingLedgerTable from '@/components/tables/ledgers-tables/member-accounting-ledger-table'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/(members)/member-accounting-ledger'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const queryClient = useQueryClient()
    const createModal = useModalState()
    const {
        currentAuth: {
            user_organization: { branch_id, organization_id },
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
            <MemberProfileQuickCreateFormModal
                {...createModal}
                formProps={{
                    defaultValues: {
                        organization_id,
                        branch_id,
                    },
                    onSuccess: () => {},
                }}
            />
            <MemberAccountingLedgerTable
                mode="branch"
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
