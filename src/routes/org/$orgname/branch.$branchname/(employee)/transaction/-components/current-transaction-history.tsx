import { useState } from 'react'

import { PAGINATION_INITIAL_INDEX } from '@/constants'
import { formatDate } from '@/helpers'
import { ITransactionResponse } from '@/types/coop-types'
import { dateAgo, toReadableDateTime } from '@/utils'
import { useNavigate } from '@tanstack/react-router'
import { PaginationState } from '@tanstack/react-table'
import { FileText } from 'lucide-react'

import { HistoryIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'
import RefreshButton from '@/components/refresh-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { useFilteredCurrentPaginatedTransaction } from '@/hooks/api-hooks/use-transaction'
import { useShortcut } from '@/hooks/shortcut-hooks/use-shorcuts'
import useFilterState from '@/hooks/use-filter-state'

import { TEntityId } from '@/types'

interface TransactionCardListProps {
    onDetailsClick?: (transaction: ITransactionResponse) => void
    fullPath: string
}

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(amount)
}

const NoTransactionsFound = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <FileText size={48} className="mb-4 text-gray-400" />
        <p className="text-lg font-semibold">No Transactions Found</p>
        <p className="text-sm">
            There are no transactions to display at the moment.
        </p>
    </div>
)

const TransactionCardSkeleton = () => (
    <Card className="w-full animate-pulse">
        <CardHeader>
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-6 w-16" />
            </div>
        </CardHeader>
        <CardContent>
            <Separator className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-full" />
                </div>
            </div>
            <Skeleton className="mt-6 h-10 w-32" />
        </CardContent>
    </Card>
)
interface TransactionDetailsCardProps {
    transaction: ITransactionResponse
}

interface UserInfoItemProps {
    label: string
    value: string | number | React.ReactNode
}

const UserInfoItem: React.FC<UserInfoItemProps> = ({ label, value }) => (
    <div className="space-y-1">
        <p className="text-[11px] dark:text-muted-foreground  text-muted-foreground">
            {label}
        </p>
        <p className="font-semibold dark:text-gray-200 text-muted-foreground">
            {value}
        </p>
    </div>
)

interface UserInfoGridProps {
    data: { label: string; value: string | number | React.ReactNode }[]
    title?: string
}

const UserInfoGrid: React.FC<UserInfoGridProps> = ({ data, title }) => {
    return (
        <div className="dark:bg-secondary/30 bg-transparent p-4 dark:rounded-xl">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                {title}
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
                {data.map((item, index) => (
                    <UserInfoItem
                        key={index}
                        label={item.label}
                        value={item.value}
                    />
                ))}
            </div>
        </div>
    )
}

const TransactionDetailsCard = ({
    transaction,
}: TransactionDetailsCardProps) => {
    const {
        reference_number,
        created_at,
        description,
        amount,
        member_profile,
        loan_balance,
        loan_due,
        fines_due,
        total_loan,
    } = transaction

    const userName = member_profile?.full_name || 'N/A'
    const passbook = member_profile?.passbook || 'Not Available'
    const userPhoneNumber = member_profile?.contact_number || 'Not Available'
    const memberSince = member_profile?.created_at
        ? formatDate(member_profile.created_at)
        : 'Not Available'

    return (
        <div className="p-6 rounded-xl font-sans max-h-fit w-full mx-auto">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-semibold ">
                        {reference_number}
                    </h2>
                    <p className="text-[11px] text-gray-400">
                        {toReadableDateTime(created_at)}
                    </p>
                </div>
            </div>
            <div className="flex flex-col gap-y-2 mb-4">
                {/* Transaction Information */}
                <div className="dark:bg-gray-800/30 bg-gray-100 p-4 rounded-xl ">
                    <h3 className="text-sm dark:text-gray-400 text-gray-600 font-bold mb-2">
                        Transaction Information
                    </h3>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <p className="text-xs text-gray-400">
                                {description}
                            </p>
                        </div>
                        <p className="font-semibold dark:text-primary flex-shrink-0">
                            {formatCurrency(amount)}
                        </p>
                    </div>
                </div>

                {/* User Information */}
                <UserInfoGrid
                    title="Member Information"
                    data={[
                        { label: 'Name', value: userName },
                        { label: 'Passbook', value: passbook },
                        { label: 'Phone Number', value: userPhoneNumber },
                        { label: 'Member Since', value: memberSince },
                    ]}
                />
                <div className="w-full px-5 dark:hidden">
                    <Separator className=" w-full" />
                </div>
                {/* Account and Loan Information (adapted from Shipping) */}
                <UserInfoGrid
                    title="Account and Loan Information"
                    data={[
                        {
                            label: 'Total Loan',
                            value: formatCurrency(total_loan),
                        },
                        {
                            label: 'Loan Balance',
                            value: formatCurrency(loan_balance),
                        },
                        { label: 'Loan Due', value: formatCurrency(loan_due) },
                        {
                            label: 'Fines Due',
                            value: formatCurrency(fines_due),
                        },
                    ]}
                />
                <div>
                    <label className="text-sm font-semibold text-muted-foreground">
                        Signature
                    </label>
                    <PreviewMediaWrapper
                        media={transaction.signature_media || undefined}
                    >
                        <ImageDisplay
                            className="size-20 w-full rounded-xl"
                            src={transaction.signature_media?.download_url}
                        />
                    </PreviewMediaWrapper>
                </div>
                <div className="w-full px-5 dark:hidden">
                    <Separator className=" w-full" />
                </div>
                {/* Payment Information */}
                <div>
                    <label className="text-sm font-semibold text-muted-foreground">
                        Note/Description
                    </label>
                    <div className="min-h-40 bg-secondary/10 dark:bg-secondary/30 p-4 rounded-xl">
                        <p className="text-xs text-gray-500">
                            {transaction.description ||
                                'No description provided.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
type TransactionCardListItemProps = {
    item: ITransactionResponse
    onClick?: () => void
}

const TransactionCardListItem = ({
    item,
    onClick,
}: TransactionCardListItemProps) => {
    return (
        <div className="w-full space-x-2 cursor-pointer flex flex-row border items-center p-3 rounded-xl bg-muted/30">
            <div className="icon">
                <Sheet>
                    <SheetTrigger asChild className="text-xs">
                        <ImageDisplay
                            className="size-12 w-full rounded-xl"
                            src={item.member_profile?.media?.download_url}
                        />
                    </SheetTrigger>
                    <SheetContent className="min-w-full max-w-[400px] md:min-w-[500px] p-0 border m-5 pt-4 rounded-lg ">
                        <TransactionDetailsCard transaction={item} />
                    </SheetContent>
                </Sheet>
            </div>
            <div className="content grow">
                <p onClick={() => onClick?.()}>
                    {item.member_profile?.full_name || 'Unknown Member'} -{' '}
                    <span className="text-xs rounded-sm bg-secondary px-1.5 py-1">
                        {item.reference_number}
                    </span>
                    <span className="italic text-xs">{item.source}</span>
                </p>
                <div className="flex">
                    <p className="text-[11px] text-muted-foreground">
                        {toReadableDateTime(item.created_at)}
                    </p>
                </div>
            </div>
            <div className="actions text-xs text-end">
                <p className="font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(item.amount)}
                </p>
                <p className="text-xs text-muted-foreground">
                    {dateAgo(item.created_at)}
                </p>
            </div>
        </div>
    )
}

const TransactionCardList = ({ fullPath }: TransactionCardListProps) => {
    const navigate = useNavigate()
    const [onOpen, setOnOpen] = useState(false)
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: PAGINATION_INITIAL_INDEX,
        pageSize: 10,
    })
    const { finalFilterPayload } = useFilterState({
        defaultFilterMode: 'OR',
        onFilterChange: () =>
            setPagination((prev) => ({
                ...prev,
                pageIndex: PAGINATION_INITIAL_INDEX,
            })),
    })

    const {
        data: CurrentTransaction,
        isLoading: isLoadingCurrentTransaction,
        isFetching,
        refetch: refetchCurrentTransaction,
    } = useFilteredCurrentPaginatedTransaction({
        filterPayload: finalFilterPayload,
        pagination,
    })
    const handleNavigate = (transactionId: TEntityId, fullPath: string) => {
        navigate({
            to: fullPath,
            search: {
                transactionId: transactionId,
            },
        })
        setOnOpen(false)
    }

    useShortcut(
        'h',
        () => {
            setOnOpen(true)
        },
        {
            disableTextInputs: true,
        }
    )
    if (isLoadingCurrentTransaction) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                    <TransactionCardSkeleton key={index} />
                ))}
            </div>
        )
    }

    const isNoCurrentTransaction =
        !CurrentTransaction || CurrentTransaction.data.length === 0

    return (
        <div className="flex w-full flex-row items-center justify-between ">
            <Sheet open={onOpen} onOpenChange={setOnOpen}>
                <SheetTrigger asChild className="">
                    <Button
                        variant="ghost"
                        className=""
                        size="sm"
                        onClick={() => setOnOpen(true)}
                    >
                        <HistoryIcon className="mr-2" />
                        History
                    </Button>
                </SheetTrigger>
                <SheetContent className=" min-w-full max-w-[500px] md:min-w-[600px]">
                    <div className="overflow-y-auto ecoop-scroll">
                        <ScrollArea>
                            <div className="min-h-[90vh] h-[90vh] flex flex-col space-y-1.5">
                                <h1 className="text-lg font-bold">
                                    Transaction History
                                    <RefreshButton
                                        className="bg-transparent size-7"
                                        onClick={refetchCurrentTransaction}
                                        isLoading={isLoadingCurrentTransaction}
                                    />
                                </h1>
                                {isNoCurrentTransaction && (
                                    <NoTransactionsFound />
                                )}
                                {CurrentTransaction.data.map((transaction) => (
                                    <div key={transaction.id}>
                                        <TransactionCardListItem
                                            item={transaction}
                                            onClick={() =>
                                                handleNavigate(
                                                    transaction.id,
                                                    fullPath
                                                )
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <div>
                            <MiniPaginationBar
                                pagination={{
                                    pageIndex: pagination.pageIndex,
                                    pageSize: pagination.pageSize,
                                    totalPage: CurrentTransaction.totalPage,
                                    totalSize: CurrentTransaction.totalSize,
                                }}
                                disablePageMove={isFetching}
                                onNext={({ pageIndex }) =>
                                    setPagination((prev) => ({
                                        ...prev,
                                        pageIndex,
                                    }))
                                }
                                onPrev={({ pageIndex }) =>
                                    setPagination((prev) => ({
                                        ...prev,
                                        pageIndex,
                                    }))
                                }
                            />
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
            <p className="text-[min(10px,1rem)] text-muted-foreground/50 text-end">
                F1 - payment | F2 - deposit | F3 - withdraw | Esc - reset
            </p>
        </div>
    )
}

export default TransactionCardList
