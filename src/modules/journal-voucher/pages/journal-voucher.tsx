import { useQueryClient } from '@tanstack/react-query'

import { cn } from '@/helpers'
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

    // const { setSelectedMember } = useMemberPickerStore()

    // Subscribe to events to automatically refresh the data table
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
            <JournalVoucherCreateUpdateFormModal
                className={cn('!min-w-2xl !max-w-5xl')}
                {...createModal}
            />
            <JournalVoucherTable
                toolbarProps={{
                    createActionProps: {
                        onClick: () => {
                            createModal.onOpenChange(true)
                        },
                    },
                }}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}

export default JournalVoucherPage
