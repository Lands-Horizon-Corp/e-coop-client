import { useState } from 'react'

import { PAGINATION_INITIAL_INDEX } from '@/constants'
import { formatDate } from '@/helpers'
import { IGeneralLedgerResponse, TPaymentMode } from '@/types/coop-types'
import { dateAgo, toReadableDateTime } from '@/utils'
import { PaginationState } from '@tanstack/react-table'

import { LedgerSourceBadge } from '@/components/badges/ledger-source-badge'
import { HistoryIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'
import RefreshButton from '@/components/refresh-button'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { useFilteredPaginatedGeneralLedger } from '@/hooks/api-hooks/use-general-ledger'
import { useShortcut } from '@/hooks/shortcut-hooks/use-shorcuts'
import useFilterState from '@/hooks/use-filter-state'

import { PaymentsEntryItem } from '../../-components/current-payments-entry'
import {
    NoTransactionsFound,
    UserInfoGrid,
    formatCurrency,
} from '../../-components/current-transaction-history'

interface TransactionDetailsCardProps {
    transaction: IGeneralLedgerResponse
}

export const TransactionDetailsCard = ({
    transaction,
}: TransactionDetailsCardProps) => {
    const {
        created_at,
        description,
        balance,
        member_profile,
        source,
        transaction_reference_number,
    } = transaction

    const userName = member_profile?.full_name || 'N/A'
    const passbook = member_profile?.passbook || 'Not Available'
    const userPhoneNumber = member_profile?.contact_number || 'Not Available'
    const memberSince = member_profile?.created_at
        ? formatDate(member_profile.created_at)
        : 'Not Available'

    return (
        <div className="p-6 rounded-xl font-sans  max-h-fit w-full mx-auto">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-semibold ">
                        {transaction_reference_number}
                    </h2>

                    <p className="text-[11px] text-gray-400">
                        {toReadableDateTime(created_at)}
                    </p>
                </div>
            </div>
            <div className="flex flex-col gap-y-1 mb-4">
                {/* Transaction Information */}
                <div className="dark:bg-gray-800/30 bg-gray-100 p-4 rounded-xl ">
                    <h3 className="text-sm dark:text-gray-400 text-gray-600 font-bold mb-2">
                        Transaction Information
                    </h3>

                    <div className="flex items-center gap-4">
                        <LedgerSourceBadge
                            source={source}
                            className="ml-2 rounded-sm flex items-center justify-center size-8"
                            showValue={false}
                        />
                        <div className="flex-1">
                            <p className="font-semibold text-white text-sm">
                                {source.charAt(0).toUpperCase() +
                                    source.slice(1)}
                            </p>
                            <p className="text-xs text-gray-400">
                                {description}
                            </p>
                        </div>
                        <p className="font-semibold text-primary flex-shrink-0">
                            {formatCurrency(balance)}
                        </p>
                    </div>
                </div>

                {/* User Information */}
                <UserInfoGrid
                    className="mt-1"
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
                <PaymentsEntryItem
                    label="Other Details"
                    className="font-bold"
                />
                <PaymentsEntryItem
                    label="Type of Payment"
                    value={transaction.type_of_payment_type || 'N/A'}
                />
                <PaymentsEntryItem
                    label="Print Number"
                    value={String(transaction.print_number) || 'N/A'}
                />
                <PaymentsEntryItem label="Signature" className="font-bold" />
                <div>
                    <PreviewMediaWrapper
                        media={transaction.signature_media || undefined}
                    >
                        <ImageDisplay
                            className="size-20 w-full rounded-xl"
                            src={transaction.signature_media?.download_url}
                        />
                    </PreviewMediaWrapper>
                </div>
                {['online', 'bank', 'check'].includes(
                    transaction.payment_type?.type ?? ''
                ) && (
                    <>
                        <Separator className="my-2" />
                        <PaymentsEntryItem
                            label="Bank Details"
                            className="font-bold"
                        />
                        <PaymentsEntryItem
                            label="name"
                            value={transaction.bank?.name}
                        />
                        <PaymentsEntryItem
                            label="reference number"
                            value={transaction.bank_reference_number}
                        />
                        {/* <PaymentsEntryItem
                            label="entry date"
                            value={toReadableDate(transaction.entry_date)}
                        /> */}
                        <PaymentsEntryItem
                            label="Proof of Payment"
                            className="font-bold"
                        />
                        <PreviewMediaWrapper
                            media={
                                transaction.proof_of_payment_media || undefined
                            }
                        >
                            <ImageDisplay
                                className="size-20 w-full rounded-xl"
                                src={
                                    transaction.proof_of_payment_media
                                        ?.download_url
                                }
                            />
                        </PreviewMediaWrapper>
                    </>
                )}
            </div>
        </div>
    )
}

type TransactionDepositWithdrawCardListItemProps = {
    item: IGeneralLedgerResponse
    onClick?: () => void
}
const TransactionDepositWithdrawCardListItem = ({
    item,
    onClick,
}: TransactionDepositWithdrawCardListItemProps) => {
    return (
        <div className="w-full space-x-2 cursor-pointer flex flex-row  items-center p-3 rounded-xl bg-muted/30">
            <div className="icon">
                <Sheet>
                    <SheetTrigger asChild className="text-xs">
                        <LedgerSourceBadge
                            source={item.source}
                            className="rounded-lg size-10 flex items-center justify-center"
                            showValue={false}
                        />
                    </SheetTrigger>
                    <SheetContent className="min-w-full max-w-[400px] md:min-w-[500px] overflow-y-auto ecoop-scroll p-0 border m-5 pt-4 rounded-lg ">
                        <TransactionDetailsCard transaction={item} />
                    </SheetContent>
                </Sheet>
            </div>
            <div className="content grow">
                <p onClick={() => onClick?.()}>
                    {item.member_profile?.full_name || 'Unknown Member'}
                    {item.reference_number !== '' && (
                        <span className="text-xs rounded-sm bg-secondary px-1.5 py-1">
                            - {item.reference_number}
                        </span>
                    )}
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
                    {formatCurrency(item.balance)}
                </p>
                <p className="text-xs text-muted-foreground">
                    {dateAgo(item.created_at)}
                </p>
            </div>
        </div>
    )
}

type CurrentTransactionWithdrawHistoryDataProps = {
    mode: TPaymentMode
    modeState: 'branch' | 'current'
}

const CurrentTransactionWithdrawHistoryData = ({
    mode,
    modeState,
}: CurrentTransactionWithdrawHistoryDataProps) => {
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
        data: currentGeneralLedger,
        refetch: refetchCurrentTransaction,
        isLoading: isLoadingCurrentTransaction,
        isFetching: isFetchingCurrentTransaction,
    } = useFilteredPaginatedGeneralLedger({
        filterPayload: finalFilterPayload,
        pagination,
        mode: modeState,
        TEntryType: `${mode}-entry`,
    })
    const isNoCurrentTransaction =
        !currentGeneralLedger || currentGeneralLedger.data.length === 0
    return (
        <>
            <ScrollArea className="">
                <div className="w-full flex items-center justify-end">
                    <RefreshButton
                        className="bg-transparent size-7 "
                        onClick={refetchCurrentTransaction}
                        isLoading={isLoadingCurrentTransaction}
                    />
                </div>
                <div className="w-full flex flex-col h-[80vh] space-y-1.5">
                    {isNoCurrentTransaction && <NoTransactionsFound />}
                    {currentGeneralLedger.data.map((transaction) => (
                        <div key={transaction.id}>
                            <TransactionDepositWithdrawCardListItem
                                item={transaction}
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
                        totalPage: currentGeneralLedger.totalPage,
                        totalSize: currentGeneralLedger.totalSize,
                    }}
                    disablePageMove={isFetchingCurrentTransaction}
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
        </>
    )
}
type CurrentTransactionWithdrawHistoryProps = {
    mode: TPaymentMode
}
const CurrentTransactionWithdrawHistory = ({
    mode,
}: CurrentTransactionWithdrawHistoryProps) => {
    const [onOpen, setOnOpen] = useState(false)
    const [modeState, setModeState] = useState<'branch' | 'current'>('current')

    useShortcut(
        'h',
        () => {
            setOnOpen(true)
        },
        {
            disableTextInputs: true,
        }
    )

    return (
        <div>
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
                <SheetContent className=" min-w-full max-w-[500px] md:min-w-[600px] ">
                    <div className="overflow-y-auto ecoop-scroll w-full">
                        <Tabs defaultValue={modeState} className="">
                            <div className="items-center flex h-full ">
                                <TabsList className="bg-muted/30 relative rounded-lg p-1 h-full">
                                    <TabsTrigger
                                        className="w-24 min-w-24"
                                        value="current"
                                        onClick={() => setModeState('current')}
                                    >
                                        My History
                                    </TabsTrigger>
                                    <TabsTrigger
                                        className="w-24 min-w-24"
                                        value="branch"
                                        onClick={() => setModeState('branch')}
                                    >
                                        All
                                    </TabsTrigger>
                                </TabsList>
                            </div>
                            <TabsContent value={modeState}>
                                <CurrentTransactionWithdrawHistoryData
                                    modeState={modeState}
                                    mode={mode}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default CurrentTransactionWithdrawHistory
