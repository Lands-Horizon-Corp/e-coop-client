import { useState } from 'react'

import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

import { IBranch } from '@/modules/branch'
import { IOrganizationWithPolicies } from '@/modules/organization'
import { useJoinOrganization } from '@/modules/user-organization'

import { useModalState } from '@/hooks/use-modal-state'

import BranchItem from '../components/branch-item'
import { PolicyAcceptanceModal } from '../components/policy-acceptance-modal'

type BranchesProps = {
    branch: IBranch
    isUserCanJoin: boolean
    organization: IOrganizationWithPolicies
}

const Branch = ({ branch, organization, isUserCanJoin }: BranchesProps) => {
    const navigate = useNavigate()
    const [selectedBranch, setSelectedBranch] = useState<IBranch | null>(null)
    const { open, onOpenChange } = useModalState()

    const { mutate: JoinOrganization } = useJoinOrganization({
        onSuccess: () => {
            toast.success('You have successfully joined the organization')
            navigate({ to: `/onboarding` as string })
        },
        onError: () => {
            toast.error('Failed to join organization. Please try again.')
        },
    })

    const handleJoinClick = (branch: IBranch) => {
        if (!organization?.id) {
            toast.error('Missing Organization Id. Cannot proceed.')
            return
        }
        setSelectedBranch(branch)
        onOpenChange(true)
    }

    const handleAcceptAndProceed = () => {
        if (selectedBranch) {
            JoinOrganization({
                organizationId: organization.id,
                branchId: selectedBranch.id,
            })
            onOpenChange(false)
        }
    }

    return (
        <>
            <PolicyAcceptanceModal
                branchName={selectedBranch?.name ?? ''}
                onAccept={handleAcceptAndProceed}
                onCancel={() => onOpenChange(false)}
                onOpenChange={onOpenChange}
                open={open}
                organization={organization}
            />
            <BranchItem
                branch={branch}
                isUserCanJoin={isUserCanJoin}
                key={branch.id}
                onJoinClick={handleJoinClick}
            />
        </>
    )
}

export default Branch
