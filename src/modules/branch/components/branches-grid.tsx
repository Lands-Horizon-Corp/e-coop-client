import { IBranch } from '@/modules/branch'

import { TEntityId } from '@/types'

import { BranchCard } from './branch-card'

interface BranchesGridProps {
    branches: IBranch[]
    organizationId: TEntityId
    isSeeding: boolean
}

export const BranchesGrid = ({
    branches,
    organizationId,
    isSeeding,
}: BranchesGridProps) => {
    return (
        <div className="grid w-fit grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-1">
            {branches.map((branch) => (
                <BranchCard
                    branch={branch}
                    isSeeding={isSeeding}
                    key={branch.id}
                    organizationId={organizationId}
                />
            ))}
        </div>
    )
}
