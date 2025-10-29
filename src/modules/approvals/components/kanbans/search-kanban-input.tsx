import { useNavigate } from '@tanstack/react-router'

import { cn } from '@/helpers'
import { SearchIcon } from 'lucide-react'

import { LinkIcon, MagnifyingGlassIcon, XIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Kbd } from '@/components/ui/kbd'
import { Label } from '@/components/ui/label'

import { TKanbanMenuItem } from './hook/use-search-kanban'

type kanbanType = 'journal-voucher' | 'cash-check-voucher' | 'loan'

type TSearchKanbanInputProps<T = string> = {
    searchTerm: string
    setSearchTerm: (term: string) => void
    searchAllModes: boolean
    showSearch: boolean
    selectedItem: TKanbanMenuItem<T> | null
    selectedMode: T | null
    handleModeChange: (mode: T) => void
    handleClearSearch: () => void
    handleSearchAllModesChange: (checked: boolean) => void
    resetAll: () => void
    menuItems: TKanbanMenuItem<T>[]
    kanbanType: kanbanType
}

export const SearchKanbanInput = <T extends string>({
    searchTerm,
    setSearchTerm,
    searchAllModes,
    showSearch,
    selectedItem,
    handleClearSearch,
    selectedMode,
    handleModeChange,
    resetAll,
    menuItems,
    kanbanType,
    handleSearchAllModesChange,
}: TSearchKanbanInputProps<T>) => {
    const route = useNavigate()

    const handleRedirectToSearchPage = () => {
        let url = ''
        if (kanbanType === 'cash-check-voucher') {
            url =
                '/org/$orgname/branch/$branchname/accounting/cash-check-journal-voucher'
        } else if (kanbanType === 'loan') {
            url = '/org/$orgname/branch/$branchname/loan/loans'
        } else {
            url = '/org/$orgname/branch/$branchname/accounting/journal-voucher'
        }
        route({
            to: url,
        })
    }

    return (
        <div className="flex w-full border-b p-4">
            <div
                className={cn('relative flex-1', showSearch ? 'min-w-md' : '')}
            >
                {showSearch && (
                    <div className="relative">
                        <Input
                            className="relative pr-11 pl-10"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={
                                searchAllModes
                                    ? 'Search across all voucher types...'
                                    : `Search ${selectedItem?.name.toLowerCase()} vouchers...`
                            }
                            value={searchTerm}
                        />
                        {searchTerm && (
                            <Badge
                                className={cn(
                                    'shrink-1 absolute right-10 top-1/2 -translate-y-1/2 text-xs py-0',
                                    searchAllModes &&
                                        'bg-primary/9 !h-fit text-primary border-primary/20'
                                )}
                                variant="secondary"
                            >
                                {searchAllModes
                                    ? 'Searching All Modes'
                                    : `Searching in ${selectedItem?.name}`}
                            </Badge>
                        )}
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        {searchTerm && (
                            <Button
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                                onClick={handleClearSearch}
                                size="sm"
                                variant="ghost"
                            >
                                <XIcon className="h-4 w-3" />
                            </Button>
                        )}
                    </div>
                )}
                <div className="flex items-center">
                    <div className="inline-flex items-center space-x-1 py-2">
                        <SearchIcon className=" size-4 text-primary" />
                        <Label
                            className={cn(
                                'flex items-center cursor-pointer transition-colors',
                                searchAllModes && 'text-primary font-medium'
                            )}
                            htmlFor="search-all-modes"
                            onClick={() =>
                                handleSearchAllModesChange(!searchAllModes)
                            }
                        >
                            <span className="mr-1">Search All Modes</span>
                            {showSearch && (
                                <span className="text-xs mt-1 text-muted-foreground/70">
                                    (Search across all voucher types )
                                </span>
                            )}
                        </Label>
                        <Kbd>Enter</Kbd>
                        <Badge
                            className="text-primary border-primary/20 cursor-pointer hover:bg-primary/5 flex items-center gap-1 text-xs py-0"
                            onClick={() => handleRedirectToSearchPage()}
                            variant={'outline'}
                        >
                            visit
                            <LinkIcon />
                        </Badge>
                    </div>
                </div>
            </div>
            <div className="flex pl-2 flex-col space-y-2 items-end-safe ">
                <div className="flex-2 flex items-center justify-end w-full gap-6">
                    <Label className="text-sm font-medium text-muted-foreground">
                        {selectedMode ? 'Selected Mode:' : 'Filter by Mode:'}
                        {!selectedMode && !searchAllModes && (
                            <span className="text-xs ml-2 text-muted-foreground/70">
                                (Click to filter and search)
                            </span>
                        )}
                    </Label>
                    <div></div>
                    <div className="flex gap-4">
                        {menuItems.map((item) => (
                            <div
                                className="flex items-center space-x-2"
                                key={String(item.value)}
                            >
                                <Checkbox
                                    checked={selectedMode === item.value}
                                    disabled={searchAllModes}
                                    id={`mode-${String(item.value)}`}
                                    onCheckedChange={() =>
                                        handleModeChange(item.value)
                                    }
                                />
                                <Label
                                    className={cn(
                                        'flex items-center cursor-pointer transition-colors',
                                        selectedMode === item.value &&
                                            'text-primary font-medium',
                                        searchAllModes &&
                                            'opacity-50 cursor-not-allowed'
                                    )}
                                    htmlFor={`mode-${String(item.value)}`}
                                >
                                    {item.icon}
                                    {item.name}
                                </Label>
                            </div>
                        ))}
                    </div>

                    {/*   Updated to use resetAll */}
                    {(selectedMode || searchAllModes) && (
                        <Button
                            className="text-xs h-7"
                            onClick={resetAll}
                            size="sm"
                            variant="outline"
                        >
                            Reset All
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
