import OrganizationSkeleton from '@/modules/organization/components/organization-item-skeleton'

import { BranchIcon } from '@/components/icons'

import { useBranchesContext } from '../context/branches-context'
import { BranchesGrid } from './branches-grid'
import { EmptyBranchesState } from './empty-branches-state'

interface BranchesSectionProps {
    onCreateBranch: () => void
    isPending: boolean
}

export const BranchesSection = ({
    onCreateBranch,
    isPending,
}: BranchesSectionProps) => {
    const { branches, isSeeding } = useBranchesContext()
    if (isPending) {
        return <OrganizationSkeleton className="p-10" count={5} />
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
            <BranchesGrid />
        </div>
    )
}
