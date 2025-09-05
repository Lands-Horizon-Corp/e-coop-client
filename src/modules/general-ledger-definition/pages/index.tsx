import { useState } from 'react'

import { toast } from 'sonner'

import { AccordionContent, AccordionItem } from '@radix-ui/react-accordion'

import { payment_bg } from '@/assets/transactions'
import { GeneralLedgerTypeEnum } from '@/modules/account'
import FinancialStatementSkeleton from '@/modules/financial-statement-definition/pages/components/financial-statement-skeleton'
import { useGetAll } from '@/modules/general-ledger-account-grouping'
import { IGeneralLedgerAccountGrouping } from '@/modules/general-ledger-account-grouping'
import { GLAccountsGroupingUpdateFormModal } from '@/modules/general-ledger-account-grouping'
import { useGeneralLedgerAccountsGroupingStore } from '@/store/general-ledger-accounts-groupings-store'

import PageContainer from '@/components/containers/page-container'
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

import { useShortcut } from '@/hooks/use-shorcuts'

import { GeneralLedgerDefinitionTreeViewer } from './components'

const GeneralLedgerDefinition = () => {
    const [onOpenEditGLGrouping, setOnOpenEditGLGrouping] = useState(false)
    const [financialStatementGrouping, setFinancialStatementGrouping] =
        useState(false)
    const [grouping, setGrouping] =
        useState<IGeneralLedgerAccountGrouping | null>(null)
    const {
        data: generalLedgerGropings,
        refetch: refetchGeneralLedgerAccountsGrouping,
        isRefetching: isRefetchingGeneralLedgerAccountsGrouping,
        isLoading: isLoadingGeneralLedgerAccountsGrouping,
    } = useGetAll()

    const { setGeneralLedgerAccountsGroupingId, setGeneralLedgerType } =
        useGeneralLedgerAccountsGroupingStore()

    const refetch = () => {
        refetchGeneralLedgerAccountsGrouping()
    }

    const hasGeneralLedgerGropings =
        generalLedgerGropings && generalLedgerGropings.length > 0

    const handleAccountTrigger = (grouping: IGeneralLedgerAccountGrouping) => {
        setGeneralLedgerAccountsGroupingId(grouping.id)

        const GeneralLedgerTypeArray = Object.values(GeneralLedgerTypeEnum)
        const matchedType = GeneralLedgerTypeArray.find(
            (type) => type === grouping.name
        )
        setGeneralLedgerType?.(matchedType ?? null)
    }

    const handleEditGLGrouping = (
        grouping: IGeneralLedgerAccountGrouping,
        financialStatementGrouping: boolean = false
    ) => {
        setGrouping(grouping)
        setFinancialStatementGrouping(financialStatementGrouping)
        setOnOpenEditGLGrouping(true)
        setGeneralLedgerAccountsGroupingId(grouping.id)
        setGeneralLedgerType?.(null)
    }

    const handleViewGLGrouping = (
        grouping: IGeneralLedgerAccountGrouping,
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
                grouping as IGeneralLedgerAccountGrouping,
                false
            )
        },
        { disableTextInputs: true }
    )

    useShortcut(
        'v',
        (event) => {
            event?.preventDefault()
            handleViewGLGrouping(grouping as IGeneralLedgerAccountGrouping)
        },
        { disableTextInputs: true }
    )
    return (
        <PageContainer className="w-full relative min-h-[100vh] p-5 ">
            {grouping && (
                <GLAccountsGroupingUpdateFormModal
                    title={
                        <p>
                            {financialStatementGrouping
                                ? ''
                                : 'Edit  General Ledger Account Grouping'}{' '}
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
                            : 'Edit the General Ledger Definition grouping details.'
                    }
                    open={onOpenEditGLGrouping}
                    onOpenChange={setOnOpenEditGLGrouping}
                    formProps={{
                        defaultValues: grouping,
                        groupingId: grouping.id,
                        onSuccess: (data) => {
                            setOnOpenEditGLGrouping(false)
                            toast.success(
                                `Successfully updated the ${data.name} grouping.`
                            )
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
                    {generalLedgerGropings?.map((grouping) => (
                        <div key={grouping.id}>
                            <AccordionItem
                                key={grouping.id}
                                value={grouping.id}
                                className="shadow-md w-full bg-sidebar/50 p-5 rounded-xl"
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
                                <AccordionContent className="w-full shadow-none">
                                    {hasGeneralLedgerGropings && (
                                        <GeneralLedgerDefinitionTreeViewer
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

export default GeneralLedgerDefinition
