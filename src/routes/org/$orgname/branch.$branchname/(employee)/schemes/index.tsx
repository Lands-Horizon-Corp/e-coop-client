import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'

import ChargesRateSchemePage from '@/modules/charges-rate-scheme/components/pages/charges-rate-page'
import ComputationSheetPage from '@/modules/computation-sheet/components/pages/computation-sheet'
import TimeDepositComputationPage from '@/modules/time-deposit-computation/components/pages/time-deposit-computation'

import PageContainer from '@/components/containers/page-container'
import { BookStackIcon, CashClockIcon, GridFillIcon } from '@/components/icons'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/schemes/'
)({
    component: RouteComponent,
    validateSearch: (search: Record<string, unknown>) => {
        return {
            tab: (search.tab as string) || 'loan-scheme',
        }
    },
})

type Tabs =
    | 'computation-sheet-scheme'
    | 'loan-charges-scheme'
    | 'time-deposit-scheme'

function RouteComponent() {
    const navigate = useNavigate()
    const { tab = 'loan-scheme' } =
        useSearch({
            from: '/org/$orgname/branch/$branchname/(employee)/schemes/',
        }) || 'computation-sheet-scheme'

    const handleTabChange = (newTab: Tabs) => {
        navigate({
            to: '.',
            search: {
                tab: newTab,
            },
        })
    }

    return (
        <PageContainer className="w-full">
            <Tabs
                className="items-center w-full"
                onValueChange={(newTab) => handleTabChange(newTab as Tabs)}
                value={tab}
            >
                <TabsList className="h-auto w-full rounded-none bg-transparent p-0">
                    <TabsTrigger
                        className="relative flex-col rounded-none px-4 py-2 text-xs after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-muted data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
                        value="computation-sheet-scheme"
                    >
                        <BookStackIcon
                            aria-hidden="true"
                            className="mb-1.5 opacity-60"
                            size={16}
                        />
                        Loan Scheme
                    </TabsTrigger>
                    <TabsTrigger
                        className="relative flex-col rounded-none px-4 py-2 text-xs after:absolute  after:bg-muted after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
                        value="loan-charges-scheme"
                    >
                        <GridFillIcon
                            aria-hidden="true"
                            className="mb-1.5 opacity-60"
                            size={16}
                        />
                        Loan Charge Scheme
                    </TabsTrigger>
                    <TabsTrigger
                        className="relative flex-col rounded-none px-4 py-2 text-xs after:absolute  after:bg-muted after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
                        value="time-deposit-scheme"
                    >
                        <CashClockIcon
                            aria-hidden="true"
                            className="mb-1.5 opacity-60"
                            size={16}
                        />
                        Time Deposit Scheme
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="computation-sheet-scheme">
                    <ComputationSheetPage />
                </TabsContent>
                <TabsContent value="loan-charges-scheme">
                    <ChargesRateSchemePage />
                </TabsContent>
                <TabsContent value="time-deposit-scheme">
                    <TimeDepositComputationPage />
                </TabsContent>
            </Tabs>
        </PageContainer>
    )
}
