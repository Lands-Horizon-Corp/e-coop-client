import { useState } from 'react'

import { cn } from '@/helpers'
import { formatNumber } from '@/helpers/number-utils'
import { IAccount } from '@/modules/account'
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
}

export const MemberAccountingLedgerTotal = ({
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
                size="icon"
                variant="secondary"
                disabled={isPending}
                onClick={() => refetch()}
                className="absolute rounded-full size-fit top-2 right-2"
            >
                {isPending ? (
                    <LoadingSpinner className="size-3" />
                ) : (
                    <RefreshIcon className="size-3" />
                )}
            </Button>
            <div className="p-2 space-y-1">
                <p className="text-primary text-xl font-bold">
                    {formatNumber(
                        data.total_share_capital_plus_fixed_savings,
                        2
                    )}
                </p>

                <p className="text-xs text-muted-foreground shrink truncate">
                    Total Share Capital + Fixed Savings
                </p>
            </div>

            <div className="p-2 space-y-1">
                <p className="text-primary text-xl font-bold">
                    {formatNumber(data.total_deposits, 2)}
                </p>

                <p className="text-xs text-muted-foreground truncate shrink">
                    Total Deposits
                </p>
            </div>

            <div className="p-2 space-y-1">
                <p className="text-primary text-xl font-bold">
                    {formatNumber(data.total_loans, 2)}
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
                    open={focused !== undefined}
                    onOpenChange={(state) => {
                        if (!state) setFocused(undefined)
                    }}
                    titleClassName="hidden"
                    descriptionClassName="hidden"
                    closeButtonClassName="md:hidden"
                    className={cn('!max-w-[90vw] p-2')}
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
                            defaultValue="general-ledger"
                            className="mt-2 flex-1 flex-col"
                        >
                            <ScrollArea>
                                <TabsList className="mb-3 h-auto min-w-full justify-start gap-2 rounded-none border-b bg-transparent px-0 py-1 text-foreground">
                                    <TabsTrigger
                                        value="general-ledger"
                                        className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 after:duration-300 after:ease-in-out hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                                    >
                                        <BookThickIcon
                                            className="-ms-0.5 me-1.5 opacity-60"
                                            size={16}
                                            aria-hidden="true"
                                        />
                                        General Ledger
                                    </TabsTrigger>

                                    <TabsTrigger
                                        value="check-entry"
                                        className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 after:duration-300 after:ease-in-out hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                                    >
                                        <MoneyCheckIcon
                                            className="-ms-0.5 me-1.5 opacity-60"
                                            size={16}
                                            aria-hidden="true"
                                        />
                                        Check Entry
                                    </TabsTrigger>

                                    <TabsTrigger
                                        value="online-entry"
                                        className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 after:duration-300 after:ease-in-out hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                                    >
                                        <BillIcon
                                            className="-ms-0.5 me-1.5 opacity-60"
                                            size={16}
                                            aria-hidden="true"
                                        />
                                        Online Entry
                                    </TabsTrigger>

                                    <TabsTrigger
                                        value="cash-entry"
                                        className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 after:duration-300 after:ease-in-out hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                                    >
                                        <HandCoinsIcon
                                            className="-ms-0.5 me-1.5 opacity-60"
                                            size={16}
                                            aria-hidden="true"
                                        />
                                        Cash Entry
                                    </TabsTrigger>

                                    <TabsTrigger
                                        value="payment-entry"
                                        className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 after:duration-300 after:ease-in-out hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                                    >
                                        <BillIcon
                                            className="-ms-0.5 me-1.5 opacity-60"
                                            size={16}
                                            aria-hidden="true"
                                        />
                                        Payment Entry
                                    </TabsTrigger>

                                    <TabsTrigger
                                        value="withdraw-entry"
                                        className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 after:duration-300 after:ease-in-out hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                                    >
                                        <HandCoinsIcon
                                            className="-ms-0.5 me-1.5 opacity-60"
                                            size={16}
                                            aria-hidden="true"
                                        />
                                        Withdraw Entry
                                    </TabsTrigger>

                                    <TabsTrigger
                                        value="deposit-entry"
                                        className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 after:duration-300 after:ease-in-out hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                                    >
                                        <HandCoinsIcon
                                            className="-ms-0.5 me-1.5 opacity-60"
                                            size={16}
                                            aria-hidden="true"
                                        />
                                        Deposit Entry
                                    </TabsTrigger>
                                </TabsList>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>

                            <TabsContent value="general-ledger" asChild>
                                <MemberAccountGeneralLedger {...focused} />
                            </TabsContent>

                            <TabsContent value="check-entry" asChild>
                                <GeneralLedgerTable
                                    mode="member-account"
                                    TEntryType="check-entry"
                                    memberProfileId={focused.memberProfileId}
                                    accountId={focused.accountId}
                                    className="min-h-[70vh] max-h-[70vh] w-full"
                                />
                            </TabsContent>

                            <TabsContent value="online-entry" asChild>
                                <GeneralLedgerTable
                                    mode="member-account"
                                    TEntryType="online-entry"
                                    memberProfileId={focused.memberProfileId}
                                    accountId={focused.accountId}
                                    className="min-h-[70vh] max-h-[70vh] w-full"
                                />
                            </TabsContent>

                            <TabsContent value="cash-entry" asChild>
                                <GeneralLedgerTable
                                    mode="member-account"
                                    TEntryType="cash-entry"
                                    memberProfileId={focused.memberProfileId}
                                    accountId={focused.accountId}
                                    className="min-h-[70vh] max-h-[70vh] w-full"
                                />
                            </TabsContent>

                            <TabsContent value="payment-entry" asChild>
                                <GeneralLedgerTable
                                    mode="member-account"
                                    TEntryType="payment-entry"
                                    memberProfileId={focused.memberProfileId}
                                    accountId={focused.accountId}
                                    className="min-h-[70vh] max-h-[70vh] w-full"
                                />
                            </TabsContent>

                            <TabsContent value="withdraw-entry" asChild>
                                <GeneralLedgerTable
                                    mode="member-account"
                                    TEntryType="withdraw-entry"
                                    memberProfileId={focused.memberProfileId}
                                    accountId={focused.accountId}
                                    className="min-h-[70vh] max-h-[70vh] w-full"
                                />
                            </TabsContent>

                            <TabsContent value="deposit-entry" asChild>
                                <GeneralLedgerTable
                                    mode="member-account"
                                    TEntryType="deposit-entry"
                                    memberProfileId={focused.memberProfileId}
                                    accountId={focused.accountId}
                                    className="min-h-[70vh] max-h-[70vh] w-full"
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </Modal>
            )}
            <MemberAccountingLedgerTable
                mode="member"
                memberProfileId={memberProfileId}
                onRowClick={(data) =>
                    setFocused({
                        accountId: data.original.account_id,
                        memberProfileId: data.original.member_profile_id,
                        account: data.original.account,
                    })
                }
                className="w-full"
            />
            <MemberAccountingLedgerTotal
                className="w-fit self-end"
                memberProfileId={memberProfileId}
            />
        </div>
    )
}

export default MemberAccountingLedger
