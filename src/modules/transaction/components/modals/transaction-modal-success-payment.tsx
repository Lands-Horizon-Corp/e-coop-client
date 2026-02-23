import { toast } from 'sonner'

import { toReadableDate } from '@/helpers/date-utils'
import { usePrintGeneralLedgerTransaction } from '@/modules/transaction'
import { useTransactionStore } from '@/store/transaction/transaction-store'
import { useHotkeys } from 'react-hotkeys-hook'

import { CheckFillIcon, DoorExitFillIcon } from '@/components/icons'
import Modal from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'

import { usePaymentOnSuccessStore } from '../../hooks/use-transaction-payment-success'

interface TransactionModalSuccessProps {
    onOpenPicker?: () => void
}
const TransactionModalSuccessPayment = ({
    onOpenPicker,
}: TransactionModalSuccessProps) => {
    const {
        open,
        generalLedgerId,
        onClear,
        generalLedger,
        onOpenChange,
        mode,
    } = usePaymentOnSuccessStore()

    const { mutateAsync: printGeneralLedgerTransaction, isPending } =
        usePrintGeneralLedgerTransaction({
            options: {
                onSuccess: () => {
                    toast.success('Printing general ledger...')
                },
            },
        })
    const { focusTypePayment } = useTransactionStore()

    const handlePrint = async () => {
        if (!generalLedgerId) {
            return
        }

        try {
            await printGeneralLedgerTransaction({
                id: generalLedgerId,
            })
            onOpenPicker?.()
            onClear()
        } catch {
            toast.error('Failed to print general ledger')
        }
    }

    useHotkeys(
        'enter',
        async (e) => {
            e.preventDefault()
            if (!generalLedgerId || isPending) return
            await handlePrint()
        },
        [isPending, generalLedgerId]
    )

    const memberName = generalLedger?.member_profile?.full_name

    const paymentType = mode === 'withdraw' ? 'Withdrawal' : mode

    if (!generalLedger || !generalLedgerId) {
        return null
    }

    return (
        <Modal
            footer={
                <div className="flex items-center justify-end w-full space-x-2">
                    <Button
                        onClick={() => {
                            onOpenPicker?.()
                            onClear()
                        }}
                        tabIndex={-1}
                        type="submit"
                        variant={'ghost'}
                    >
                        close
                        <DoorExitFillIcon className="ml-2" size={20} />
                    </Button>
                    <Button
                        disabled={isPending}
                        onClick={async () => {
                            await handlePrint()
                        }}
                    >
                        {isPending ? <LoadingSpinner /> : 'Print'}
                        <span className="text-lg ml-2 translate-y-[2px]">
                            ↵
                        </span>
                    </Button>
                </div>
            }
            onOpenChange={(newState) => {
                if (!newState) {
                    onOpenPicker?.()
                    onClear()
                }
                onOpenChange(newState)
            }}
            open={open}
        >
            <div className="flex items-center justify-center w-full h-full">
                <div className="flex flex-col items-center justify-center gap-2">
                    <span className="size-16 bg-primary/20 flex items-center justify-center rounded-full">
                        <CheckFillIcon className=" text-primary" size={25} />
                    </span>
                    <p className="font-bold text-2xl dark:text-white">
                        {paymentType.charAt(0).toUpperCase() +
                            paymentType.slice(1)}{' '}
                        {focusTypePayment === 'payment' ? '' : 'payment'}{' '}
                        Successful!
                    </p>
                    <p className="text-muted-foreground text-sm">
                        <span className="text-primary font-extrabold ">
                            {memberName}{' '}
                        </span>
                        Successfully added {paymentType}
                        <span>
                            {' '}
                            {paymentType === 'Withdrawal' ? 'from' : 'for'}{' '}
                        </span>
                        <span className="text-primary italic">
                            {generalLedger.account?.name}
                        </span>
                    </p>
                    <p className="text-muted-foreground text-sm">
                        {toReadableDate(generalLedger.created_at)}
                    </p>
                    <p className="text-muted-foreground text-sm border flex items-center p-1 rounded-sm bg-secondary">
                        ID: {generalLedger.id}
                    </p>
                </div>
            </div>
        </Modal>
    )
}

export default TransactionModalSuccessPayment
