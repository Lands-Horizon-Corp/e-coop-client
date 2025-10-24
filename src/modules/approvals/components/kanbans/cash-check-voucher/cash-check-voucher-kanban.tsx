import { cn } from '@/helpers/tw-utils'
import {
    ICashCheckVoucher,
    TCashCheckVoucherMode,
} from '@/modules/cash-check-voucher'
import { TJournalVoucherMode } from '@/modules/journal-voucher'
import { CheckCircle2Icon, PrinterIcon } from 'lucide-react'

import {
    BadgeCheckFillIcon,
    DraftIcon,
    MagnifyingGlassIcon as SearchIcon,
} from '@/components/icons'
import { Badge } from '@/components/ui/badge'

import { IClassProps } from '@/types'

import { useSearchKanban } from '../hook/use-search-kanban'
import { SearchKanbanInput } from '../search-kanban-input'
import { CashCheckVoucherKanbanMain } from './cash-check-voucher-kanban-main'

export interface ICashCheckVoucherStatusDates {
    printed_date?: string | null
    approved_date?: string | null
    released_date?: string | null
}

export interface ICashCheckVoucherCardProps extends IClassProps {
    cashCheckVoucher: ICashCheckVoucher
    refetch: () => void
    searchTerm?: string
    highlightMatch?: (text: string, searchTerm: string) => React.ReactNode
}

export type TCashCheckVoucherKanbanItem = {
    name: string
    value: TJournalVoucherMode
    icon: React.ReactNode
}

const CashCheckVoucherMenu: TCashCheckVoucherKanbanItem[] = [
    {
        name: 'Draft',
        value: 'draft',
        icon: <DraftIcon className="mr-2 size-4 text-primary" />,
    },
    {
        name: 'Printed',
        value: 'printed',
        icon: <PrinterIcon className="mr-2 size-4 text-blue-500" />,
    },
    {
        name: 'Approved',
        value: 'approved',
        icon: (
            <CheckCircle2Icon className="mr-2 size-4 text-success-foreground" />
        ),
    },
    {
        name: 'Released',
        value: 'release-today',
        icon: <BadgeCheckFillIcon className="mr-2 size-4 text-purple-500" />,
    },
]

const CashCheckVoucherKanban = ({ className }: { className?: string }) => {
    const searchKanban = useSearchKanban<TCashCheckVoucherMode>({
        menuItems: CashCheckVoucherMenu,
        initialMode: null,
        initialSearchTerm: '',
        initialSearchAllModes: false,
    })

    const { selectedMode, searchTerm, searchAllModes, selectedItem } =
        searchKanban

    return (
        <div className={cn('flex flex-col w-full border h-full', className)}>
            {/* Top Controls Section */}
            <SearchKanbanInput<TCashCheckVoucherMode>
                kanbanType="cash-check-voucher"
                menuItems={CashCheckVoucherMenu}
                {...searchKanban}
            />
            <div className="flex-1 flex overflow-auto ecoop-scroll">
                {selectedMode ? (
                    //Single Mode View - When a specific mode is selected
                    <div className="flex justify-center gap-6 w-full p-4">
                        <CashCheckVoucherKanbanMain
                            enableSearch={false}
                            icon={selectedItem!.icon}
                            isSelected={true}
                            key={selectedItem!.value}
                            mode={selectedItem!.value}
                            searchTerm={searchTerm}
                        />
                    </div>
                ) : (
                    // All Modes View - Default view or when searching all modes
                    <div className="flex gap-4 p-4 w-full">
                        {CashCheckVoucherMenu.map((item) => (
                            <CashCheckVoucherKanbanMain
                                enableSearch={false}
                                icon={item.icon}
                                isSearchHighlighted={
                                    searchAllModes && searchTerm.length > 0
                                }
                                isSelected={false}
                                key={item.value}
                                mode={item.value}
                                searchTerm={searchAllModes ? searchTerm : ''}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="flex-0 border-t bg-muted/10 p-2 px-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                        {searchAllModes
                            ? 'Viewing: All modes with search'
                            : selectedMode
                              ? `Viewing: ${selectedItem?.name} mode`
                              : 'Viewing: All modes'}
                    </span>
                    {searchTerm && (
                        <span className="flex items-center gap-2">
                            <SearchIcon className="size-3" />
                            Search active: "{searchTerm}"
                            {searchAllModes && (
                                <Badge
                                    className="text-xs py-0"
                                    variant="outline"
                                >
                                    All Modes
                                </Badge>
                            )}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CashCheckVoucherKanban
