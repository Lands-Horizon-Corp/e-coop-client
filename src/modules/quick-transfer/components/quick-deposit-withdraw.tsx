import { toast } from 'sonner'

// import { SHORTCUT_SCOPES } from '@/constants';
import {
    CurrentTransactionWithdrawHistory,
    QuickTransferTransactionForm,
    TPaymentMode,
} from '@/modules/quick-transfer'
import { TransactionMemberProfile } from '@/modules/transaction'
import { useTransactionBatchStore } from '@/modules/transaction-batch/store/transaction-batch-store'
import TransactionAccountMemberLedger from '@/modules/transaction/components/tables/transaction-account-member-ledger'
import { useDepositWithdrawStore } from '@/store/transaction/deposit-withdraw-store'

import PageContainer from '@/components/containers/page-container'
import { HandDepositIcon, HandWithdrawIcon } from '@/components/icons'
// import { useShortcutContext } from '@/components/shorcuts/general-shortcuts-wrapper'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'

import { TEntityId } from '@/types'

const QuickDepositWithdraw = ({ mode }: { mode: TPaymentMode }) => {
    const { selectedMember, setSelectedAccount } = useDepositWithdrawStore()
    const { hasNoTransactionBatch } = useTransactionBatchStore()
    // const { setActiveScope } = useShortcutContext()
    return (
        // <div onMouseOver={() => setActiveScope(SHORTCUT_SCOPES.QUICK_TRANSFER)}>
        <div>
            <PageContainer className="flex w-full !overflow-hidden">
                <div className="flex w-full flex-col space-y-1">
                    <div className="flex justify-start items-center space-x-2 w-full px-5">
                        {mode === 'deposit' ? (
                            <HandDepositIcon size={25} />
                        ) : (
                            <HandWithdrawIcon size={25} />
                        )}
                        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                            {` Quick ${mode?.charAt(0).toUpperCase()}${mode?.slice(1)}`}
                        </h4>
                    </div>
                    <div
                        className={`
        mx-5 my-3 w-16 h-2 relative rounded-xl
        ${
            mode === 'withdraw'
                ? 'bg-destructive before:bg-destructive before:content-[""]'
                : 'bg-blue-400 before:bg-blue-400 before:content-[""]'
        }
           before:absolute before:w-16 before:h-2 before:blur-sm before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2
      `}
                    />
                </div>
                <ResizablePanelGroup
                    className="!h-[80vh]"
                    direction="horizontal"
                >
                    <ResizablePanel
                        className=" !overflow-auto p-5 ecoop-scroll  "
                        defaultSize={35}
                        maxSize={40}
                        minSize={0}
                    >
                        <QuickTransferTransactionForm
                            mode={mode}
                            onSuccess={() => {
                                toast.success(
                                    'Transaction completed successfully'
                                )
                            }}
                            readOnly={!hasNoTransactionBatch}
                        />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel
                        className="!overflow-y-auto px-5 ecoop-scroll !relative"
                        defaultSize={65}
                    >
                        <div className="w-full flex items-center justify-end">
                            <CurrentTransactionWithdrawHistory mode={mode} />
                        </div>
                        <div className="sticky top-0 z-50">
                            <TransactionMemberProfile
                                className="!bg-sidebar"
                                memberInfo={selectedMember}
                                viewOnly
                            />
                        </div>
                        <TransactionAccountMemberLedger
                            memberProfileId={selectedMember?.id as TEntityId}
                            onRowClick={(data) => {
                                setSelectedAccount(data.original.account)
                            }}
                        />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </PageContainer>
        </div>
    )
}

export default QuickDepositWithdraw
