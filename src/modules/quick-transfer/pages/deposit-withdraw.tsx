import { toast } from 'sonner'

import {
    CurrentTransactionWithdrawHistory,
    QuickTransferTransactionForm,
    TPaymentMode,
} from '@/modules/quick-transfer'
import { TransactionMemberProfile } from '@/modules/transaction'
import { useTransactionBatchStore } from '@/modules/transaction-batch/store/transaction-batch-store'
import TransactionReverseRequestFormModal from '@/modules/transaction/components/modals/transaction-modal-request-reverse'
import TransactionAccountMemberLedger from '@/modules/transaction/components/tables/transaction-account-member-ledger'

import { HandDepositIcon, HandWithdrawIcon } from '@/components/icons'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'

import { TEntityId } from '@/types'

import { useQuickTransferContext } from '../context/quick-transfer-context'

interface QuickTransactionHeaderProps {
    mode: TPaymentMode
}

const modeTextStyle: Record<TPaymentMode, string> = {
    withdraw: 'bg-destructive drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]',
    deposit: 'bg-blue-500 drop-shadow-[0_0_6px_rgba(59,130,246,0.8)]',
    payment: '',
}

export const QuickTransactionHeader = ({
    mode,
}: QuickTransactionHeaderProps) => {
    return (
        <div className="flex justify-between items-center w-full px-5 mb-2">
            <h4
                className={`scroll-m-20 relative text-xl font-semibold tracking-tight flex items-center gap-2`}
            >
                {mode === 'deposit' ? (
                    <HandDepositIcon size={25} />
                ) : (
                    <HandWithdrawIcon size={25} />
                )}
                {`Quick ${mode.charAt(0).toUpperCase()}${mode.slice(1)}`}
                <div
                    className={` absolute w-[20%] -bottom-2 rounded-full h-1 ${modeTextStyle[mode]}`}
                />
            </h4>

            <CurrentTransactionWithdrawHistory mode={mode} />
        </div>
    )
}

interface DepositWithdrawProps {
    mode: TPaymentMode
}

const DepositWithdrawWrapper = ({ mode }: DepositWithdrawProps) => {
    const { hasNoTransactionBatch } = useTransactionBatchStore()

    const { selectedMember, setSelectedAccount, modalTransactionReverseState } =
        useQuickTransferContext()

    const { modalData, isOpen, onClose } = modalTransactionReverseState

    return (
        <>
            <TransactionReverseRequestFormModal
                formProps={{
                    onSuccess: () => {
                        modalData?.onSuccess?.()
                    },
                }}
                onOpenChange={onClose}
                open={isOpen}
                title={modalData?.title || 'Request Reverse Transaction'}
            />
            <div className="flex w-full flex-col space-y-1">
                <QuickTransactionHeader mode={mode} />
            </div>
            <ResizablePanelGroup className="h-[80vh]!" direction="horizontal">
                <ResizablePanel
                    className=" overflow-auto! p-5 ecoop-scroll  "
                    defaultSize={35}
                    maxSize={40}
                    minSize={0}
                >
                    <QuickTransferTransactionForm
                        mode={mode}
                        onSuccess={() => {
                            toast.success('Transaction completed successfully')
                        }}
                        readOnly={!hasNoTransactionBatch}
                    />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel
                    className="overflow-y-auto! px-5 ecoop-scroll relative!"
                    defaultSize={65}
                >
                    <div className="sticky top-0 mb-2 z-50">
                        <TransactionMemberProfile
                            className="bg-sidebar!"
                            memberInfo={selectedMember}
                            viewOnly
                        />
                    </div>
                    <TransactionAccountMemberLedger
                        memberProfileId={selectedMember?.id as TEntityId}
                        onRowClick={(data) => {
                            setSelectedAccount(data.account)
                        }}
                    />
                </ResizablePanel>
            </ResizablePanelGroup>
        </>
    )
}

export default DepositWithdrawWrapper
