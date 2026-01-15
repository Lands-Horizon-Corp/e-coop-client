import { cn } from '@/helpers'
import { currencyFormat } from '@/modules/currency'

import {
    ArrowTrendUpIcon,
    BankIcon,
    BookThickIcon,
    BoxesStackedIcon,
    DiamondRingIcon,
    HandsHelpingIcon,
    MoneyStackIcon,
    NotAllowedIcon,
    RecycleIcon,
    ShoppingCartIcon,
    TagIcon,
    Users3FillIcon,
} from '@/components/icons'
import { Separator } from '@/components/ui/separator'

import { IAccount } from '../../account.types'
import { BooleanFieldDisplay } from './common'

export const AccountCommonConfig = ({ account }: { account: IAccount }) => {
    return (
        <div className="bg-popover rounded-2xl space-y-4 p-4">
            <p className="text-sm text-popover-foreground/40 font-semibold">
                Common Account Configurations
            </p>

            <div className="space-y-2 rounded-xl">
                <p className="font-medium text-sm">General Configuration</p>
                <div className="space-y-2 p-4 rounded-xl border bg-secondary/50 text-secondary-foreground text-sm">
                    <div className="flex gap-x-4 justify-between items-center">
                        <span>
                            <BookThickIcon className="inline mr-1" /> General
                            Ledger Type
                        </span>
                        <Separator className="flex-1" />
                        {account.general_ledger_type ? (
                            <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                                {account.general_ledger_type}
                            </span>
                        ) : (
                            <span className="text-muted-foreground px-3 py-1">
                                none
                            </span>
                        )}
                    </div>
                    <div className="flex gap-x-4 justify-between items-center">
                        <span>
                            <TagIcon className="inline mr-1" /> General Account
                            Category
                        </span>
                        <Separator className="flex-1" />
                        {account.account_category?.name ? (
                            <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                                {account.account_category.name}
                            </span>
                        ) : (
                            <span className="text-muted-foreground px-3 py-1">
                                none
                            </span>
                        )}
                    </div>
                    <div className="flex gap-x-4 justify-between items-center">
                        <span>
                            <BoxesStackedIcon className="inline mr-1" /> Account
                            Classification
                        </span>
                        <Separator className="flex-1" />
                        {account.account_classification?.name ? (
                            <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                                {account.account_classification.name}
                            </span>
                        ) : (
                            <span className="text-muted-foreground px-3 py-1">
                                none
                            </span>
                        )}
                    </div>
                    <div className="flex gap-x-4 justify-between items-center">
                        <span>
                            <Users3FillIcon className="inline mr-1" /> Member
                            Type
                        </span>
                        <Separator className="flex-1" />
                        {account.member_type?.name ? (
                            <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                                {account.member_type.name}
                            </span>
                        ) : (
                            <span className="text-muted-foreground px-3 py-1">
                                none
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Other Account Information Options */}
            <div className="space-y-3">
                <p className="font-medium text-sm">
                    Other Account Information / Classification
                </p>
                {/* None */}
                <div
                    className={cn(
                        'relative flex w-full items-center gap-3 rounded-2xl border px-3 py-2',
                        account.other_information_of_an_account === 'None'
                            ? 'border-primary bg-primary/20'
                            : 'border-input bg-muted/30 hidden'
                    )}
                >
                    <div className="flex size-fit shrink-0 items-center justify-center rounded-lg bg-background p-2">
                        <NotAllowedIcon className="size-3" />
                    </div>
                    <div className="flex-1 text-sm">
                        <p className="font-medium">None</p>
                        <p className="text-sm text-muted-foreground">
                            No other specific information is assigned.
                        </p>
                    </div>
                </div>
                {/* Jewelry */}
                <div
                    className={cn(
                        'relative flex w-full items-center gap-3 rounded-2xl border px-3 py-2',
                        account.other_information_of_an_account === 'Jewelry'
                            ? 'border-primary bg-primary/20'
                            : 'border-input bg-muted/30 hidden'
                    )}
                >
                    <div className="flex size-fit shrink-0 items-center justify-center rounded-lg bg-background p-2">
                        <DiamondRingIcon className="size-3" />
                    </div>
                    <div className="flex-1 text-sm">
                        <p className="font-medium">Jewelry</p>
                        <p className="text-sm text-muted-foreground">
                            This account is related to jewelry.
                        </p>
                    </div>
                </div>
                {/* Grocery */}
                <div
                    className={cn(
                        'relative flex w-full items-center gap-3 rounded-2xl border px-3 py-2',
                        account.other_information_of_an_account === 'Grocery'
                            ? 'border-primary bg-primary/20'
                            : 'border-input bg-muted/30 hidden'
                    )}
                >
                    <div className="flex size-fit shrink-0 items-center justify-center rounded-lg bg-background p-2">
                        <ShoppingCartIcon className="size-3" />
                    </div>
                    <div className="flex-1 text-sm">
                        <p className="font-medium">Grocery</p>
                        <p className="text-sm text-muted-foreground">
                            This account is related to groceries.
                        </p>
                    </div>
                </div>
                {/* Track Loan Deduction */}
                <div
                    className={cn(
                        'relative flex w-full items-center gap-3 rounded-2xl border px-3 py-2',
                        account.other_information_of_an_account ===
                            'Track Loan Deduction'
                            ? 'border-primary bg-primary/20'
                            : 'border-input bg-muted/30 hidden'
                    )}
                >
                    <div className="flex size-fit shrink-0 items-center justify-center rounded-lg bg-background p-2">
                        <ArrowTrendUpIcon className="size-3" />
                    </div>
                    <div className="flex-1 text-sm">
                        <p className="font-medium">Track Loan Deduction</p>
                        <p className="text-sm text-muted-foreground">
                            Track loan deductions for this account.
                        </p>
                    </div>
                </div>
                {/* Restructured */}
                <div
                    className={cn(
                        'relative flex w-full items-center gap-3 rounded-2xl border px-3 py-2',
                        account.other_information_of_an_account ===
                            'Restructured'
                            ? 'border-primary bg-primary/20'
                            : 'border-input bg-muted/30 hidden'
                    )}
                >
                    <div className="flex size-fit shrink-0 items-center justify-center rounded-lg bg-background p-2">
                        <RecycleIcon className="size-3" />
                    </div>
                    <div className="flex-1 text-sm">
                        <p className="font-medium">Restructured</p>
                        <p className="text-sm text-muted-foreground">
                            This account has been restructured.
                        </p>
                    </div>
                </div>
                {/* Cash in Bank / Cash in Check Account */}
                <div
                    className={cn(
                        'relative flex w-full items-center gap-3 rounded-2xl border px-3 py-2',
                        account.other_information_of_an_account ===
                            'Cash in Bank / Cash in Check Account'
                            ? 'border-primary bg-primary/20'
                            : 'border-input bg-muted/30 hidden'
                    )}
                >
                    <div className="flex size-fit shrink-0 items-center justify-center rounded-lg bg-background p-2">
                        <BankIcon className="size-3" />
                    </div>
                    <div className="flex-1 text-sm">
                        <p className="font-medium">
                            Cash in Bank / Cash in Check Account
                        </p>
                        <p className="text-sm text-muted-foreground">
                            This account represents cash in bank or cash in
                            check account.
                        </p>
                    </div>
                </div>
                {/* Cash on Hand */}
                <div
                    className={cn(
                        'relative flex w-full items-center gap-3 rounded-2xl border px-3 py-2',
                        account.other_information_of_an_account ===
                            'Cash on Hand'
                            ? 'border-primary bg-primary/20'
                            : 'border-input bg-muted/30 hidden'
                    )}
                >
                    <div className="flex size-fit shrink-0 items-center justify-center rounded-lg bg-background p-2">
                        <MoneyStackIcon className="size-3" />
                    </div>
                    <div className="flex-1 text-sm">
                        <p className="font-medium">Cash on Hand</p>
                        <p className="text-sm text-muted-foreground">
                            This account represents physical cash on hand.
                        </p>
                    </div>
                </div>
            </div>

            {/* Compassion / Dmaayan */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <p className="font-medium text-sm">
                        Compasssion Fund Config (Damayan)
                    </p>
                    <p className="font-medium text-sm">
                        Allocated :{' '}
                        <span className="text-primary">
                            {currencyFormat(account.compassion_fund_amount, {
                                currency: account.currency,
                                showSymbol: !!account.currency,
                            })}
                        </span>
                    </p>
                </div>
                <BooleanFieldDisplay
                    description="This account is enabled/designated for compassion fund (Damayan) purposes and the allocated amount is regarded accordingly."
                    icon={<HandsHelpingIcon className="size-3" />}
                    title="Compassion Fund"
                    value={account.compassion_fund}
                />
            </div>
        </div>
    )
}
