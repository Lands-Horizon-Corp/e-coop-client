import { useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import { TEntryType } from '@/modules/general-ledger'
import GeneralLedgerTable from '@/modules/general-ledger/components/tables/general-ledger-table'
import GeneralLedgerAction, {
    GeneralLedgerRowContext,
} from '@/modules/general-ledger/components/tables/general-ledger-table/row-action-context'

import PageContainer from '@/components/containers/page-container'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(me)/my-general-ledger-entries'
)({
    component: RouteComponent,
})

const tabs = [
    { name: 'General Ledger', value: '' },
    { name: 'Check Entry', value: 'check-entry' },
    { name: 'Online Entry', value: 'online-entry' },
    { name: 'Cash Entry', value: 'cash-entry' },
    { name: 'Payment Entry', value: 'payment-entry' },
    { name: 'Withdraw Entry', value: 'withdraw-entry' },
    { name: 'Deposit Entry', value: 'deposit-entry' },
    { name: 'Journal Entry', value: 'journal-entry' },
    { name: 'Adjustment Entry', value: 'adjustment-entry' },
    { name: 'Journal Voucher', value: 'journal-voucher' },
    { name: 'Check Voucher Entry', value: 'check-voucher' },
]

function RouteComponent() {
    const [selectedTabs, setSelectedTabs] =
        useState<(typeof tabs)[number]['value']>('')

    return (
        <PageContainer>
            <p className="py-4 text-muted-foreground">
                My General Ledger Entries
            </p>
            <Tabs
                className="flex-row min-w-0 max-w-full"
                defaultValue="explore"
                onValueChange={(selectedValue) =>
                    setSelectedTabs(selectedValue)
                }
                value={selectedTabs}
            >
                <TabsList className="bg-background shrink-0 h-full flex-col rounded-none p-0">
                    {tabs.map((tab) => (
                        <TabsTrigger
                            className="bg-background data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full w-full justify-start rounded-none border-0 border-l-2 border-transparent data-[state=active]:shadow-none"
                            key={tab.value}
                            value={tab.value}
                        >
                            {tab.name}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {tabs.map((tab) => (
                    <TabsContent
                        className="flex-1 min-w-0"
                        key={tab.value}
                        value={tab.value}
                    >
                        <GeneralLedgerTable
                            actionComponent={GeneralLedgerAction}
                            className="max-h-[90vh] min-h-[90vh] min-w-0 max-w-full "
                            entryType={
                                (tab.value === ''
                                    ? undefined
                                    : tab.value) as TEntryType
                            }
                            excludeColumnIds={['balance']}
                            mode="current"
                            RowContextComponent={GeneralLedgerRowContext}
                        />
                    </TabsContent>
                ))}
            </Tabs>
        </PageContainer>
    )
}
