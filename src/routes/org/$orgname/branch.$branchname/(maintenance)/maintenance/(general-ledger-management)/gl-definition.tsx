import { payment_bg } from '@/assets/transactions'
import { useGeneralLedgerStore } from '@/store/general-ledger-accounts-groupings-store'
import { AccordionContent, AccordionItem } from '@radix-ui/react-accordion'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import { GradientBackground } from '@/components/gradient-background/gradient-background'
import { Accordion, AccordionTrigger } from '@/components/ui/accordion'

import { useGetAllGeneralLedgerAccountsGroupings } from '@/hooks/api-hooks/general-ledger-accounts-groupings/use-general-ledger-accounts-groupings'

import GeneralLedgerTreeViewer from '../../../(employee)/accounting/-components/general-ledger-tree'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/(general-ledger-management)/gl-definition'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const { data: generalLedgerGropings } =
        useGetAllGeneralLedgerAccountsGroupings()

    const { setGeneralLedgerAccountsGroupingId } = useGeneralLedgerStore()

    return (
        <PageContainer className="w-full">
            <h1>General Ledger Definition</h1>
            <Accordion
                type="single"
                collapsible
                className="w-full space-y-2"
                defaultValue="item-1"
            >
                {generalLedgerGropings?.map((grouping) => (
                    <GradientBackground
                        gradientOnly
                        opacity={0.07}
                        className="p-5"
                        key={grouping.id}
                    >
                        <span
                            className="absolute -right-10 -top-16 size-72 -rotate-45"
                            style={{
                                backgroundImage: `url(${payment_bg})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                opacity: 0.2,
                            }}
                        />
                        <AccordionItem
                            key={grouping.id}
                            value={grouping.id}
                            className="w-full"
                        >
                            <AccordionTrigger
                                onClick={() =>
                                    setGeneralLedgerAccountsGroupingId(
                                        grouping.id
                                    )
                                }
                                className="w-full text-2xl font-bold text-left text-accent-foreground"
                            >
                                {grouping.name}
                            </AccordionTrigger>
                            <AccordionContent className="w-full">
                                <p className="text-sm">
                                    {grouping.description}
                                </p>
                                {grouping.general_ledger_definition.length >
                                    0 && (
                                    <GeneralLedgerTreeViewer
                                        treeData={
                                            grouping.general_ledger_definition
                                        }
                                    />
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    </GradientBackground>
                ))}
            </Accordion>
        </PageContainer>
    )
}
