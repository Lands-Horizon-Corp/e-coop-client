import { cn } from '@/helpers'

import {
    ExcludeIcon,
    ReceiveMoneyIcon,
    SettingsIcon,
    WalletIcon,
} from '@/components/icons'

import { IAccount } from '../../account.types'
import { BooleanFieldDisplay } from './common'

export const DepositAccountContent = ({
    account,
    className,
}: {
    account: IAccount
    className?: string
}) => {
    return (
        <div className={cn('space-y-4 p-4 bg-popover rounded-2xl', className)}>
            <p className="text-sm text-popover-foreground/40 font-semibold">
                Deposit Configuration
            </p>

            {/* Exclude General Ledger Grouping */}
            <BooleanFieldDisplay
                description="Exclude the General ledger Grouping."
                icon={<ExcludeIcon className="size-3" />}
                title="Exclude general ledger grouping"
                value={account.general_ledger_grouping_exclude_account}
            />

            {/* Cash and Cash Equivalence */}
            <BooleanFieldDisplay
                description="Cash and cash equivalents represent the company's funds that are readily available for use in operations, payments, or investment without significant risk of value change."
                icon={<WalletIcon className="size-3" />}
                title="Cash and Cash Equivalence"
                value={account.cash_and_cash_equivalence}
            />

            {/* Account Exclusive Settings */}
            <div className="space-y-3">
                <p className="text-sm font-semibold">
                    Account Exclusive Settings
                </p>

                {/* Internal Account */}
                {account.is_internal && (
                    <BooleanFieldDisplay
                        description="Mark this account as an internal account."
                        icon={<SettingsIcon className="size-3" />}
                        title="Enable Internal Account"
                        value={account.is_internal}
                    />
                )}

                {/* Cash on Hand */}
                {account.cash_on_hand && (
                    <BooleanFieldDisplay
                        description="Enable cash on hand for this account."
                        icon={<WalletIcon className="size-3" />}
                        title="Enable Cash on Hand"
                        value={account.cash_on_hand}
                    />
                )}

                {/* Paid Up Share Capital */}
                {account.paid_up_share_capital && (
                    <BooleanFieldDisplay
                        description="Enable paid up share capital for this account."
                        icon={<ReceiveMoneyIcon className="size-3" />}
                        title="Enable Paid Up Share Capital"
                        value={account.paid_up_share_capital}
                    />
                )}
            </div>
        </div>
    )
}
