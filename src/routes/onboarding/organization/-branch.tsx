import { useState } from 'react'
import { toast } from 'sonner'

import { orgBannerList } from '@/assets/pre-organization-banner-background'
import { useNavigate } from '@tanstack/react-router'

import { GradientBackground } from '@/components/gradient-background/gradient-background'
import ImageDisplay from '@/components/image-display'
import Modal, { IModalProps } from '@/components/modals/modal'
import PlainTextEditor from '@/components/plain-text-editor'
import OrganizationPolicies from '@/components/policies'
import { Button } from '@/components/ui/button'

import { useJoinOrganization } from '@/hooks/api-hooks/use-user-organization'

import { IBranch, IOrganizationWithPolicies, TEntityId } from '@/types'

type PolicyAcceptanceModalProps = IModalProps & {
    onAcceptAndProceed: (branchId: TEntityId, organizationId: TEntityId) => void
    onCancel: () => void
    organization: IOrganizationWithPolicies
    branch: IBranch
    branchId: TEntityId
    organizationId: TEntityId
}

const PolicyAcceptanceModal = ({
    onAcceptAndProceed,
    branch,
    onCancel,
    organization,
    branchId,
    organizationId,
    ...rest
}: PolicyAcceptanceModalProps) => {
    const [isAllChecked, setIsAllChecked] = useState(false)
    const handleProceed = () => {
        if (!isAllChecked) {
            toast.error('Please accept all policies before proceeding.')
            return
        }
        onAcceptAndProceed(branchId, organizationId)
    }

    return (
        <Modal
            title={`Join Branch ${branch.name}`}
            description={
                <>
                    <span>
                        You are about to join this branch{' '}
                        <span className="font-semibold italic text-pretty">
                            {branch.name}
                        </span>
                        , are you sure you want to proceed?
                    </span>
                </>
            }
            {...rest}
            className="max-w-2xl"
        >
            <div>
                <p className=" text-xs text-muted-foreground mb-4">
                    To proceed, please read and accept the following policies:
                </p>
                <OrganizationPolicies
                    organization={organization}
                    onPolicyChange={(isAllChecked) => {
                        setIsAllChecked(isAllChecked)
                    }}
                    isIncludeIAccept
                />
                <div className="flex justify-end col-span-2 gap-x-2 mt-6">
                    <Button
                        size={'sm'}
                        onClick={() => onCancel()}
                        variant={'ghost'}
                    >
                        Cancel
                    </Button>
                    <Button
                        size={'sm'}
                        disabled={!isAllChecked}
                        onClick={handleProceed}
                    >
                        Join
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

type BranchProps = {
    branch: IBranch
    organizationId: TEntityId
    isUserCanJoin: boolean
}

const Branch = ({ branch, organizationId, isUserCanJoin }: BranchProps) => {
    const navigate = useNavigate()
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false)

    const { mutate: JoinOrganization } = useJoinOrganization({
        onSuccess: () => {
            toast.success('You have successfully joined the organization')
            navigate({ to: `/onboarding` })
        },
        onError: () => {
            toast.error('Failed to join organization. Please try again.')
        },
    })

    const handleJoinClick = () => {
        if (!organizationId) {
            toast.error('Missing Organization Id. Cannot proceed.')
            return
        }
        setIsPolicyModalOpen(true)
    }

    const handleAcceptAndProceed = (branchId: TEntityId, orgId: TEntityId) => {
        JoinOrganization({ organizationId: orgId, branchId: branchId })
        setIsPolicyModalOpen(false)
    }

    const mediaUrl = branch?.media?.url ?? orgBannerList[0]

    return (
        <div className="flex max-h-96 flex-col gap-y-2 overflow-y-auto">
            <PolicyAcceptanceModal
                open={isPolicyModalOpen}
                branch={branch}
                organization={branch?.organization as IOrganizationWithPolicies}
                branchId={branch.id}
                organizationId={organizationId}
                onCancel={() => setIsPolicyModalOpen(false)}
                onAcceptAndProceed={handleAcceptAndProceed}
                onOpenChange={setIsPolicyModalOpen}
            />

            <GradientBackground gradientOnly>
                <div
                    key={branch.id}
                    className="relative flex min-h-16 w-full cursor-pointer items-center gap-x-2 rounded-2xl border-0 p-4 hover:bg-secondary/50 hover:no-underline"
                >
                    <ImageDisplay
                        className="size-10 rounded-xl"
                        src={mediaUrl}
                    />
                    <div className="flex grow flex-col">
                        <h1>{branch?.name}</h1>
                        <PlainTextEditor
                            className="text-xs"
                            content={branch.description ?? ''}
                        />
                    </div>
                    <Button
                        disabled={!isUserCanJoin}
                        onClick={handleJoinClick}
                        size={'sm'}
                        variant={'secondary'}
                    >
                        {isUserCanJoin ? 'Join' : 'Joined'}
                    </Button>
                </div>
            </GradientBackground>
        </div>
    )
}

export default Branch
