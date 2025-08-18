import { cn } from '@/helpers/tw-utils'
import { useDepositWithdrawStore } from '@/store/transaction/deposit-withdraw-store'

import { QuickTransferTransactionForm } from '@/components/forms/transaction-forms/quick-transaction-form'
import { HandDepositIcon, HandWithdrawIcon } from '@/components/icons'
import SectionTitle from '@/components/member-infos/section-title'
import MemberAccountingLedgerTable from '@/components/tables/ledgers-tables/member-accounting-ledger-table'
import MemberAccountGeneralLedgerAction from '@/components/tables/ledgers-tables/member-accounting-ledger-table/member-account-general-ledger-table/actions'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'

import { useAccountById } from '@/hooks/api-hooks/use-account'
import { useGetUserSettings } from '@/hooks/use-get-use-settings'

import { TEntityId, TPaymentMode } from '@/types'

import MemberProfileTransactionView from '../../-components/member-profile-view-card'
import NoTransactionBatchWarningModal from '../../-components/no-transaction-batch'
import CurrentTransactionWithdrawHistory from './current-deposit-withdraw-transaction-history'

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

    const { data: account } = useAccountById(accountDefaultValue ?? '')

    return (
        <>
            <NoTransactionBatchWarningModal />
            <div className="flex w-full flex-col space-y-2">
                <div className="flex justify-start w-full px-5">
                    <SectionTitle
                        title={` Quick Transfer ${mode?.charAt(0).toUpperCase()}${mode?.slice(1)}`}
                        Icon={
                            mode === 'deposit'
                                ? HandDepositIcon
                                : HandWithdrawIcon
                        }
                    />
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
                        <CurrentTransactionWithdrawHistory mode={mode} />
                    </div>
                    <MemberProfileTransactionView
                        memberInfo={selectedMember}
                        onSelectMember={() => {
                            setOpenMemberPicker(true)
                        }}
                        viewOnly
                    />
                    <MemberAccountingLedgerTable
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
                    />
                </ResizablePanel>
            </ResizablePanelGroup>
        </>
    )
}

export default QuickDepositWithdraw
