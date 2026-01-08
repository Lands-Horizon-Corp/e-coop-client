import { useState } from 'react'

import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

import { useBranchesContext } from '../context/branches-context'
import { BranchCard } from './cards/branch-card'
import BranchModalDisplay from './modal/branch-modal-display'

export const BranchesGrid = () => {
    const {
        isSeeding,
        showActions,
        showJoinBranch,
        organizationId,
        userOrganizations,
    } = useBranchesContext()

    const branchModal = useModalState()
    const [selectedBranch, setSelectedBranch] = useState<TEntityId>()

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 p-1">
            {selectedBranch && (
                <BranchModalDisplay
                    {...branchModal}
                    branchId={selectedBranch}
                    isLoading={false}
                    showActions={false}
                />
            )}

            {userOrganizations?.map((userOrganization) => (
                <BranchCard
                    branch={userOrganization.branch}
                    isSeeding={isSeeding}
                    key={userOrganization.branch.id}
                    onClick={(branch) => {
                        setSelectedBranch(branch.id)
                        branchModal.onOpenChange(true)
                    }}
                    organizationId={organizationId}
                    showActions={showActions}
                    showJoinBranch={showJoinBranch}
                    userOrganization={userOrganization}
                />
            ))}
        </div>
    )
}
