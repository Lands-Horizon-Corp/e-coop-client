import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import { HolidayCreateUpdateFormModal } from '../forms/holiday-create-update-form'
import HolidaysTable from '../holidays-table'
import HolidayAction from '../holidays-table/row-action-context'

const HolidayPage = () => {
    const queryClient = useQueryClient()
    const createModal = useModalState(false)
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()

    useSubscribe(`holiday.created.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['holiday', 'paginated'],
        })
    )

    useSubscribe(`bills_and_coins.updated.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['holiday', 'paginated'],
        })
    )

    useSubscribe(`bills_and_coins.deleted.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['holiday', 'paginated'],
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
                actionComponent={HolidayAction}
                className="max-h-[90vh] min-h-[90vh] w-full"
                toolbarProps={{
                    createActionProps: {
                        onClick: () => createModal.onOpenChange(true),
                    },
                }}
            />
        </PageContainer>
    )
}

export default HolidayPage
