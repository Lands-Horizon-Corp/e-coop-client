import { useState } from 'react'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@radix-ui/react-accordion'

import { payment_bg } from '@/assets/transactions'
import { IFinancialStatementAccountGrouping } from '@/modules/financial-statement-account-grouping'
import { useGetAll } from '@/modules/financial-statement-account-grouping'
import { FinancialStatementAccountGroupingUpdateModal } from '@/modules/financial-statement-account-grouping'
import { useFinancialStatementAccountsGroupingStore } from '@/store/financial-statement-accounts-grouping-store'

import PageContainer from '@/components/containers/page-container'
import {
    EditPencilIcon,
    SettingsIcon,
    SigiBookIcon,
    ViewIcon,
} from '@/components/icons'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useShortcut } from '@/hooks/use-shorcuts'

import { FinancialStatementTypeEnum } from '../financial-statement-definition.types'
import { FinancialStatementDefinitionTreeViewer } from './components'
import FinancialStatementSkeleton from './components/financial-statement-skeleton'

const FinancialStatementDefinition = () => {
    const [
        onOpenEditFinancialStatementGrouping,
        setOnOpenEditFinancialStatementGrouping,
    ] = useState(false)
    const [
        viewOnlyFinancialStatementGrouping,
        setViewOnlyFinancialStatementGrouping,
    ] = useState(false)
    const [financialStatementGrouping, setFinancialStatementGrouping] =
        useState<IFinancialStatementAccountGrouping | null>(null)

    const {
        data: financialStatementGropings,
        refetch: refetchGeneralLedgerAccountsGrouping,
        isRefetching: isRefetchingGeneralLedgerAccountsGrouping,
        isLoading: isLoadingGeneralLedgerAccountsGrouping,
    } = useGetAll()

    const {
        setFinancialStatmentAccountsGroupingId,
        setFinancialStatementType,
    } = useFinancialStatementAccountsGroupingStore()

    const refetch = () => {
        refetchGeneralLedgerAccountsGrouping()
    }

    const hasFinancialGropings =
        financialStatementGropings && financialStatementGropings.length > 0

    const handleAccountTrigger = (
        grouping: IFinancialStatementAccountGrouping
    ) => {
        setFinancialStatmentAccountsGroupingId(grouping.id)

        const GeneralLedgerTypeArray = Object.values(FinancialStatementTypeEnum)
        const matchedType = GeneralLedgerTypeArray.find(
            (type) => type === grouping.name
        )
        setFinancialStatementType?.(matchedType ?? null)
    }
    const handleEditFinancialStatementGrouping = (
        grouping: IFinancialStatementAccountGrouping,
        viewOnly: boolean = false
    ) => {
        setFinancialStatementGrouping(grouping)
        setViewOnlyFinancialStatementGrouping(viewOnly)
        setOnOpenEditFinancialStatementGrouping(true)
    }

    const handleViewFinancialStatementGrouping = (
        grouping: IFinancialStatementAccountGrouping,
        viewOnly: boolean = true
    ) => {
        setFinancialStatementGrouping(grouping)
        setViewOnlyFinancialStatementGrouping(viewOnly)
        setOnOpenEditFinancialStatementGrouping(true)
    }

    useShortcut(
        'e',
        (event) => {
            event?.preventDefault()
            handleEditFinancialStatementGrouping(
                financialStatementGrouping as IFinancialStatementAccountGrouping,
                false
            )
        },
        { disableTextInputs: true }
    )

    useShortcut(
        'v',
        (event) => {
            event?.preventDefault()
            handleViewFinancialStatementGrouping(
                financialStatementGrouping as IFinancialStatementAccountGrouping
            )
        },
        { disableTextInputs: true }
    )

    return (
        <PageContainer className="w-full relative min-h-[100vh] p-5 ">
            {financialStatementGrouping && (
                <FinancialStatementAccountGroupingUpdateModal
                    title={
                        <p>
                            {viewOnlyFinancialStatementGrouping
                                ? ''
                                : 'Edit  Financial Statement Grouping'}{' '}
                            <span className="font-bold italic">
                                {' '}
                                {viewOnlyFinancialStatementGrouping
                                    ? financialStatementGrouping.name
                                    : ''}
                            </span>
                            <span className="text-xs text-secondary-foreground/80">
                                {viewOnlyFinancialStatementGrouping
                                    ? ' (View Only)'
                                    : ''}
                            </span>
                        </p>
                    }
                    description={
                        viewOnlyFinancialStatementGrouping
                            ? `${financialStatementGrouping.description}`
                            : 'Edit the financial statement grouping details.'
                    }
                    open={onOpenEditFinancialStatementGrouping}
                    onOpenChange={setOnOpenEditFinancialStatementGrouping}
                    formProps={{
                        defaultValues: financialStatementGrouping,
                        groupingId: financialStatementGrouping.id,
                        onSuccess: () => {
                            setOnOpenEditFinancialStatementGrouping(false)
                            refetch()
                        },
                        readOnly: viewOnlyFinancialStatementGrouping,
                    }}
                />
            )}

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
            {!hasFinancialGropings &&
                !isLoadingGeneralLedgerAccountsGrouping && (
                    <p className="text-center italic text-sm text-secondary-foreground/80 w-full p-25">
                        No Financial Statement Definition found.
                    </p>
                )}

            {isLoadingGeneralLedgerAccountsGrouping ? (
                <div className="flex flex-col gap-2 mb-5 w-full">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <FinancialStatementSkeleton key={index} />
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
                            className="w-full shadow-md bg-sidebar/50 p-5 rounded-xl"
                        >
                            <AccordionTrigger
                                onClick={() => handleAccountTrigger(grouping)}
                                className="w-full hover:no-underline  text-left text-accent-foreground/80"
                            >
                                <div className="flex items-center gap-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <span className="cursor-pointer">
                                                <SettingsIcon
                                                    size={30}
                                                    className="hover:text-accent-foreground cursor-pointer"
                                                />
                                            </span>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem
                                                className="flex items-center gap-2"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    handleEditFinancialStatementGrouping(
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
                                                    handleViewFinancialStatementGrouping(
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
                                {hasFinancialGropings && (
                                    <FinancialStatementDefinitionTreeViewer
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

export default FinancialStatementDefinition
