import { usePaymentsDataStore } from '@/store/transaction/payments-entry-store'
import { toReadableDate } from '@/utils'

import CopyTextButton from '@/components/copy-text-button'
import { CheckFillIcon, DoorExitFillIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'

import { usePrintGeneralLedgerTransaction } from '@/hooks/api-hooks/use-transaction'
import { useShortcut } from '@/hooks/shortcut-hooks/use-shorcuts'

import { IGeneralLedger, TEntityId } from '@/types'

interface PaymentSuccessModalProps extends IModalProps {
    transaction: IGeneralLedger | null
    onClose?: () => void
}

const PaymentSuccessModal = ({
    transaction,
    onClose,
    ...props
}: PaymentSuccessModalProps) => {
    const { mutate: printGeneralLedgerTransaction } =
        usePrintGeneralLedgerTransaction()

    const { focusTypePayment } = usePaymentsDataStore()

    const memberName = transaction?.member_profile?.full_name

    const handlePrintGeneralLedgerTransaction = (
        generalLedgerId: TEntityId
    ) => {
        printGeneralLedgerTransaction(generalLedgerId)
    }

    useShortcut(
        'enter',
        () => {
            if (!transaction) return
            handlePrintGeneralLedgerTransaction(transaction.id)
            onClose?.()
        },
        { disableTextInputs: true, disableActiveButton: true }
    )

    const paymentType =
        focusTypePayment === 'withdraw' ? 'Withdrawal' : focusTypePayment

    if (!transaction) {
        return null
    }

    return (
        <Modal
            {...props}
            footer={
                <div className="flex items-center justify-end w-full space-x-2">
                    <Button onClick={() => onClose?.()} variant={'ghost'}>
                        close
                        <DoorExitFillIcon size={20} className="ml-2" />
                    </Button>
                    <Button
                        onClick={() => {
                            handlePrintGeneralLedgerTransaction(transaction.id)
                            onClose?.()
                        }}
                    >
                        Print
                        <span className="text-lg ml-2">↵</span>
                    </Button>
                </div>
            }
        >
            <div className="flex items-center justify-center w-full h-full">
                <div className="flex flex-col items-center justify-center gap-2">
                    <span className="size-16 bg-primary/20 flex items-center justify-center rounded-full">
                        <CheckFillIcon size={25} className=" text-primary" />
                    </span>
                    <p className="font-bold text-2xl text-white">
                        {paymentType.charAt(0).toUpperCase() +
                            paymentType.slice(1)}{' '}
                        {focusTypePayment === 'payment' ? '' : 'payment'}{' '}
                        Successful!
                    </p>
                    <p className="text-muted-foreground text-sm">
                        Successfully added {paymentType} to{' '}
                        <span className=" font-extrabold italic">
                            {memberName}
                        </span>
                    </p>
                    <p className="text-muted-foreground text-sm">
                        {toReadableDate(transaction.created_at)}
                    </p>
                    <p className="text-muted-foreground text-sm border flex items-center p-1 rounded-sm bg-secondary">
                        Id: {transaction.id}
                        <span className="ml-2">
                            <CopyTextButton textContent={transaction.id} />
                        </span>
                    </p>
                </div>
            </div>
        </Modal>
    )
}

export default PaymentSuccessModal
