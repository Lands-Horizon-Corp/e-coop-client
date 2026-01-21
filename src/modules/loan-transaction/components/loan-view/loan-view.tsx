import { toast } from 'sonner'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { sortAccountsByTypePriority } from '@/modules/account/account.utils'
import { currencyFormat } from '@/modules/currency'
import LoanGuide from '@/modules/loan-guide/components/loan-guide'
import {
    ILoanTransaction,
    useGetLoanTransactionById,
    useProcessLoanTransactionById,
} from '@/modules/loan-transaction'
import { IMemberProfile } from '@/modules/member-profile'

import {
    CalculatorIcon,
    LinkIcon,
    PlusIcon,
    PrinterFillIcon,
    UndoIcon,
    Users3Icon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import FormErrorMessage from '@/components/ui/form-error-message'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, TEntityId } from '@/types'

import { LoanAddInterestFormModal } from '../forms/loan-add-interest-form'
import { LoanInquireAdvanceInterestFinesModal } from '../forms/loan-inquire-advance-interest-fines-form'
import { LoanViewSkeleton } from '../skeletons/loan-view-skeleton'
import { LoanAccountsView } from './loan-accounts-view'
import { LoanComakersList } from './loan-comakers'
import LoanLedgerHeader from './loan-ledger-header'

// import LoanLedgerTable from './loan-ledger-table/loan-ledger-table'
// import GeneralLedgerTable from '@/modules/general-ledger/components/tables/general-ledger-table'

interface LoanLedgerViewProps extends IClassProps {
    loanTransactionId: TEntityId
    defaultLoanTransaction?: ILoanTransaction
}

const LoanView = ({
    className,
    loanTransactionId,
    defaultLoanTransaction,
}: LoanLedgerViewProps) => {
    const {
        data = defaultLoanTransaction,
        isPending,
        isRefetching,
        isEnabled,
        error,
        refetch: refetchLoanTransaction,
    } = useGetLoanTransactionById({
        id: loanTransactionId,
        options: {
            enabled: !!loanTransactionId,
            initialData: defaultLoanTransaction,
        },
    })

    const handleRefresh = () => {
        refetchLoanTransaction()
    }

    const errorMessage = !isEnabled
        ? 'No valid loan transaction selected'
        : serverRequestErrExtractor({ error })

    const { isPending: isProcessing, mutateAsync: processLoanTransaction } =
        useProcessLoanTransactionById({
            options: {
                onSuccess: () => handleRefresh(),
            },
        })

    return (
        <div className={cn('space-y-4 p-4 w-full', className)}>
            {!!loanTransactionId && errorMessage && (
                <FormErrorMessage
                    className="mx-auto"
                    errorMessage={errorMessage}
                />
            )}
            {(isPending || !data) && isEnabled && <LoanViewSkeleton />}
            {data && (
                <>
                    <LoanLedgerHeader
                        canProcess={!isProcessing || !data.processing}
                        canRefresh={!isRefetching}
                        handleProcess={() => {
                            toast.promise(processLoanTransaction(data.id), {
                                loading: 'Processing loan...',
                                error: 'Failed to process loan.',
                                success: 'Loan has been processed.',
                            })
                        }}
                        handleRefresh={handleRefresh}
                        loanTransaction={data}
                        // loanTransactionSummary={loanSummary}
                    />
                    {/* <LoanLedgerTable
                        className="h-[50vh] w-full rounded-lg"
                        data={[]}
                        view={'skeleton'}
                    /> */}
                    {/* <GeneralLedgerTable className='h-[50vh] w-full rounded-lg' mode='' /> */}

                    <LoanGuide
                        className="max-h-[80vh] flex"
                        loanTransactionId={loanTransactionId}
                    />

                    <Tabs className="w-full" defaultValue="account-summary">
                        <ScrollArea>
                            <TabsList className="mb-3 h-auto gap-2 rounded-none border-b bg-transparent px-0 py-1 text-foreground">
                                <TabsTrigger
                                    className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 after:duration-300 after:ease-in-out hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                                    value="account-summary"
                                >
                                    <LinkIcon className="me-1.5 size-4 opacity-60" />
                                    Account Summary
                                </TabsTrigger>
                                <TabsTrigger
                                    className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 after:duration-300 after:ease-in-out hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                                    value="comakers"
                                >
                                    <Users3Icon className="me-1.5 size-4 opacity-60" />
                                    Comakers
                                </TabsTrigger>
                            </TabsList>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>

                        <TabsContent value="account-summary">
                            <LoanAccountsView
                                loanTransactionAccounts={
                                    (data?.loan_accounts || []).sort(
                                        ({ account: a }, { account: b }) =>
                                            sortAccountsByTypePriority(a, b)
                                    ) || []
                                }
                            />
                        </TabsContent>

                        <TabsContent value="comakers">
                            <LoanComakersList loanTransactionId={data.id} />
                        </TabsContent>
                    </Tabs>
                </>
            )}
        </div>
    )
}

// Quick Summary & Actions
export const LoanQuickSummary = ({
    className,
    loanTransaction,
}: IClassProps & { loanTransaction: ILoanTransaction }) => {
    const calculatorModalState = useModalState()
    const addInterestModalState = useModalState()

    const members_amount: { member_profile: IMemberProfile; amount: number }[] =
        []

    return (
        <div
            className={cn(
                'w-full flex gap-4 border border-border bg-popover text-sm justify-between p-4 rounded-lg',
                className
            )}
        >
            <LoanInquireAdvanceInterestFinesModal {...calculatorModalState} />
            <LoanAddInterestFormModal
                {...addInterestModalState}
                formProps={{
                    loanTransactionId: loanTransaction.id,
                }}
            />

            {/* Members & Amount Table */}
            <Table wrapperClassName="flex-1 max-h-[200px] bg-secondary rounded-lg ecoop-scroll">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-2/3">Member</TableHead>
                        <TableHead className="w-1/3 text-right">
                            Amount
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {members_amount.length === 0 ? (
                        <TableRow>
                            <TableCell
                                className="text-center text-xs text-muted-foreground h-24"
                                colSpan={2}
                            >
                                No data to display
                            </TableCell>
                        </TableRow>
                    ) : (
                        members_amount.map(
                            ({ member_profile, amount }, idx) => (
                                <TableRow key={member_profile?.id ?? idx}>
                                    <TableCell className="w-2/3">
                                        <div className="flex items-center gap-2">
                                            <ImageDisplay
                                                className="size-6 rounded-full"
                                                fallback={
                                                    member_profile?.full_name?.charAt(
                                                        0
                                                    ) ?? '?'
                                                }
                                                src={
                                                    member_profile?.media
                                                        ?.download_url
                                                }
                                            />
                                            <span className="truncate">
                                                {member_profile?.full_name ? (
                                                    member_profile.full_name
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">
                                                        ...
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="w-1/3 text-right font-mono">
                                        {typeof amount === 'number' ? (
                                            currencyFormat(amount, {
                                                currency:
                                                    loanTransaction.account
                                                        ?.currency,
                                                showSymbol:
                                                    !!loanTransaction.account
                                                        ?.currency,
                                            })
                                        ) : (
                                            <span className="text-xs text-muted-foreground">
                                                ...
                                            </span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )
                        )
                    )}
                </TableBody>
            </Table>

            {/* Grouped Summary */}
            <div className="flex w-fit gap-8 overflow-clip"></div>

            {/* Actions */}
            <div className="flex flex-col gap-2 items-end justify-start min-w-[140px]">
                <Button
                    className="w-full flex gap-2 items-center"
                    onClick={() => calculatorModalState.onOpenChange(true)}
                    size="sm"
                    variant="secondary"
                >
                    <CalculatorIcon className="size-4" />
                    Calc. Advance Interest/Fines
                </Button>
                <Button
                    className="w-full flex gap-2 items-center"
                    onClick={() => addInterestModalState.onOpenChange(true)}
                    size="sm"
                    variant="secondary"
                >
                    <PlusIcon className="size-4" />
                    Add Interest
                </Button>
                <Button
                    className="w-full flex gap-2 items-center"
                    size="sm"
                    variant="secondary"
                >
                    <PrinterFillIcon className="size-4" />
                    Print Ledger
                </Button>
                <Button
                    className="w-full flex gap-2 items-center"
                    size="sm"
                    variant="secondary"
                >
                    <UndoIcon className="size-4" />
                    RePrint
                </Button>
            </div>
        </div>
    )
}

export const LoanViewModal = ({
    title = 'Loan Transaction Details',
    description = 'View loan transaction details and ledger.',
    className,
    loanTransactionId,
    defaultLoanTransaction,
    ...props
}: IModalProps & {
    loanTransactionId: string
    defaultLoanTransaction?: ILoanTransaction
}) => {
    return (
        <Modal
            className={cn('!max-w-[95vw]', className)}
            closeButtonClassName="hidden"
            description={description}
            descriptionClassName="hidden"
            title={title}
            titleClassName="hidden"
            {...props}
        >
            <LoanView
                className="p-0 max-w-full min-w-0"
                defaultLoanTransaction={defaultLoanTransaction}
                loanTransactionId={loanTransactionId}
            />
        </Modal>
    )
}

export default LoanView
