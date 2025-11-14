import { useState } from 'react'

import { cn } from '@/helpers'
import { IAccount } from '@/modules/account'
import { ICurrency, currencyFormat } from '@/modules/currency'
import GeneralLedgerTable from '@/modules/general-ledger/components/tables/general-ledger-table'
import MemberAccountingLedgerTable from '@/modules/member-accounting-ledger/components/member-accounting-ledger-table'
import { useMemberAccountingLedgerTotal } from '@/modules/member-accounting-ledger/member-accounting-ledger.service'

import {
    BillIcon,
    BookThickIcon,
    HandCoinsIcon,
    MoneyCheckIcon,
    RefreshIcon,
} from '@/components/icons'
import Modal from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { IBaseProps, TEntityId } from '@/types'

import MemberAccountGeneralLedger from './member-account-general-ledger'

interface Props extends IBaseProps {
    memberProfileId: TEntityId
}

interface MemberAccountingLedgerTotalProps extends IBaseProps {
    memberProfileId: TEntityId
    currency?: ICurrency
}

export const MemberAccountingLedgerTotal = ({
    currency,
    className,
    memberProfileId,
}: MemberAccountingLedgerTotalProps) => {
    const { data, isPending, refetch } = useMemberAccountingLedgerTotal({
        memberProfileId,
    })

    return (
        <div
            className={cn(
                'flex justify-end bg-gradient-to-tr from-card/20 to-primary/10 rounded-2xl relative px-4 py-1 border gap-x-8',
                className
            )}
        >
            <Button
                className="absolute rounded-full size-fit top-2 right-2"
                disabled={isPending}
                onClick={() => refetch()}
                size="icon"
                variant="secondary"
            >
                {isPending ? (
                    <LoadingSpinner className="size-3" />
                ) : (
                    <RefreshIcon className="size-3" />
                )}
            </Button>
            <div className="p-2 space-y-1">
                <p className="text-primary text-xl font-bold">
                    {currencyFormat(
                        data.total_share_capital_plus_fixed_savings,
                        {
                            currency,
                            showSymbol: !!currency,
                        }
                    )}
                </p>

                <p className="text-xs text-muted-foreground shrink truncate">
                    Total Share Capital + Fixed Savings
                </p>
            </div>

            <div className="p-2 space-y-1">
                <p className="text-primary text-xl font-bold">
                    {currencyFormat(data.total_deposits, {
                        currency,
                        showSymbol: !!currency,
                    })}
                </p>

                <p className="text-xs text-muted-foreground truncate shrink">
                    Total Deposits
                </p>
            </div>

            <div className="p-2 space-y-1">
                <p className="text-primary text-xl font-bold">
                    {currencyFormat(data.total_loans, {
                        currency,
                        showSymbol: !!currency,
                    })}
                </p>

                <p className="text-xs text-muted-foreground shrink truncate">
                    Total Loans
                </p>
            </div>
        </div>
    )
}

const MemberAccountingLedger = ({ memberProfileId, className }: Props) => {
    const [focused, setFocused] = useState<
        | {
              memberProfileId: TEntityId
              accountId: TEntityId
              account?: IAccount
          }
        | undefined
    >()

    return (
        <div className={cn('flex flex-col gap-y-4 h-[80vh]', className)}>
            {focused !== undefined && (
                <Modal
                    className={cn('!max-w-[90vw] p-2')}
                    closeButtonClassName="md:hidden"
                    descriptionClassName="hidden"
                    onOpenChange={(state) => {
                        if (!state) setFocused(undefined)
                    }}
                    open={focused !== undefined}
                    titleClassName="hidden"
                >
                    <div className="min-h-[80vh] min-w-[80vw] space-y-4 p-2">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">
                                Account: {focused.account?.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Member Account General Ledger Entries
                            </p>
                        </div>

                        <Tabs
                            className="mt-2 flex-1 flex-col"
                            defaultValue="general-ledger"
                        >
                            <ScrollArea>
                                <TabsList className="mb-3 h-auto min-w-full justify-start gap-2 rounded-none border-b bg-transparent px-0 py-1 text-foreground">
                                    <TabsTrigger
                                        className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 after:duration-300 after:ease-in-out hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                                        value="general-ledger"
                                    >
                                        <BookThickIcon
                                            aria-hidden="true"
                                            className="-ms-0.5 me-1.5 opacity-60"
                                            size={16}
                                        />
                                        General Ledger
                                    </TabsTrigger>

                                    <TabsTrigger
                                        className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 after:duration-300 after:ease-in-out hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                                        value="check-entry"
                                    >
                                        <MoneyCheckIcon
                                            aria-hidden="true"
                                            className="-ms-0.5 me-1.5 opacity-60"
                                            size={16}
                                        />
                                        Check Entry
                                    </TabsTrigger>

                                    <TabsTrigger
                                        className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 after:duration-300 after:ease-in-out hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                                        value="online-entry"
                                    >
                                        <BillIcon
                                            aria-hidden="true"
                                            className="-ms-0.5 me-1.5 opacity-60"
                                            size={16}
                                        />
                                        Online Entry
                                    </TabsTrigger>

                                    <TabsTrigger
                                        className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 after:duration-300 after:ease-in-out hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                                        value="cash-entry"
                                    >
                                        <HandCoinsIcon
                                            aria-hidden="true"
                                            className="-ms-0.5 me-1.5 opacity-60"
                                            size={16}
                                        />
                                        Cash Entry
                                    </TabsTrigger>

                                    <TabsTrigger
                                        className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 after:duration-300 after:ease-in-out hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                                        value="payment-entry"
                                    >
                                        <BillIcon
                                            aria-hidden="true"
                                            className="-ms-0.5 me-1.5 opacity-60"
                                            size={16}
                                        />
                                        Payment Entry
                                    </TabsTrigger>

                                    <TabsTrigger
                                        className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 after:duration-300 after:ease-in-out hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                                        value="withdraw-entry"
                                    >
                                        <HandCoinsIcon
                                            aria-hidden="true"
                                            className="-ms-0.5 me-1.5 opacity-60"
                                            size={16}
                                        />
                                        Withdraw Entry
                                    </TabsTrigger>

                                    <TabsTrigger
                                        className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 after:duration-300 after:ease-in-out hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                                        value="deposit-entry"
                                    >
                                        <HandCoinsIcon
                                            aria-hidden="true"
                                            className="-ms-0.5 me-1.5 opacity-60"
                                            size={16}
                                        />
                                        Deposit Entry
                                    </TabsTrigger>
                                </TabsList>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>

                            <TabsContent asChild value="general-ledger">
                                <MemberAccountGeneralLedger {...focused} />
                            </TabsContent>

                            <TabsContent asChild value="check-entry">
                                <GeneralLedgerTable
                                    accountId={focused.accountId}
                                    className="min-h-[70vh] max-h-[70vh] w-full"
                                    memberProfileId={focused.memberProfileId}
                                    mode="member-account"
                                    TEntryType="check-entry"
                                />
                            </TabsContent>

                            <TabsContent asChild value="online-entry">
                                <GeneralLedgerTable
                                    accountId={focused.accountId}
                                    className="min-h-[70vh] max-h-[70vh] w-full"
                                    memberProfileId={focused.memberProfileId}
                                    mode="member-account"
                                    TEntryType="online-entry"
                                />
                            </TabsContent>

                            <TabsContent asChild value="cash-entry">
                                <GeneralLedgerTable
                                    accountId={focused.accountId}
                                    className="min-h-[70vh] max-h-[70vh] w-full"
                                    memberProfileId={focused.memberProfileId}
                                    mode="member-account"
                                    TEntryType="cash-entry"
                                />
                            </TabsContent>

                            <TabsContent asChild value="payment-entry">
                                <GeneralLedgerTable
                                    accountId={focused.accountId}
                                    className="min-h-[70vh] max-h-[70vh] w-full"
                                    memberProfileId={focused.memberProfileId}
                                    mode="member-account"
                                    TEntryType="payment-entry"
                                />
                            </TabsContent>

                            <TabsContent asChild value="withdraw-entry">
                                <GeneralLedgerTable
                                    accountId={focused.accountId}
                                    className="min-h-[70vh] max-h-[70vh] w-full"
                                    memberProfileId={focused.memberProfileId}
                                    mode="member-account"
                                    TEntryType="withdraw-entry"
                                />
                            </TabsContent>

                            <TabsContent asChild value="deposit-entry">
                                <GeneralLedgerTable
                                    accountId={focused.accountId}
                                    className="min-h-[70vh] max-h-[70vh] w-full"
                                    memberProfileId={focused.memberProfileId}
                                    mode="member-account"
                                    TEntryType="deposit-entry"
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </Modal>
            )}
            <MemberAccountingLedgerTable
                className="w-full flex-1"
                memberProfileId={memberProfileId}
                mode="member"
                onRowClick={(data) =>
                    setFocused({
                        accountId: data.original.account_id,
                        memberProfileId: data.original.member_profile_id,
                        account: data.original.account,
                    })
                }
            />
        </div>
    )
}

export default MemberAccountingLedger
