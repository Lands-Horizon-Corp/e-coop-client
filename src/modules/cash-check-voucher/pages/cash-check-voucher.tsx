import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { cn } from '@/helpers'
import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import CancelledCashCheckVoucherButton from '@/modules/cancelled-cash-check-voucher/components/cancelled-button'
import { useTransactionBatchStore } from '@/modules/transaction-batch/store/transaction-batch-store'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import CashCheckVoucherCreateUpdateFormModal from '../components/forms/cash-check-voucher-create-udate-form-modal'
import CashCheckJournalVoucherTable from '../components/tables'

const CashCheckJournalVoucherPage = () => {
    const queryClient = useQueryClient()
    const createModal = useModalState(false)
    const { hasNoTransactionBatch } = useTransactionBatchStore()

    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()

    useSubscribe(`cash_check_voucher.created.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['cash-check-voucher', 'paginated'],
        })
    )

    useSubscribe(`cash_check_voucher.updated.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['cash-check-voucher', 'paginated'],
        })
    )

    useSubscribe(`cash_check_voucher.deleted.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['cash-check-voucher', 'paginated'],
        })
    )

    useSubscribe(`cash_check_voucher_entry.created.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['cash-check-voucher', 'paginated'],
        })
    )

    useSubscribe(`cash_check_voucher_entry.updated.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['cash-check-voucher', 'paginated'],
        })
    )

    useSubscribe(`cash_check_voucher_entry.deleted.branch.${branch_id}`, () =>
        queryClient.invalidateQueries({
            queryKey: ['cash-check-voucher', 'paginated'],
        })
    )

    return (
        <PageContainer>
            <CashCheckVoucherCreateUpdateFormModal
                className={cn('!min-w-2xl !max-w-5xl')}
                {...createModal}
            />
            <CashCheckJournalVoucherTable
                toolbarProps={{
                    createActionProps: {
                        onClick: () => {
                            if (!hasNoTransactionBatch) {
                                return toast.warning(
                                    'Please create transaction batch first before making any cash/check voucher.'
                                )
                            }
                            createModal.onOpenChange(true)
                        },
                    },
                    otherActionLeft: <CancelledCashCheckVoucherButton />,
                }}
                className="max-h-[90vh] min-h-[90vh] w-full"
            />
        </PageContainer>
    )
}

export default CashCheckJournalVoucherPage
