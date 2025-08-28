import { cn } from '@/helpers'
import { useGetById } from '@/modules/account'
import {
    QuickTransferTransactionForm,
    TPaymentMode,
} from '@/modules/quick-transfer'
import {
    TransactionMemberProfile,
    TransactionNoFoundBatch,
} from '@/modules/transaction'
import { useGetUserSettings } from '@/modules/user-profile'
import { useDepositWithdrawStore } from '@/store/transaction/deposit-withdraw-store'

import PageContainer from '@/components/containers/page-container'
import { HandDepositIcon, HandWithdrawIcon } from '@/components/icons'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'

const QuickDepositWithdraw = ({ mode }: { mode: TPaymentMode }) => {
    const { selectedMember, setOpenMemberPicker, setSelectedAccount } =
        useDepositWithdrawStore()
    const {
        settings_accounting_deposit_default_value_id,
        settings_accounting_withdraw_default_value_id,
    } = useGetUserSettings()

    const accountDefaultValue =
        mode === 'deposit'
            ? settings_accounting_deposit_default_value_id
            : settings_accounting_withdraw_default_value_id

    const { data: account } = useGetById({ id: accountDefaultValue ?? '' })

    return (
        <PageContainer className="flex w-full">
            <TransactionNoFoundBatch />
            <div className="flex w-full flex-col space-y-2">
                <div className="flex justify-start w-full px-5">
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                        {` Quick Transfer ${mode?.charAt(0).toUpperCase()}${mode?.slice(1)}`}
                    </h4>
                    {mode === 'deposit' ? (
                        <HandDepositIcon />
                    ) : (
                        <HandWithdrawIcon />
                    )}
                </div>
                <div
                    className={cn(
                        'm-5 w-16 h-2 rounded-xl',
                        mode == 'withdraw' ? 'bg-red-400' : 'bg-blue-400'
                    )}
                >
                    {' '}
                </div>
                <div
                    className={cn(
                        'm-5 w-16 h-2 rounded-xl blur-md',
                        mode == 'withdraw' ? 'bg-red-400' : 'bg-blue-400'
                    )}
                >
                    {' '}
                </div>
            </div>

            <ResizablePanelGroup direction="horizontal" className="">
                <ResizablePanel
                    defaultSize={40}
                    maxSize={40}
                    className="!min-w-1/3 w-1/3 !overflow-x-auto p-5 ecoop-scroll"
                >
                    <QuickTransferTransactionForm
                        account={account}
                        defaultValues={{
                            account_id: accountDefaultValue ?? undefined,
                        }}
                        mode={mode}
                    />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={70} className="w-1/3 px-5">
                    <div className="w-full flex items-center justify-end">
                        {/* <CurrentTransactionWithdrawHistory mode={mode} /> */}
                    </div>
                    <TransactionMemberProfile
                        memberInfo={selectedMember}
                        onSelectMember={() => {
                            setOpenMemberPicker(true)
                        }}
                        viewOnly
                    />
                    {/* <MemberAccountingLedgerTable
                        mode="member"
                        memberProfileId={
                            (selectedMember?.id ?? undefined) as TEntityId
                        }
                        onRowClick={(data) => {
                            setSelectedAccount(data.original.account)
                        }}
                        actionComponent={(props) => {
                            return (
                                <MemberAccountGeneralLedgerAction
                                    memberAccountLedger={props.row.original}
                                />
                            )
                        }}
                        className="w-full mt-2"
                    /> */}
                </ResizablePanel>
            </ResizablePanelGroup>
        </PageContainer>
    )
}

export default QuickDepositWithdraw
