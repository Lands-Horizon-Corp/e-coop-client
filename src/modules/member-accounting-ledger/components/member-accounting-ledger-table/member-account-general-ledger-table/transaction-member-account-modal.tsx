import { cn } from '@/helpers'
import GeneralLedgerTable from '@/modules/general-ledger/components/tables/general-ledger-table'
import MemberAccountGeneralLedger from '@/modules/member-profile/components/member-infos/member-accounts-loans/member-account-general-ledger'
import { useTransactionStore } from '@/store/transaction/transaction-store'

import {
    BillIcon,
    BookThickIcon,
    HandCoinsIcon,
    MoneyCheckIcon,
} from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface PaymentSuccessModalProps extends IModalProps {}

const TransactionMemberAccountLedger = ({
    ...props
}: PaymentSuccessModalProps) => {
    const { focusedLedger } = useTransactionStore()

    if (!focusedLedger) return null

    return (
        <Modal
            {...props}
            className={cn('!max-w-[90vw] p-2')}
            closeButtonClassName="md:hidden"
            descriptionClassName="hidden"
            titleClassName="hidden"
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
                        <MemberAccountGeneralLedger {...focusedLedger} />
                    </TabsContent>

                    <TabsContent asChild value="check-entry">
                        <GeneralLedgerTable
                            accountId={focusedLedger.accountId}
                            className="min-h-[70vh] max-h-[70vh] w-full"
                            memberProfileId={focusedLedger.memberProfileId}
                            mode="member-account"
                            TEntryType="check-entry"
                        />
                    </TabsContent>

                    <TabsContent asChild value="online-entry">
                        <GeneralLedgerTable
                            accountId={focusedLedger.accountId}
                            className="min-h-[70vh] max-h-[70vh] w-full"
                            memberProfileId={focusedLedger.memberProfileId}
                            mode="member-account"
                            TEntryType="online-entry"
                        />
                    </TabsContent>

                    <TabsContent asChild value="cash-entry">
                        <GeneralLedgerTable
                            accountId={focusedLedger.accountId}
                            className="min-h-[70vh] max-h-[70vh] w-full"
                            memberProfileId={focusedLedger.memberProfileId}
                            mode="member-account"
                            TEntryType="cash-entry"
                        />
                    </TabsContent>

                    <TabsContent asChild value="payment-entry">
                        <GeneralLedgerTable
                            accountId={focusedLedger.accountId}
                            className="min-h-[70vh] max-h-[70vh] w-full"
                            memberProfileId={focusedLedger.memberProfileId}
                            mode="member-account"
                            TEntryType="payment-entry"
                        />
                    </TabsContent>

                    <TabsContent asChild value="withdraw-entry">
                        <GeneralLedgerTable
                            accountId={focusedLedger.accountId}
                            className="min-h-[70vh] max-h-[70vh] w-full"
                            memberProfileId={focusedLedger.memberProfileId}
                            mode="member-account"
                            TEntryType="withdraw-entry"
                        />
                    </TabsContent>

                    <TabsContent asChild value="deposit-entry">
                        <GeneralLedgerTable
                            accountId={focusedLedger.accountId}
                            className="min-h-[70vh] max-h-[70vh] w-full"
                            memberProfileId={focusedLedger.memberProfileId}
                            mode="member-account"
                            TEntryType="deposit-entry"
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </Modal>
    )
}

export default TransactionMemberAccountLedger
