import { IBranch } from '@/modules/branch'

import {
    BranchIcon,
    // PlusIcon
} from '@/components/icons'
// import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

import { TEntityId } from '@/types'

import { BranchesGrid } from './branches-grid'
import { EmptyBranchesState } from './empty-branches-state'

interface BranchesSectionProps {
    branches: IBranch[] | undefined
    isPending: boolean
    isSeeding: boolean
    organizationId: TEntityId
    onCreateBranch: () => void
}

export const BranchesSection = ({
    branches,
    isPending,
    isSeeding,
    organizationId,
    onCreateBranch,
}: BranchesSectionProps) => {
    if (isPending) {
        return <div>Loading branches...</div>
    }

    if (!branches || branches.length === 0) {
        return (
            <EmptyBranchesState
                isSeeding={isSeeding}
                onCreateBranch={onCreateBranch}
            />
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BranchIcon className="text-primary" />
                    <h2 className="text-lg font-semibold">
                        Branches ({branches.length})
                    </h2>
                </div>
            </div>
            <ScrollArea className="h-fit">
                <BranchesGrid
                    branches={branches}
                    isSeeding={isSeeding}
                    organizationId={organizationId}
                />
            </ScrollArea>
        </div>
    )
}
