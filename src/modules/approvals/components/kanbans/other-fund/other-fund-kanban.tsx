import { useMemo } from 'react'

import { cn } from '@/helpers/tw-utils'
import { hasPermissionFromAuth } from '@/modules/authentication/authgentication.store'
import { IOtherFund, TOtherFundMode } from '@/modules/other-fund'
// Assuming these exist
import PermissionGuard from '@/modules/permission/components/permission-guard'
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
import { OtherFundKanbanMain } from './other-fund-kanban-main'

export interface IOtherFundStatusDates {
    printed_date?: string | null
    approved_date?: string | null
    released_date?: string | null
}

export interface IOtherFundCardProps extends IClassProps {
    otherFund: IOtherFund
    refetch: () => void
    searchTerm?: string
    highlightMatch?: (text: string, searchTerm: string) => React.ReactNode
}

export type TOtherFundKanbanItem = {
    name: string
    value: TOtherFundMode
    icon: React.ReactNode
    allowed?: boolean
}

const OtherFundKanban = ({ className }: { className?: string }) => {
    const OtherFundMenu: TOtherFundKanbanItem[] = useMemo(() => {
        return [
            {
                name: 'Draft',
                value: 'draft',
                icon: <DraftIcon className="mr-2 size-4 text-primary" />,
                allowed: hasPermissionFromAuth({
                    action: 'Read',
                    resourceType: 'ApprovalsOtherFundDraft',
                }),
            },
            {
                name: 'Printed',
                value: 'printed',
                icon: <PrinterIcon className="mr-2 size-4 text-blue-500" />,
                allowed: hasPermissionFromAuth({
                    action: 'Read',
                    resourceType: 'ApprovalsOtherFundPrinted',
                }),
            },
            {
                name: 'Approved',
                value: 'approved',
                icon: (
                    <CheckCircle2Icon className="mr-2 size-4 text-success-foreground" />
                ),
                allowed: hasPermissionFromAuth({
                    action: 'Read',
                    resourceType: 'ApprovalsOtherFundApproved',
                }),
            },
            {
                name: 'Released',
                value: 'release-today',
                icon: (
                    <BadgeCheckFillIcon className="mr-2 size-4 text-purple-500" />
                ),
                allowed: hasPermissionFromAuth({
                    action: 'Read',
                    resourceType: 'ApprovalsOtherFundReleased',
                }),
            },
        ]
    }, [])

    const searchKanban = useSearchKanban<TOtherFundMode>({
        menuItems: OtherFundMenu,
        initialMode: null,
        initialSearchTerm: '',
        initialSearchAllModes: false,
    })

    const { selectedMode, searchTerm, searchAllModes, selectedItem } =
        searchKanban

    return (
        <div className={cn('flex flex-col w-full border h-full', className)}>
            <PermissionGuard action="Read" resourceType="ApprovalsOtherFund">
                <SearchKanbanInput<TOtherFundMode>
                    kanbanType="other-fund"
                    menuItems={OtherFundMenu}
                    {...searchKanban}
                />
                <div className="flex-1 flex overflow-auto ecoop-scroll">
                    {selectedMode ? (
                        <div className="flex justify-center gap-6 w-full p-4">
                            <OtherFundKanbanMain
                                enableSearch={false}
                                icon={selectedItem!.icon}
                                isSelected={true}
                                key={selectedItem!.value}
                                mode={selectedItem!.value}
                                searchTerm={searchTerm}
                            />
                        </div>
                    ) : (
                        <div className="flex gap-4 p-4 w-full">
                            {OtherFundMenu.map((item) => {
                                if (!item.allowed) return null
                                return (
                                    <OtherFundKanbanMain
                                        enableSearch={false}
                                        icon={item.icon}
                                        isSearchHighlighted={
                                            searchAllModes &&
                                            searchTerm.length > 0
                                        }
                                        isSelected={false}
                                        key={item.value}
                                        mode={item.value}
                                        searchTerm={
                                            searchAllModes ? searchTerm : ''
                                        }
                                    />
                                )
                            })}
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
            </PermissionGuard>
        </div>
    )
}

export default OtherFundKanban
