import { GradientBackground } from '@/components/gradient-background/gradient-background'
import { useJoinOrganization } from '@/hooks/api-hooks/use-user-organization'
import PlainTextEditor from '@/components/plain-text-editor'

import { Button } from '@/components/ui/button'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { IBranch, TEntityId } from '@/types'

import { orgBannerList } from '@/assets/pre-organization-banner-background'

import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import ImageDisplay from '@/components/image-display'

type BranchProps = {
    branch: IBranch
    organizationId: TEntityId
    isUserCanJoin: boolean
}

const Branch = ({ branch, organizationId, isUserCanJoin }: BranchProps) => {
    const { onOpen } = useConfirmModalStore()
    const navigate = useNavigate()

    const { mutate: JoinOrganization } = useJoinOrganization({
        onSuccess: () => {
            toast.success('You have successfully joined the organization')
            navigate({ to: `/onboarding` })
        },
    })

    const handleJoin = (
        branchName: string,
        branchId: TEntityId,
        organizationId: TEntityId
    ) => {
        onOpen({
            title: 'Join Branch',
            description: `You are about join this branch ${branchName}, are you sure you want to proceed?`,
            onConfirm: () => {
                JoinOrganization({ organizationId, branchId })
            },
            confirmString: 'Proceed',
        })
    }

    const mediaUrl = branch?.media?.url ?? orgBannerList[0]

    return (
        <div className="flex max-h-96 flex-col gap-y-2 overflow-y-auto">
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
                        onClick={() => {
                            if (!organizationId) {
                                toast.error('Missing Organization Id')
                                return
                            }
                            handleJoin(branch.name, branch.id, organizationId)
                        }}
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
