import {
    ReactNode,
    RefObject,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'

import Fuse from 'fuse.js'

import { formatNumber } from '@/helpers/number-utils'
import { cn } from '@/helpers/tw-utils'
import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import { currencyFormat } from '@/modules/currency'
import { IGeneratedSavingsInterestEntry } from '@/modules/generated-savings-interest-entry'
import { GeneratedSavingsInterestEntryCreateUpdateFormModal } from '@/modules/generated-savings-interest-entry/components/forms/generated-savings-interest-entry-create-update-form'
import { useGetGeneratedSavingsInterestEntry } from '@/modules/generated-savings-interest/generated-savings-interest.service'
import {
    type ColumnDef,
    Row,
    Table,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import {
    VirtualItem,
    Virtualizer,
    useVirtualizer,
} from '@tanstack/react-virtual'
import { Plus } from 'lucide-react'

import { TableRowActionStoreProvider } from '@/components/data-table/store/data-table-action-store'
import {
    MagnifyingGlassIcon,
    RefreshIcon,
    RenderIcon,
    TIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TableCell, TableRow } from '@/components/ui/table'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, TEntityId } from '@/types'

import {
    GeneratedSavingsInterestEntryAction,
    GeneratedSavingsInterestEntryRowContext,
    GeneratedSavingsInterestEntryTableActionManager,
} from './row-action-context'

export interface IGeneratedSavingsInterestEntryTableActionComponentProp {
    row: Row<IGeneratedSavingsInterestEntry>
    readOnly?: boolean
}

interface Props extends IClassProps {
    generatedSavingsInterestId: TEntityId
    readOnly?: boolean
    actionComponent?: (
        props: IGeneratedSavingsInterestEntryTableActionComponentProp
    ) => ReactNode
}

interface TableBodyProps {
    table: Table<IGeneratedSavingsInterestEntry>
    tableContainerRef: RefObject<HTMLDivElement | null>
}

interface TableBodyRowProps {
    row: Row<IGeneratedSavingsInterestEntry>
    virtualRow: VirtualItem
    rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>
}

const SearchInput = ({ onSearch }: { onSearch: (value: string) => void }) => {
    const [value, setValue] = useState('')

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onSearch(value)
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [value, onSearch])

    return (
        <div className="relative w-full max-w-sm">
            <Input
                className="pr-9"
                onChange={(e) => setValue(e.target.value)}
                placeholder="Search by passbook number..."
                type="text"
                value={value}
            />
            <MagnifyingGlassIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
    )
}

const TableBody = ({ table, tableContainerRef }: TableBodyProps) => {
    const { rows } = table.getRowModel()

    const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
        count: rows.length,
        estimateSize: () => 45,
        getScrollElement: () => tableContainerRef.current,
        measureElement:
            typeof window !== 'undefined' &&
            navigator.userAgent.indexOf('Firefox') === -1
                ? (element) => element?.getBoundingClientRect().height
                : undefined,
        overscan: 10,
    })

    useEffect(() => {
        if (tableContainerRef.current) {
            rowVirtualizer.measure()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableContainerRef.current, rowVirtualizer])

    return (
        <tbody
            style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: 'relative',
            }}
        >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[
                    virtualRow.index
                ] as Row<IGeneratedSavingsInterestEntry>
                return (
                    <TableBodyRow
                        key={row.id}
                        row={row}
                        rowVirtualizer={rowVirtualizer}
                        virtualRow={virtualRow}
                    />
                )
            })}
        </tbody>
    )
}

const TableBodyRow = ({
    row,
    virtualRow,
    rowVirtualizer,
}: TableBodyRowProps) => {
    // Calculate total size for proportional widths
    const totalSize = row
        .getAllCells()
        .reduce((sum, cell) => sum + cell.column.getSize(), 0)

    return (
        <GeneratedSavingsInterestEntryRowContext row={row}>
            <TableRow
                className="flex border-b-border/40 transition-colors hover:bg-muted/50"
                data-index={virtualRow.index}
                key={row.id}
                ref={(node) => rowVirtualizer.measureElement(node)}
                style={{
                    position: 'absolute',
                    transform: `translateY(${virtualRow.start}px)`,
                    width: '100%',
                }}
            >
                {row.getVisibleCells().map((cell) => {
                    const isRightAlign = [
                        'ending_balance',
                        'interest_amount',
                        'interest_tax',
                        'net_interest',
                    ].includes(cell.column.id)
                    return (
                        <TableCell
                            className={cn(
                                'p-3.5 align-middle flex items-center',
                                isRightAlign &&
                                    'text-right font-mono justify-end',
                                cell.column.id === 'net_interest' &&
                                    'font-medium',
                                cell.column.id === 'member_profile.passbook' &&
                                    'font-medium'
                            )}
                            key={cell.id}
                            style={{
                                width: `${(cell.column.getSize() / totalSize) * 100}%`,
                            }}
                        >
                            {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                            )}
                        </TableCell>
                    )
                })}
            </TableRow>
        </GeneratedSavingsInterestEntryRowContext>
    )
}

interface CreateEntryButtonProps {
    readOnly?: boolean
    generatedSavingsInterestId: TEntityId
}

const CreateEntryButton = ({
    readOnly,
    generatedSavingsInterestId,
}: CreateEntryButtonProps) => {
    const modalState = useModalState()

    const {
        currentAuth: {
            user_organization: {
                branch: {
                    branch_setting: { tax_interest },
                },
            },
        },
    } = useAuthUserWithOrgBranch()

    return (
        <>
            {!readOnly && (
                <Button
                    disabled={readOnly}
                    onClick={() => modalState.onOpenChange(true)}
                    size="sm"
                >
                    <Plus className="mr-1 size-4" />
                    Add
                </Button>
            )}

            <GeneratedSavingsInterestEntryCreateUpdateFormModal
                formProps={{
                    defaultValues: {
                        generated_savings_interest_id:
                            generatedSavingsInterestId,
                        interest_tax: tax_interest,
                    },
                    onSuccess: () => {
                        modalState.onOpenChange(false)
                    },
                }}
                {...modalState}
            />
        </>
    )
}

export const GeneratedSavingsInterestEntryTable = ({
    generatedSavingsInterestId,
    className,
    readOnly = false,
    actionComponent = GeneratedSavingsInterestEntryAction,
}: Props) => {
    const tableContainerRef = useRef<HTMLDivElement>(null)
    const [searchQuery, setSearchQuery] = useState('')

    const { data, isLoading, isFetching, refetch } =
        useGetGeneratedSavingsInterestEntry({
            generatedSavingsInterestId,
        })

    const entries = useMemo(() => data?.entries || [], [data?.entries])
    const totalInterest = useMemo(
        () => data?.total_interest || 0,
        [data?.total_interest]
    )

    const totalTax = useMemo(() => data?.total_tax || 0, [data?.total_tax])

    const fuse = useMemo(
        () =>
            new Fuse(entries, {
                keys: ['member_profile.passbook'],
                threshold: 0.3,
                includeScore: true,
            }),
        [entries]
    )

    const filteredEntries = useMemo(() => {
        if (!searchQuery.trim()) {
            return entries
        }

        const results = fuse.search(searchQuery)
        return results.map((result) => result.item)
    }, [entries, fuse, searchQuery])

    const columns = useMemo<ColumnDef<IGeneratedSavingsInterestEntry>[]>(
        () => [
            {
                accessorKey: 'member_profile.passbook',
                header: () => <p className="w-full">PB No</p>,
                cell: (info) =>
                    info.row.original.member_profile?.passbook || 'N/A',
                size: 150,
                minSize: 150,
            },
            {
                accessorKey: 'member_profile.full_name',
                header: () => <p className="w-full">Member Name</p>,
                cell: (info) => (
                    <div className="flex items-center gap-1 min-w-0">
                        <div className="flex-shrink-0">
                            <ImageDisplay
                                src={
                                    info.row.original.member_profile?.media
                                        ?.download_url
                                }
                            />
                        </div>
                        <span className="truncate">
                            {info.row.original.member_profile?.full_name ||
                                'N/A'}
                        </span>
                    </div>
                ),
                size: 300,
                minSize: 400,
            },
            {
                accessorKey: 'account.name',
                header: () => <p className="w-full">Account</p>,
                cell: (info) => (
                    <p className="truncate">
                        <RenderIcon
                            className="inline mr-2"
                            icon={info.row.original.account?.icon as TIcon}
                        />
                        <span>{info.row.original.account?.name || 'N/A'}</span>
                    </p>
                ),
                size: 150,
                minSize: 150,
            },
            {
                accessorKey: 'ending_balance',
                header: () => (
                    <p className="w-full text-right">Ending Balance</p>
                ),
                cell: (info) => {
                    const currency = info.row.original.account?.currency
                    return currencyFormat((info.getValue() as number) || 0, {
                        currency,
                        showSymbol: !!currency,
                    })
                },
                size: 150,
                minSize: 150,
            },
            {
                accessorKey: 'interest_amount',
                header: () => <p className="w-full text-right">Interest Amt</p>,
                cell: (info) => {
                    const currency = info.row.original.account?.currency
                    return currencyFormat((info.getValue() as number) || 0, {
                        currency,
                        showSymbol: !!currency,
                    })
                },
                size: 130,
                minSize: 130,
            },
            {
                accessorKey: 'interest_tax',
                header: () => <p className="w-full text-right">Interest Tax</p>,
                cell: (info) => {
                    const currency = info.row.original.account?.currency
                    return currencyFormat((info.getValue() as number) || 0, {
                        currency,
                        showSymbol: !!currency,
                    })
                },
                size: 130,
                minSize: 130,
            },
            {
                id: 'actions',
                header: () => <p className="w-full text-center">Actions</p>,
                cell: ({ row }) => {
                    return (
                        <div className="flex justify-center w-full">
                            {actionComponent({ row, readOnly })}
                        </div>
                    )
                },
                size: 120,
                minSize: 120,
            },
        ],
        [actionComponent, readOnly]
    )

    const table = useReactTable({
        data: filteredEntries,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const totalSize = table
        .getAllColumns()
        .reduce((sum, col) => sum + col.getSize(), 0)

    return (
        <TableRowActionStoreProvider>
            <div
                className={cn(
                    'rounded-lg h-full flex flex-col overflow-hidden',
                    className
                )}
            >
                {/* Search Header with Totals */}
                <div className="flex items-center justify-between p-2 gap-4 rounded-t bg-muted/50">
                    <SearchInput onSearch={setSearchQuery} />
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/70">
                            <span className="text-sm font-medium text-muted-foreground">
                                Total Interest:
                            </span>
                            <span className="text-sm font-semibold text-primary">
                                {currencyFormat(totalInterest)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-400/10 border border-orange-400/70">
                            <span className="text-sm font-medium text-muted-foreground">
                                Total Tax:
                            </span>
                            <span className="text-sm font-semibold text-accent-foreground">
                                {currencyFormat(totalTax)}
                            </span>
                        </div>

                        <CreateEntryButton
                            generatedSavingsInterestId={
                                generatedSavingsInterestId
                            }
                            readOnly={readOnly}
                        />

                        <Button
                            disabled={isFetching}
                            onClick={() => refetch()}
                            size="icon-sm"
                            variant="outline"
                        >
                            {isFetching ? (
                                <LoadingSpinner className="size-4" />
                            ) : (
                                <RefreshIcon className="size-4" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Table Section */}
                <div
                    className="flex-1 overflow-auto ecoop-scroll border-t-0 rounded-b-md relative"
                    ref={tableContainerRef}
                >
                    <table className="text-sm" style={{ width: '100%' }}>
                        <thead
                            style={{
                                position: 'sticky',
                                top: 0,
                                zIndex: 10,
                            }}
                        >
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr
                                    className="border-b hover:bg-transparent bg-secondary dark:bg-popover"
                                    key={headerGroup.id}
                                    style={{ display: 'flex', width: '100%' }}
                                >
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            className="h-12 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap bg-secondary dark:bg-popover flex items-center"
                                            key={header.id}
                                            style={{
                                                width: `${(header.getSize() / totalSize) * 100}%`,
                                            }}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        {isLoading ? (
                            <tbody>
                                <tr className="border-b transition-colors hover:bg-muted/50">
                                    <td
                                        className="h-24 text-center p-4 align-middle"
                                        colSpan={columns.length}
                                    >
                                        Loading entries...
                                    </td>
                                </tr>
                            </tbody>
                        ) : filteredEntries.length === 0 ? (
                            <tbody>
                                <tr className="border-b transition-colors hover:bg-muted/50">
                                    <td
                                        className="h-24 text-center p-4 align-middle"
                                        colSpan={columns.length}
                                    >
                                        <p>
                                            {searchQuery
                                                ? 'No matching entries found'
                                                : 'No entries found'}
                                        </p>
                                    </td>
                                </tr>
                            </tbody>
                        ) : (
                            <TableBody
                                table={table}
                                tableContainerRef={tableContainerRef}
                            />
                        )}
                    </table>
                </div>
            </div>
            <GeneratedSavingsInterestEntryTableActionManager />
        </TableRowActionStoreProvider>
    )
}

export const GeneratedSavingsInterestEntryTableModal = ({
    title = 'Savings Interest Entries',
    description,
    className,
    tableProps,
    ...props
}: IModalProps & {
    tableProps: Omit<Props, 'className'>
}) => {
    const { data } = useGetGeneratedSavingsInterestEntry({
        generatedSavingsInterestId: tableProps.generatedSavingsInterestId,
    })

    const entries = data?.entries || []

    const defaultDescription = `Showing ${formatNumber(entries.length)} savings interest entries. You can edit or delete entries from this view.`

    return (
        <Modal
            className={cn('!max-w-[70vw]', className)}
            description={description || defaultDescription}
            title={title}
            {...props}
        >
            <GeneratedSavingsInterestEntryTable
                className="h-[70vh]"
                {...tableProps}
            />
        </Modal>
    )
}
