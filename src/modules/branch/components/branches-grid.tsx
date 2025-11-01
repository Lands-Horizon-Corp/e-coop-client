import { useState } from 'react'

import { IBranch } from '@/modules/branch'

import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

import { BranchCard } from './branch-card'
import BranchModalDisplay from './modal/branch-modal-display'

interface BranchesGridProps {
    branches: IBranch[]
    organizationId: TEntityId
    isSeeding: boolean
    showActions?: boolean
}

export const BranchesGrid = ({
    branches,
    organizationId,
    isSeeding,
    showActions = true,
}: BranchesGridProps) => {
    const branchModal = useModalState()
    const [selectedBranch, setSelectedBranch] = useState<IBranch | null>(null)

    return (
        <div className="grid w-fit grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 p-1">
            <BranchModalDisplay
                {...branchModal}
                branch={selectedBranch}
                isLoading={false}
                showActions={false}
            />
            {branches.map((branch) => (
                <BranchCard
                    branch={branch}
                    className=""
                    isSeeding={isSeeding}
                    key={branch.id}
                    onClick={(branch) => {
                        setSelectedBranch(branch)
                        branchModal.onOpenChange(true)
                    }}
                    organizationId={organizationId}
                    showActions={showActions}
                />
            ))}
        </div>
    )
}
