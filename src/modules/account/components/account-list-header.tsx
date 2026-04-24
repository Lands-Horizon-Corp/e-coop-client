import { ArrowUpDown, Plus } from 'lucide-react'

import RefreshButton from '@/components/buttons/refresh-button'
import SearchInput from '@/components/search/generic-search-input'
import { Button } from '@/components/ui/button'

import { useModalState } from '@/hooks/use-modal-state'

import { TModalState } from './account-list'

type AccountListHeader = {
    createModal: ReturnType<typeof useModalState>
    onRefresh: () => void
    isFetching: boolean
    setSearch: (value: string) => void
    filteredLength: number
    onRefetch: () => void
    modalState: TModalState
}

const AccountListHeader = ({
    createModal,
    isFetching,
    setSearch,
    onRefetch,
    filteredLength,
}: AccountListHeader) => {
    return (
        <>
            <div className="sticky top-0 z-40 bg-background pb-4 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-foreground">
                        Accounts
                    </h1>
                    <div>
                        <Button
                            className="gap-2 mr-1"
                            onClick={() => createModal.openModal()}
                        >
                            <Plus className="h-4 w-4" />
                            Create
                        </Button>
                        <RefreshButton
                            isLoading={isFetching}
                            onClick={onRefetch}
                        />
                    </div>
                </div>

                <SearchInput
                    className="max-w-full w-full"
                    inputClassName="border-1"
                    placeholder="Search accounts..."
                    setSearchTerm={setSearch}
                />

                {/* Sort indicator */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ArrowUpDown className="h-3.5 w-3.5" />
                    <span>Drag to reorder</span>
                    <span className="ml-auto">{filteredLength} accounts</span>
                </div>
            </div>
        </>
    )
}

export default AccountListHeader
