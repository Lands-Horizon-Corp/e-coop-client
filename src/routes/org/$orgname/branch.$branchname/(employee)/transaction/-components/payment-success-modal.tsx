import { CheckFillIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'

import { usePrintGeneralLedgerTransaction } from '@/hooks/api-hooks/use-transaction'

import { IGeneralLedger, TEntityId } from '@/types'

interface PaymentSuccessModalProps extends IModalProps {
    transaction: IGeneralLedger | null
    newTransaction?: () => void
}

const PaymentSuccessModal = ({
    transaction,
    newTransaction,
    onOpenChange,
    ...others
}: PaymentSuccessModalProps) => {
    const { mutate: printGeneralLedgerTransaction } =
        usePrintGeneralLedgerTransaction()

    const memberName = transaction?.member_profile?.full_name

    const handlePrintGeneralLedgerTransaction = (
        generalLedgerId: TEntityId
    ) => {
        printGeneralLedgerTransaction(generalLedgerId)
    }

    if (!transaction) {
        return null
    }

    return (
        <Modal
            {...others}
            footer={
                <div className="flex items-center justify-end w-full space-x-2">
                    <Button
                        onClick={() => newTransaction?.()}
                        variant={'ghost'}
                    >
                        close
                    </Button>
                    <Button
                        onClick={() => {
                            handlePrintGeneralLedgerTransaction(transaction.id)
                            onOpenChange?.(false)
                        }}
                        className=""
                    >
                        Print
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
                        Payment Successful!
                    </p>
                    <p>
                        Successfully added payment to{' '}
                        <span className=" font-extrabold italic">
                            {memberName}
                        </span>
                    </p>
                </div>
            </div>
        </Modal>
    )
}

export default PaymentSuccessModal
