import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
    hasPermissionFromAuth,
    useAuthUserWithOrgBranch,
} from '@/modules/authentication/authgentication.store'
import CancelledCashCheckVoucherButton from '@/modules/cancelled-cash-check-voucher/components/cancelled-button'
import PermissionGuard from '@/modules/permission/components/permission-guard'
import { useTransactionBatchStore } from '@/modules/transaction-batch/store/transaction-batch-store'

import PageContainer from '@/components/containers/page-container'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import CashCheckVoucherCreateUpdateFormModal from '../components/forms/cash-check-voucher-create-udate-form-modal'
import CashCheckJournalVoucherTable, {
    CashCheckJournalVoucherTableProps,
} from '../components/tables'

const CashCheckJournalVoucherPage = () => {
    const queryClient = useQueryClient()
    const createModal = useModalState(false)
    const { hasNoTransactionBatch } = useTransactionBatchStore()

    const {
        currentAuth: {
            user_organization: {
                branch_id,
                branch: {
                    branch_setting: { currency, ...otherBranchSettings },
                },
            },
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
            <PermissionGuard action="Read" resourceType="CashCheckVoucher">
                <CashCheckVoucherCreateUpdateFormModal
                    {...createModal}
                    formProps={{
                        defaultValues: {
                            currency,
                            currency_id: currency.id,
                        },
                        orSettings: otherBranchSettings,
                    }}
                />
                <CashCheckJournalVoucherTable
                    className="max-h-[90vh] min-h-[90vh] w-full"
                    toolbarProps={{
                        createActionProps: {
                            disabled: !hasPermissionFromAuth({
                                action: 'Create',
                                resourceType: 'CashCheckVoucher',
                            }),
                            onClick: () => {
                                if (!hasNoTransactionBatch) {
                                    return toast.warning(
                                        'Please create transaction batch first before making any cash/check voucher.'
                                    )
                                }
                                createModal.onOpenChange(true)
                            },
                        },
                        exportActionProps: {
                            disabled: !hasPermissionFromAuth({
                                action: 'Export',
                                resourceType: 'CashCheckVoucher',
                            }),
                        } as NonNullable<
                            CashCheckJournalVoucherTableProps['toolbarProps']
                        >['exportActionProps'],
                        otherActionLeft: <CancelledCashCheckVoucherButton />,
                    }}
                />
            </PermissionGuard>
        </PageContainer>
    )
}

export default CashCheckJournalVoucherPage
