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
            {/* <TransactionNoFoundBatch /> */}
            <div className="flex w-full flex-col space-y-1">
                <div className="flex justify-start items-center space-x-2 w-full px-5">
                    {mode === 'deposit' ? (
                        <HandDepositIcon size={25} />
                    ) : (
                        <HandWithdrawIcon size={25} />
                    )}
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                        {` Quick Transfer ${mode?.charAt(0).toUpperCase()}${mode?.slice(1)}`}
                    </h4>
                </div>
                <div
                    className={`
        mx-5 my-3 w-16 h-2 relative rounded-xl
        ${
            mode === 'withdraw'
                ? 'bg-red-400 before:bg-red-400 before:content-[""]'
                : 'bg-blue-400 before:bg-blue-400 before:content-[""]'
        }
           before:absolute before:w-16 before:h-2 before:blur-sm before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2
      `}
                />
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
