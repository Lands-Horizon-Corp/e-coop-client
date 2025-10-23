import { IBranch } from '@/modules/branch'

import { BranchIcon } from '@/components/icons'

import { TEntityId } from '@/types'

import { BranchesGrid } from './branches-grid'
import { EmptyBranchesState } from './empty-branches-state'

interface BranchesSectionProps {
    branches: IBranch[] | undefined
    isPending: boolean
    isSeeding: boolean
    organizationId: TEntityId
    onCreateBranch: () => void
    showActions?: boolean
}

export const BranchesSection = ({
    branches,
    isPending,
    isSeeding,
    organizationId,
    onCreateBranch,
    showActions = true,
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
        <div className="space-y-4 px-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BranchIcon className="text-primary" />
                    <h2 className="text-lg font-semibold">
                        Branches ({branches.length})
                    </h2>
                </div>
            </div>
            <BranchesGrid
                branches={branches}
                isSeeding={isSeeding}
                organizationId={organizationId}
                showActions={showActions}
            />
        </div>
    )
}
