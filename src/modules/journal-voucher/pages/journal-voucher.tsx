import { useQueryClient } from '@tanstack/react-query'

import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import { JournalVoucherCreateUpdateFormModal } from '../components/forms/journal-voucher-create-update-modal'
import JournalVoucherTable from '../components/tables'

const JournalVoucherPage = () => {
    const queryClient = useQueryClient()
    const createModal = useModalState(false)
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()

    useSubscribe(`journal_voucher.created.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['journal-voucher', 'paginated'],
        })
    )

    useSubscribe(`journal_voucher.updated.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['journal-voucher', 'paginated'],
        })
    )

    useSubscribe(`journal_voucher.deleted.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['journal-voucher', 'paginated'],
        })
    )

    useSubscribe(`journal_voucher_entry.created.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['journal-voucher', 'paginated'],
        })
    )

    useSubscribe(`journal_voucher_entry.updated.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['journal-voucher', 'paginated'],
        })
    )

    useSubscribe(`journal_voucher_entry.deleted.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['journal-voucher', 'paginated'],
        })
    )

    return (
        <PageContainer>
            <JournalVoucherCreateUpdateFormModal {...createModal} />
            <JournalVoucherTable
                className="max-h-[90vh] min-h-[90vh] w-full"
                toolbarProps={{
                    createActionProps: {
                        onClick: () => {
                            createModal.onOpenChange(true)
                        },
                    },
                }}
            />
        </PageContainer>
    )
}

export default JournalVoucherPage
