import { createFileRoute } from '@tanstack/react-router'

import HolidaysTable from '@/components/tables/holidays-table'
import PageContainer from '@/components/containers/page-container'
import HolidayTableAction from '@/components/tables/holidays-table/action'

import { useSubscribe } from '@/hooks/use-pubsub'
import { useQueryClient } from '@tanstack/react-query'
import { useModalState } from '@/hooks/use-modal-state'
import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'
import { HolidayCreateUpdateFormModal } from '@/components/forms/holiday-create-update-form'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/holidays'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const queryClient = useQueryClient()
    const createModal = useModalState(false)
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()

    useSubscribe(`holiday.created.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['holiday', 'resource-query'],
        })
    )

    useSubscribe(`bills_and_coins.updated.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['holiday', 'resource-query'],
        })
    )

    useSubscribe(`bills_and_coins.deleted.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['holiday', 'resource-query'],
        })
    )

    return (
        <PageContainer>
            <HolidayCreateUpdateFormModal
                {...createModal}
                formProps={{
                    defaultValues: {},
                    onSuccess: () => {},
                }}
            />
            <HolidaysTable
                actionComponent={HolidayTableAction}
                toolbarProps={{
                    createActionProps: {
                        onClick: () => createModal.onOpenChange(true),
                    },
                }}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}
