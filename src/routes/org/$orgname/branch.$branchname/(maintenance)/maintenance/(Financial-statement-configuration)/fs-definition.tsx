import { payment_bg } from '@/assets/transactions'
import { useFinancialStatementAccountsGroupingStore } from '@/store/financial-statement-accounts-grouping-store'
import { FinancialStatementGrouping } from '@/types/coop-types/financial-statement-accounts-grouping'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@radix-ui/react-accordion'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import { SigiBookIcon } from '@/components/icons'
import { Skeleton } from '@/components/ui/skeleton'

import { useGetAllFinancialStatementAccountsGroupings } from '@/hooks/api-hooks/financial-statement-definition/use-financial-statement-definition-accounts-groupings'

import { FinancialStatementTypeEnum } from '@/types'

import GeneralLedgerTreeViewer from './-components/fs-defintion-tree'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/(Financial-statement-configuration)/fs-definition'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const {
        data: financialStatementGropings,
        refetch: refetchGeneralLedgerAccountsGrouping,
        isRefetching: isRefetchingGeneralLedgerAccountsGrouping,
        isLoading: isLoadingGeneralLedgerAccountsGrouping,
    } = useGetAllFinancialStatementAccountsGroupings()

    const {
        setFinancialStatmentAccountsGroupingId,
        setFinancialStatementType,
    } = useFinancialStatementAccountsGroupingStore()

    const refetch = () => {
        refetchGeneralLedgerAccountsGrouping()
    }

    const hasFinancialGropings =
        financialStatementGropings && financialStatementGropings.length > 0

    const handleAccountTrigger = (grouping: FinancialStatementGrouping) => {
        setFinancialStatmentAccountsGroupingId(grouping.id)

        const GeneralLedgerTypeArray = Object.values(FinancialStatementTypeEnum)
        const matchedType = GeneralLedgerTypeArray.find(
            (type) => type === grouping.name
        )
        setFinancialStatementType?.(matchedType ?? null)
    }

    return (
        <PageContainer className="w-full relative min-h-[100vh] p-5 ">
            <div className="my-5 w-full flex items-center gap-2 ">
                <h1 className="font-extrabold text-2xl my-5 relative text-start flex items-center justify-start gap-4 ">
                    <span className="relative before:content-[''] before:size-5 before:bg-primary before:blur-lg before:rounded-full before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2">
                        <SigiBookIcon className="relative size-7" />
                    </span>
                    Financial Statement Definition
                </h1>
            </div>
            <span
                className="absolute left-1/2 top-[30%] size-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                    backgroundImage: `url(${payment_bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0.02,
                }}
            />
            {isLoadingGeneralLedgerAccountsGrouping ? (
                <div className="flex flex-col gap-2 mb-5 w-full">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <GeneralLederSkeleton key={index} />
                    ))}
                </div>
            ) : (
                <Accordion
                    type="single"
                    collapsible
                    className="w-full space-y-2"
                    defaultValue="item-1"
                >
                    {financialStatementGropings?.map((grouping) => (
                        <AccordionItem
                            key={grouping.id}
                            value={grouping.id}
                            className="w-full bg-sidebar/50 p-5 rounded-xl"
                        >
                            <AccordionTrigger
                                onClick={() => handleAccountTrigger(grouping)}
                                className="w-full hover:no-underline  text-left text-accent-foreground/80"
                            >
                                <div>
                                    <h1 className="font-bold text-2xl">
                                        {grouping.name}
                                    </h1>
                                    <p className="text-sm">
                                        {grouping.description}
                                    </p>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="w-full">
                                {hasFinancialGropings && (
                                    <GeneralLedgerTreeViewer
                                        refetch={refetch}
                                        treeData={
                                            grouping.financial_statement_definition_entries
                                        }
                                        isRefetchingGeneralLedgerAccountsGrouping={
                                            isRefetchingGeneralLedgerAccountsGrouping
                                        }
                                    />
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
        </PageContainer>
    )
}

export const GeneralLederSkeleton = () => {
    return (
        <Skeleton className="flex w-full gap-x-2 bg-secondary/30 p-5 rounded-xl">
            <div className="flex-1 space-y-1.5">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-5 w-3/4" />
            </div>
            <Skeleton className="size-5" />
        </Skeleton>
    )
}
