import { useState } from 'react'

import { payment_bg } from '@/assets/transactions'
import { useGeneralLedgerAccountsGroupingStore } from '@/store/general-ledger-accounts-groupings-store'
import { IGeneralLedgerAccountsGrouping } from '@/types/coop-types/general-ledger-accounts-grouping'
import { AccordionContent, AccordionItem } from '@radix-ui/react-accordion'
import { createFileRoute } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import { GLAccountsGroupingUpdateModal } from '@/components/forms/update-general-ledger-accounts-grouping'
import {
    EditPencilIcon,
    SettingsIcon,
    SigiBookIcon,
    ViewIcon,
} from '@/components/icons'
import { Accordion, AccordionTrigger } from '@/components/ui/accordion'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { useShortcut } from '@/components/use-shorcuts'

import { useGetAllGeneralLedgerAccountsGroupings } from '@/hooks/api-hooks/general-ledger-definitions/use-general-ledger-accounts-grouping'

import { GeneralLedgerTypeEnum } from '@/types'

import GeneralLedgerTreeViewer from './-gl-components/general-ledger-tree'

export const Route = createFileRoute(
    '/org/$orgname/branch/$branchname/(employee)/transaction/maintenance/general-ledger-definition'
)({
    component: RouteComponent,
})

function RouteComponent() {
    const [onOpenEditGLGrouping, setOnOpenEditGLGrouping] = useState(false)
    const [financialStatementGrouping, setFinancialStatementGrouping] =
        useState(false)
    const [grouping, setGrouping] =
        useState<IGeneralLedgerAccountsGrouping | null>(null)
    const {
        data: generalLedgerGropings,
        refetch: refetchGeneralLedgerAccountsGrouping,
        isRefetching: isRefetchingGeneralLedgerAccountsGrouping,
        isLoading: isLoadingGeneralLedgerAccountsGrouping,
    } = useGetAllGeneralLedgerAccountsGroupings()

    const { setGeneralLedgerAccountsGroupingId, setGeneralLedgerType } =
        useGeneralLedgerAccountsGroupingStore()

    const refetch = () => {
        refetchGeneralLedgerAccountsGrouping()
    }

    const hasGeneralLedgerGropings =
        generalLedgerGropings && generalLedgerGropings.length > 0

    const handleAccountTrigger = (grouping: IGeneralLedgerAccountsGrouping) => {
        setGeneralLedgerAccountsGroupingId(grouping.id)

        const GeneralLedgerTypeArray = Object.values(GeneralLedgerTypeEnum)
        const matchedType = GeneralLedgerTypeArray.find(
            (type) => type === grouping.name
        )
        setGeneralLedgerType?.(matchedType ?? null)
    }

    const handleEditGLGrouping = (
        grouping: IGeneralLedgerAccountsGrouping,
        financialStatementGrouping: boolean = false
    ) => {
        setGrouping(grouping)
        setFinancialStatementGrouping(financialStatementGrouping)
        setOnOpenEditGLGrouping(true)
        setGeneralLedgerAccountsGroupingId(grouping.id)
        setGeneralLedgerType?.(null)
    }

    const handleViewGLGrouping = (
        grouping: IGeneralLedgerAccountsGrouping,
        financialStatementGrouping: boolean = true
    ) => {
        setGrouping(grouping)
        setFinancialStatementGrouping(financialStatementGrouping)
        setOnOpenEditGLGrouping(true)
        setGeneralLedgerAccountsGroupingId(grouping.id)
        setGeneralLedgerType?.(null)
    }

    useShortcut(
        'e',
        (event) => {
            event?.preventDefault()
            handleEditGLGrouping(
                grouping as IGeneralLedgerAccountsGrouping,
                false
            )
        },
        { disableTextInputs: true }
    )

    useShortcut(
        'v',
        (event) => {
            event?.preventDefault()
            handleViewGLGrouping(grouping as IGeneralLedgerAccountsGrouping)
        },
        { disableTextInputs: true }
    )
    return (
        <PageContainer className="w-full relative min-h-[100vh] p-5 ">
            {grouping && (
                <GLAccountsGroupingUpdateModal
                    title={
                        <p>
                            {financialStatementGrouping
                                ? ''
                                : 'Edit  Financial Statement Grouping'}{' '}
                            <span className="font-bold italic">
                                {' '}
                                {financialStatementGrouping
                                    ? grouping.name
                                    : ''}
                            </span>
                            <span className="text-xs text-secondary-foreground/80">
                                {financialStatementGrouping
                                    ? ' (View Only)'
                                    : ''}
                            </span>
                        </p>
                    }
                    description={
                        financialStatementGrouping
                            ? `${grouping.description}`
                            : 'Edit the financial statement grouping details.'
                    }
                    open={onOpenEditGLGrouping}
                    onOpenChange={setOnOpenEditGLGrouping}
                    formProps={{
                        defaultValues: grouping,
                        groupingId: grouping.id,
                        onSuccess: () => {
                            setOnOpenEditGLGrouping(false)
                            refetch()
                        },
                        readOnly: financialStatementGrouping,
                    }}
                />
            )}
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
                    {generalLedgerGropings?.map((grouping) => (
                        <div key={grouping.id}>
                            <AccordionItem
                                key={grouping.id}
                                value={grouping.id}
                                className="w-full bg-sidebar/50 p-5 rounded-xl"
                            >
                                <AccordionTrigger
                                    onClick={() =>
                                        handleAccountTrigger(grouping)
                                    }
                                    className="w-full hover:no-underline text-left text-accent-foreground/80"
                                >
                                    <div className="flex items-center gap-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <SettingsIcon
                                                    size={30}
                                                    className="hover:text-accent-foreground cursor-pointer"
                                                />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem
                                                    className="flex items-center gap-2"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        handleEditGLGrouping(
                                                            grouping
                                                        )
                                                    }}
                                                >
                                                    <EditPencilIcon />
                                                    Edit
                                                    <DropdownMenuShortcut>
                                                        e
                                                    </DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        handleViewGLGrouping(
                                                            grouping,
                                                            true
                                                        )
                                                    }}
                                                    className="flex items-center gap-2"
                                                >
                                                    <ViewIcon />
                                                    View
                                                    <DropdownMenuShortcut>
                                                        v
                                                    </DropdownMenuShortcut>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                        <div className="flex flex-col">
                                            <h1 className="font-bold text-2xl">
                                                {grouping.name}
                                            </h1>
                                            <p className="text-sm">
                                                {grouping.description}
                                            </p>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="w-full">
                                    {hasGeneralLedgerGropings && (
                                        <GeneralLedgerTreeViewer
                                            refetch={refetch}
                                            treeData={
                                                grouping.general_ledger_definition
                                            }
                                            isRefetchingGeneralLedgerAccountsGrouping={
                                                isRefetchingGeneralLedgerAccountsGrouping
                                            }
                                        />
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        </div>
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
