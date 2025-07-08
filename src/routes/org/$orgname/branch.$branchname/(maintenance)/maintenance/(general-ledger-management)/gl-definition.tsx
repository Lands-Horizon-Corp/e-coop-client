import { payment_bg } from '@/assets/transactions'
import { useGeneralLedgerStore } from '@/store/general-ledger-accounts-groupings-store'
import { AccordionContent, AccordionItem } from '@radix-ui/react-accordion'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import { SigiBookIcon } from '@/components/icons'
import { Accordion, AccordionTrigger } from '@/components/ui/accordion'

import { useGetAllGeneralLedgerAccountsGroupings } from '@/hooks/api-hooks/general-ledger-accounts-groupings/use-general-ledger-accounts-groupings'

import GeneralLedgerTreeViewer from '../../../(employee)/accounting/-components/general-ledger-tree'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(maintenance)/maintenance/(general-ledger-management)/gl-definition'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const {
        data: generalLedgerGropings,
        refetch: refetchGeneralLedgerAccountsGrouping,
    } = useGetAllGeneralLedgerAccountsGroupings()

    const { setGeneralLedgerAccountsGroupingId } = useGeneralLedgerStore()

    const refetch = () => {
        refetchGeneralLedgerAccountsGrouping()
    }

    const hasGeneralLedgerGropings =
        generalLedgerGropings && generalLedgerGropings.length > 0

    return (
        <PageContainer className="w-full relative min-h-[100vh] p-5 ">
            <div className="my-5 w-full flex items-center gap-2 ">
                <h1 className="font-extrabold text-2xl my-5 relative text-start flex items-center justify-start gap-4 ">
                    <span className="relative before:content-[''] before:size-5 before:bg-primary before:blur-lg before:rounded-full before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2">
                        <SigiBookIcon className="relative size-7" />
                    </span>
                    General Ledger Definition
                </h1>
            </div>
            <span
                className="absolute left-1/2 top-[30%] size-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                    backgroundImage: `url(${payment_bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0.1,
                }}
            />
            <Accordion
                type="single"
                collapsible
                className="w-full space-y-2"
                defaultValue="item-1"
            >
                {generalLedgerGropings?.map((grouping) => (
                    <AccordionItem
                        key={grouping.id}
                        value={grouping.id}
                        className="w-full bg-sidebar/50 p-5 rounded-xl"
                    >
                        <AccordionTrigger
                            onClick={() =>
                                setGeneralLedgerAccountsGroupingId(grouping.id)
                            }
                            className="w-full text-2xl font-bold text-left text-accent-foreground/80"
                        >
                            {grouping.name}
                        </AccordionTrigger>
                        <AccordionContent className="w-full">
                            <p className="text-sm">{grouping.description}</p>
                            {hasGeneralLedgerGropings && (
                                <GeneralLedgerTreeViewer
                                    refetch={refetch}
                                    treeData={
                                        grouping.general_ledger_definition
                                    }
                                />
                            )}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </PageContainer>
    )
}
