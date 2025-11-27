import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'

import ChargesRateSchemePage from '@/modules/charges-rate-scheme/components/pages/charges-rate-page'
import ComputationSheetPage from '@/modules/computation-sheet/components/pages/computation-sheet'
import MemberTypeBrowseReferencePage from '@/modules/member-type-reference/components/pages/member-type-reference-page'
import TimeDepositTypePage from '@/modules/time-deposit-type/components/pages/time-deposit-type'

import PageContainer from '@/components/containers/page-container'
import {
    BookStackIcon,
    CashClockIcon,
    GridFillIcon,
    UserIcon,
} from '@/components/icons'
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
    | 'browse-reference'

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
                className="items-center w-full min-w-0"
                onValueChange={(newTab) => handleTabChange(newTab as Tabs)}
                value={tab}
            >
                <TabsList className="h-auto w-full justify-center rounded-none bg-transparent p-0">
                    <TabsTrigger
                        className="relative flex-col dark:data-[state=active]:bg-input/10 dark:data-[state=active]:border-none flex-none px-4 py-2 text-xs after:absolute after:bg-muted after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
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
                        className="relative flex-col dark:data-[state=active]:bg-input/10 dark:data-[state=active]:border-none flex-none px-4 py-2 text-xs after:absolute after:bg-muted after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
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
                        className="relative flex-col dark:data-[state=active]:bg-input/10 dark:data-[state=active]:border-none flex-none px-4 py-2 text-xs after:absolute after:bg-muted after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
                        value="time-deposit-scheme"
                    >
                        <CashClockIcon
                            aria-hidden="true"
                            className="mb-1.5 opacity-60"
                            size={16}
                        />
                        Time Deposit Scheme
                    </TabsTrigger>
                    <TabsTrigger
                        className="relative flex-col dark:data-[state=active]:bg-input/10 dark:data-[state=active]:border-none flex-none px-4 py-2 text-xs after:absolute after:bg-muted after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
                        value="browse-reference"
                    >
                        <UserIcon
                            aria-hidden="true"
                            className="mb-1.5 opacity-60"
                            size={16}
                        />
                        Browse Reference
                    </TabsTrigger>
                </TabsList>
                <TabsContent
                    className="min-w-0 w-full"
                    value="computation-sheet-scheme"
                >
                    <ComputationSheetPage />
                </TabsContent>
                <TabsContent
                    className="min-w-0 w-full"
                    value="loan-charges-scheme"
                >
                    <ChargesRateSchemePage />
                </TabsContent>
                <TabsContent
                    className="min-w-0 w-full"
                    value="time-deposit-scheme"
                >
                    <TimeDepositTypePage />
                </TabsContent>
                <TabsContent
                    className="min-w-0 w-full"
                    value="browse-reference"
                >
                    <MemberTypeBrowseReferencePage />
                </TabsContent>
            </Tabs>
        </PageContainer>
    )
}
