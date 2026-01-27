import { toast } from 'sonner'

import { toReadableDate } from '@/helpers/date-utils'
import { IGeneralLedger } from '@/modules/general-ledger'
import { usePrintGeneralLedgerTransaction } from '@/modules/transaction'
import { useTransactionStore } from '@/store/transaction/transaction-store'
import { useHotkeys } from 'react-hotkeys-hook'

import { CheckFillIcon, DoorExitFillIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'

import { useInternalState } from '@/hooks/use-internal-state'

import { TEntityId } from '@/types'

import { useTransactionContext } from '../../context/transaction-context'

interface TransactionModalSuccessProps extends IModalProps {
    onClose?: () => void
    generalLedger?: IGeneralLedger
}

const TransactionModalSuccessPayment = ({
    onClose,
    generalLedger,
    onOpenChange,
    open,
}: TransactionModalSuccessProps) => {
    const [state, setState] = useInternalState(false, open, onOpenChange)

    const { accountPicker } = useTransactionContext()

    const generalLedgerId = generalLedger?.id

    const { mutate: printGeneralLedgerTransaction } =
        usePrintGeneralLedgerTransaction({
            options: {
                onSuccess: () => {
                    toast.success('Printing generalLedger...')
                },
            },
        })

    const { focusTypePayment } = useTransactionStore()

    const memberName = generalLedger?.member_profile?.full_name

    const handlePrintGeneralLedgerTransaction = (
        generalLedgerId: TEntityId
    ) => {
        printGeneralLedgerTransaction({ id: generalLedgerId })
    }

    useHotkeys('enter', (e) => {
        e.preventDefault()
        if (!generalLedger || !state) return
        accountPicker.onOpenChange(true)
        handlePrintGeneralLedgerTransaction(generalLedger.id)
        setState(false)
    })

    const paymentType =
        focusTypePayment === 'withdraw' ? 'Withdrawal' : focusTypePayment

    if (!generalLedger) {
        return null
    }

    return (
        <Modal
            footer={
                <div className="flex items-center justify-end w-full space-x-2">
                    <Button
                        onClick={() => {
                            accountPicker.onOpenChange(true)
                            setState(false)
                        }}
                        tabIndex={-1}
                        type="submit"
                        variant={'ghost'}
                    >
                        close
                        <DoorExitFillIcon className="ml-2" size={20} />
                    </Button>
                    <Button
                        onClick={() => {
                            if (generalLedgerId) {
                                handlePrintGeneralLedgerTransaction(
                                    generalLedgerId
                                )
                                accountPicker.onOpenChange(true)
                                setState(false)
                            } else {
                                toast.error('General Ledger not Found!')
                            }
                        }}
                    >
                        Print
                        <span className="text-lg ml-2 translate-y-[2px]">
                            ↵
                        </span>
                    </Button>
                </div>
            }
            onOpenChange={(newState) => {
                if (!newState) {
                    accountPicker.onOpenChange(true)
                    onClose?.()
                }
                return setState(newState)
            }}
            open={state}
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
