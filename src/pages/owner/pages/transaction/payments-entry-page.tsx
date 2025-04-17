import PageContainer from '@/components/containers/page-container'
import { useMemo } from 'react'
import {
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'

import { F1Icon, PaymentsIcon, ReceiptIcon, XIcon } from '@/components/icons'

import { useDataTableSorting } from '@/hooks/data-table-hooks/use-datatable-sorting'
import useDataTableState from '@/hooks/data-table-hooks/use-datatable-state'
import { usePagination } from '@/hooks/use-pagination'
import useDatableFilterState from '@/hooks/use-filter-state'

import { IAccountingLedgerResource } from '@/server/types/accounts/accounting-ledger'

import MemberPicker from '@/components/pickers/member-picker'

import AccountsLedgerTable from '@/components/tables/transactions-table/accouting-ledger-table'
import IAccountingLedgerRequestTableColumns from '@/components/tables/transactions-table/accouting-ledger-table/columns'

import PaymentsEntryProfile from '@/components/transaction-profile/payments-entry-profile'
import CurrentPaymentsEntryList from '@/components/ledger/payments-entry/current-payment-entry'

import { toast } from 'sonner'
import { cn } from '@/lib'
import { Input } from '@/components/ui/input'
import {
    usePaymentsDataStore,
    usePaymentsModalStore,
} from '@/store/transaction/payments-entry-store'
import { useFilteredPaginatedIAccountingLedger } from '@/hooks/api-hooks/transactions/use-accounting-ledger'
import { commaSeparators } from '@/helpers'
import { useCreatePaymentEntry } from '@/hooks/api-hooks/transactions/use-payments-entry'
import {
    IPaymentsEntry,
    IPaymentsEntryRequest,
    TRANSACTION_TYPE,
} from '@/server/types/transactions/payments-entry'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { ScrollArea } from '@/components/ui/scroll-area'
import usePaymentsShortcuts from '@/hooks/shortcut-hooks/payments-entry-shortcuts'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable'
import { useCreateCheckClearing } from '@/hooks/api-hooks/transactions/use-check-clearing'
import { ICheckClearingRequest } from '@/server/types/transactions/check-clearing'
import { useGenerateOfficialReceipt } from '@/hooks/api-hooks/transactions/use-generate-official-receipt'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { useImagePreview } from '@/store/image-preview-store'
import TransactionPaymentEntryFormModal from '@/components/forms/transactions-forms/payments-entry-form'

const paymentsMembersEntrySchema = z.object({
    memberId: z.string().min(1, 'Member is Required'),
    ORNumber: z.coerce.number().min(1, 'Member is Required'),
})
export type TPaymentMemberFormValues = z.infer<
    typeof paymentsMembersEntrySchema
>

const OwnerPaymentsEntry = () => {
    const {
        selectedMember,
        ORNumber,
        selectedPayments,
        setSelectedMember,
        setSelectedPayments,
    } = usePaymentsDataStore()

    const {
        setOpenPaymentsEntryModal,
        openPaymentsEntryModal,
        setTransactionType,
        transactionType,
    } = usePaymentsModalStore()

    const form = useForm<TPaymentMemberFormValues>({
        resolver: zodResolver(paymentsMembersEntrySchema),
        mode: 'onSubmit',
        defaultValues: {
            memberId: '',
        },
    })

    const { pagination, setPagination } = usePagination()
    const { sortingState, tableSorting, setTableSorting } =
        useDataTableSorting()

    const columns = useMemo(() => IAccountingLedgerRequestTableColumns(), [])

    const {
        getRowIdFn,
        columnOrder,
        setColumnOrder,
        isScrollable,
        setIsScrollable,
        columnVisibility,
        setColumnVisibility,
        rowSelectionState,
        createHandleRowSelectionChange,
    } = useDataTableState<IAccountingLedgerResource>({})

    const filterState = useDatableFilterState({
        onFilterChange: () => setPagination({ ...pagination, pageIndex: 0 }),
    })

    const {
        isPending: isPendingSelectedMemberLedger,
        isRefetching: isRefetchingSelectedMemberLedger,
        data: {
            data: SelectedMemberLedger,
            totalPage: selectedMemberTotalPage,
            pageSize: selectedMemberPageSize,
            totalSize: SelectedMemberTotalSize,
        },
        refetch: refetchSelectedMemberLedger,
    } = useFilteredPaginatedIAccountingLedger({
        pagination,
        sort: sortingState,
        filterPayload: filterState.finalFilterPayload,
    })

    const handleRowSelectionChange =
        createHandleRowSelectionChange(SelectedMemberLedger)

    const table = useReactTable({
        columns,
        data: SelectedMemberLedger,
        initialState: {
            columnPinning: { left: ['description', 'balance'] },
        },
        state: {
            sorting: tableSorting,
            pagination,
            columnOrder,
            rowSelection: rowSelectionState.rowSelection,
            columnVisibility,
        },
        rowCount: selectedMemberPageSize,
        manualSorting: true,
        pageCount: selectedMemberTotalPage,
        enableMultiSort: false,
        manualFiltering: true,
        manualPagination: true,
        columnResizeMode: 'onChange',
        getRowId: getRowIdFn,
        onSortingChange: setTableSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        onColumnOrderChange: setColumnOrder,
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: handleRowSelectionChange,
    })

    const handleOpenCreateModal = (paymentType: string) => {
        if (isAllowedToCreatePayment) {
            setTransactionType(paymentType)
            setOpenPaymentsEntryModal(true)
        }
    }

    const totalAmount = useMemo(() => {
        return (
            selectedPayments?.reduce(
                (acc, payment) => acc + payment.amount,
                0
            ) ?? 0
        )
    }, [selectedPayments])

    const { data: generatedORNumber, refetch: refetchGenerateOrNumber } =
        useGenerateOfficialReceipt({
            onSuccess: () => {},
        })

    const resetMemberSelectionAndForm = () => {
        form.reset({
            ORNumber: undefined,
            memberId: '',
        })
        setSelectedMember(null)
    }

    const resetSelectedPayments = () => {
        setSelectedPayments([])
    }

    const { mutate: createPayment, isPending: isPendingCreatePayments } =
        useCreatePaymentEntry({
            onSuccess: (data) => {
                const isNotPayment =
                    transactionType !== TRANSACTION_TYPE.payment
                toast.success(
                    `${data.length} ${transactionType} is successfully ${isNotPayment ? 'added' : ''}`
                )
                resetMemberSelectionAndForm()
                refetchGenerateOrNumber()
                resetSelectedPayments()
            },
            onError: (error) => {
                toast.error(error)
            },
        })

    const { mutateAsync, isPending: isPendingCheckClearing } =
        useCreateCheckClearing({
            onSuccess: (data) => {
                if (data.length > 1) {
                    toast.success(
                        `${data.length} clearing check is successfully added`
                    )
                }
            },
        })

    const handlePrintTransactionEntry = (payments: IPaymentsEntryRequest[]) => {
        const toPrintCount = payments.filter((item) => item.isPrinted)
        toast.info(`${toPrintCount.length} item transaction is printing now!`)
    }

    const handleSubmitPayment = (payments: IPaymentsEntry[]) => {
        const payload: IPaymentsEntryRequest[] = payments
            .filter((payment) => payment.account.id !== undefined)
            .map((payment) => {
                return {
                    ...payment,
                    accountsId: payment.account.id as string,
                }
            })

        const checkClearingPayload: ICheckClearingRequest[] = payments
            .flatMap((item) => item.checkClearing ?? [])
            .map((checkClearingItem) => ({ ...checkClearingItem }))

        if (checkClearingPayload.length === 0 && payload.length === 0) return

        handlePrintTransactionEntry(payload)
        mutateAsync(checkClearingPayload)
        createPayment(payload)
    }

    const isAllowedToCreatePayment = selectedMember !== null
    const hadSelectedPayments = selectedPayments.length <= 0

    usePaymentsShortcuts({
        hadSelectedPayments,
        selectedPayments,
        setSelectedMember,
        handleSubmitPayment,
        handleOpenCreateModal,
        isPendingCreatePayments,
        isPendingCheckClearing,
    })

    const { onOpen: onOpenImagePreview } = useImagePreview()
    return (
        <PageContainer>
            <TransactionPaymentEntryFormModal
                formProps={{
                    ORNumber: form.getValues('ORNumber'),
                    selectedMemberId: form.getValues('memberId'),
                    hadSelectedPayments,
                    refetchGenerateOrNumber,
                    resetMemberSelectionAndForm,
                    handlePrintTransactionEntry,
                }}
                open={openPaymentsEntryModal}
                onOpenChange={setOpenPaymentsEntryModal}
            />

            <div className="flex w-full max-w-full flex-col gap-y-4 space-y-2 p-4 lg:space-y-0">
                <legend className="pl-2 text-lg font-semibold text-secondary-foreground">
                    Payment Transactions
                </legend>
                <ResizablePanelGroup
                    direction="horizontal"
                    className="h-[100vh] min-h-[100vh] w-full !max-w-full"
                >
                    <ResizablePanel className="" defaultSize={30}>
                        <ResizablePanelGroup
                            className="min-h-[20vh]"
                            direction="vertical"
                        >
                            <ResizablePanel defaultSize={30} className="p-2">
                                <div className="">
                                    <Form {...form}>
                                        <form className="bg flex w-full min-w-[30vw] flex-col gap-y-2">
                                            <div className="flex gap-x-2">
                                                <Button
                                                    size="icon"
                                                    className="min-w-10"
                                                    variant="secondary"
                                                    disabled={!selectedMember}
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        resetMemberSelectionAndForm()
                                                    }}
                                                >
                                                    <XIcon />
                                                </Button>
                                                <FormFieldWrapper
                                                    control={form.control}
                                                    name="memberId"
                                                    className="grow"
                                                    render={({ field }) => (
                                                        <div className="relative w-full">
                                                            <MemberPicker
                                                                disabled={
                                                                    !hadSelectedPayments
                                                                }
                                                                allowShorcutCommand
                                                                value={
                                                                    field.value
                                                                }
                                                                onSelect={(
                                                                    member
                                                                ) => {
                                                                    if (
                                                                        !member.memberProfile
                                                                    ) {
                                                                        return toast.warning(
                                                                            'Sorry, this member profile is not yet completed'
                                                                        )
                                                                    }
                                                                    field.onChange(
                                                                        member.id
                                                                    )
                                                                    setSelectedMember(
                                                                        member
                                                                    )
                                                                    if (
                                                                        member
                                                                    ) {
                                                                        form.setValue(
                                                                            'ORNumber',
                                                                            generatedORNumber?.OR ??
                                                                                0
                                                                        )
                                                                    }
                                                                    refetchSelectedMemberLedger()
                                                                }}
                                                                placeholder="Select Members"
                                                            />
                                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-primary"></span>
                                                        </div>
                                                    )}
                                                />
                                                <FormFieldWrapper
                                                    control={form.control}
                                                    name="ORNumber"
                                                    render={({ field }) => (
                                                        <div className="relative w-full">
                                                            <Input
                                                                value={
                                                                    field.value
                                                                }
                                                                defaultValue={
                                                                    field.value
                                                                }
                                                                disabled={
                                                                    !selectedMember ||
                                                                    isPendingCreatePayments
                                                                }
                                                                onChange={
                                                                    field.onChange
                                                                }
                                                                className={cn(
                                                                    'pr-9 text-lg font-semibold placeholder:text-sm placeholder:font-normal placeholder:text-foreground/40'
                                                                )}
                                                                placeholder="Official Receipt Number"
                                                                id="OR number"
                                                            />
                                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg font-bold text-secondary">
                                                                <ReceiptIcon />
                                                            </span>
                                                        </div>
                                                    )}
                                                ></FormFieldWrapper>
                                            </div>

                                            <PaymentsEntryProfile
                                                profile={selectedMember}
                                                onOpen={onOpenImagePreview}
                                            />
                                            <div className="flex w-full gap-x-2">
                                                <Button
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        handleOpenCreateModal(
                                                            'payment'
                                                        )
                                                    }}
                                                    className={cn(
                                                        'flex w-1/2 justify-between hover:bg-primary'
                                                    )}
                                                    disabled={
                                                        !isAllowedToCreatePayment ||
                                                        isPendingCreatePayments
                                                    }
                                                    variant={
                                                        isAllowedToCreatePayment
                                                            ? 'outline'
                                                            : 'secondary'
                                                    }
                                                >
                                                    <PaymentsIcon className="mr-2" />
                                                    {isPendingCreatePayments ? (
                                                        <LoadingSpinner />
                                                    ) : (
                                                        'Pay'
                                                    )}
                                                    <span className="ml-1 flex items-center justify-center gap-x-1">
                                                        ⌘
                                                        <F1Icon
                                                            className="text-muted-foreground"
                                                            size={23}
                                                        />
                                                    </span>
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    className={cn('w-1/2 grow')}
                                                    variant={
                                                        !selectedMember &&
                                                        !ORNumber
                                                            ? 'secondary'
                                                            : 'outline'
                                                    }
                                                    disabled={
                                                        (!selectedMember &&
                                                            !ORNumber) ||
                                                        isPendingCreatePayments
                                                    }
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        resetMemberSelectionAndForm()
                                                    }}
                                                >
                                                    Reset
                                                </Button>
                                            </div>
                                        </form>
                                    </Form>
                                </div>
                            </ResizablePanel>
                            <ResizableHandle />
                            <ResizablePanel defaultSize={70} className="p-2">
                                <div className="h-full w-full p-2">
                                    <AccountsLedgerTable
                                        table={table}
                                        isScrollable={isScrollable}
                                        isPending={
                                            isPendingSelectedMemberLedger
                                        }
                                        isRefetching={
                                            isRefetchingSelectedMemberLedger
                                        }
                                        totalSize={SelectedMemberTotalSize}
                                        refetch={refetchSelectedMemberLedger}
                                        filterState={filterState}
                                        setColumnOrder={setColumnOrder}
                                        setIsScrollable={setIsScrollable}
                                        className="h-full"
                                    />
                                </div>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={30}>
                        <div className="w-full min-w-[30vw] p-2">
                            <div className="flex items-center gap-x-2">
                                <div className="to-indigo-background/10 flex-grow rounded-xl border-[0.1px] border-primary/30 bg-gradient-to-br from-primary/10 p-2">
                                    <div className="flex items-center justify-between gap-x-2">
                                        <label className="text-sm font-bold uppercase text-muted-foreground">
                                            Total Amount
                                        </label>
                                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                            ₱{' '}
                                            {totalAmount
                                                ? commaSeparators(
                                                      totalAmount.toString()
                                                  )
                                                : '0.00'}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    onClick={() =>
                                        handleSubmitPayment(selectedPayments)
                                    }
                                    disabled={
                                        isPendingCreatePayments ||
                                        hadSelectedPayments ||
                                        isPendingCheckClearing
                                    }
                                >
                                    {isPendingCreatePayments ||
                                    isPendingCheckClearing ? (
                                        <span className="flex gap-x-2">
                                            Saving <LoadingSpinner />
                                        </span>
                                    ) : (
                                        'Save'
                                    )}
                                </Button>
                            </div>
                            <ScrollArea className="ecoop-scroll w-full overflow-auto py-2">
                                <CurrentPaymentsEntryList
                                    data={selectedPayments}
                                />
                            </ScrollArea>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </PageContainer>
    )
}

export default OwnerPaymentsEntry
