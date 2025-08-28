import { cn } from '@/helpers'
import GeneralLedgerTable from '@/modules/general-ledger/components/tables/general-ledger-table'
import { IMemberAccountingLedger } from '@/modules/member-account-ledger'
import MemberAccountGeneralLedger from '@/modules/member-profile/components/member-infos/member-accounts-loans/member-account-general-ledger'
import { useTransactionStore } from '@/store/transaction/transaction-store'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import {
    BillIcon,
    BookThickIcon,
    HandCoinsIcon,
    MoneyCheckIcon,
} from '@/components/icons'
import Modal from '@/components/modals/modal'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface IMemberAccountGeneralLedgerActionProps {
    memberAccountLedger: IMemberAccountingLedger
}

const MemberAccountGeneralLedgerAction = ({
    memberAccountLedger,
}: IMemberAccountGeneralLedgerActionProps) => {
    const { focusedLedger, setFocusedLedger } = useTransactionStore()

    return (
        <div onClick={(e) => e.stopPropagation()}>
            {focusedLedger !== undefined && (
                <Modal
                    open={focusedLedger !== undefined}
                    onOpenChange={(state) => {
                        if (!state) setFocusedLedger(undefined)
                    }}
                    titleClassName="hidden"
                    descriptionClassName="hidden"
                    closeButtonClassName="md:hidden"
                    className={cn('!max-w-[90vw] p-2')}
                >
                    <div className="min-h-[80vh] min-w-[80vw] space-y-4 p-2">
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">
                                Account: {focusedLedger.account?.name}
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
                                <MemberAccountGeneralLedger
                                    {...focusedLedger}
                                />
                            </TabsContent>

                            <TabsContent value="check-entry" asChild>
                                <GeneralLedgerTable
                                    mode="member-account"
                                    TEntryType="check-entry"
                                    memberProfileId={
                                        focusedLedger.memberProfileId
                                    }
                                    accountId={focusedLedger.accountId}
                                    className="min-h-[70vh] max-h-[70vh] w-full"
                                />
                            </TabsContent>

                            <TabsContent value="online-entry" asChild>
                                <GeneralLedgerTable
                                    mode="member-account"
                                    TEntryType="online-entry"
                                    memberProfileId={
                                        focusedLedger.memberProfileId
                                    }
                                    accountId={focusedLedger.accountId}
                                    className="min-h-[70vh] max-h-[70vh] w-full"
                                />
                            </TabsContent>

                            <TabsContent value="cash-entry" asChild>
                                <GeneralLedgerTable
                                    mode="member-account"
                                    TEntryType="cash-entry"
                                    memberProfileId={
                                        focusedLedger.memberProfileId
                                    }
                                    accountId={focusedLedger.accountId}
                                    className="min-h-[70vh] max-h-[70vh] w-full"
                                />
                            </TabsContent>

                            <TabsContent value="payment-entry" asChild>
                                <GeneralLedgerTable
                                    mode="member-account"
                                    TEntryType="payment-entry"
                                    memberProfileId={
                                        focusedLedger.memberProfileId
                                    }
                                    accountId={focusedLedger.accountId}
                                    className="min-h-[70vh] max-h-[70vh] w-full"
                                />
                            </TabsContent>

                            <TabsContent value="withdraw-entry" asChild>
                                <GeneralLedgerTable
                                    mode="member-account"
                                    TEntryType="withdraw-entry"
                                    memberProfileId={
                                        focusedLedger.memberProfileId
                                    }
                                    accountId={focusedLedger.accountId}
                                    className="min-h-[70vh] max-h-[70vh] w-full"
                                />
                            </TabsContent>

                            <TabsContent value="deposit-entry" asChild>
                                <GeneralLedgerTable
                                    mode="member-account"
                                    TEntryType="deposit-entry"
                                    memberProfileId={
                                        focusedLedger.memberProfileId
                                    }
                                    accountId={focusedLedger.accountId}
                                    className="min-h-[70vh] max-h-[70vh] w-full"
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </Modal>
            )}
            <RowActionsGroup
                onView={{
                    text: 'View General Ledger',
                    isAllowed: true,
                    onClick: () => {
                        setFocusedLedger({
                            memberProfileId:
                                memberAccountLedger?.member_profile_id,
                            accountId: memberAccountLedger?.account_id,
                            account: memberAccountLedger?.account,
                        })
                    },
                }}
            />
        </div>
    )
}

export default MemberAccountGeneralLedgerAction
