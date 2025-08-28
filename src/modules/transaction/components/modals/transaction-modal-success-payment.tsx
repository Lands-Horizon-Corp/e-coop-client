import { toReadableDate } from '@/helpers/date-utils'
import { IGeneralLedger } from '@/modules/general-ledger'
import { usePrintGeneralLedgerTransaction } from '@/modules/transaction'
import { useTransactionStore } from '@/store/transaction/transaction-store'

import { CheckFillIcon, DoorExitFillIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'

import { useShortcut } from '@/hooks/use-shorcuts'

import { TEntityId } from '@/types'

interface PaymentSuccessModalProps extends IModalProps {
    transaction: IGeneralLedger | null
    onClose?: () => void
    isOpen?: boolean
}

const TransactionModalSuccessPayment = ({
    transaction,
    onClose,
    isOpen,
    ...props
}: PaymentSuccessModalProps) => {
    const { mutate: printGeneralLedgerTransaction } =
        usePrintGeneralLedgerTransaction()

    const { focusTypePayment } = useTransactionStore()

    const memberName = transaction?.member_profile?.full_name

    const handlePrintGeneralLedgerTransaction = (
        generalLedgerId: TEntityId
    ) => {
        printGeneralLedgerTransaction({ id: generalLedgerId })
    }

    useShortcut(
        'enter',
        () => {
            if (!transaction || !isOpen) return
            handlePrintGeneralLedgerTransaction(transaction.id)
            onClose?.()
        },
        { disableTextInputs: true }
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
                    <Button
                        onClick={() => onClose?.()}
                        tabIndex={-1}
                        type="submit"
                        variant={'ghost'}
                    >
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
                        <span className="text-lg ml-2 translate-y-[2px]">
                            ↵
                        </span>
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
                        ID: {transaction.id}
                    </p>
                </div>
            </div>
        </Modal>
    )
}

export default TransactionModalSuccessPayment
