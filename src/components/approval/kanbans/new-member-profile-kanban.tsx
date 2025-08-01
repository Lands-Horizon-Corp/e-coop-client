import { useQueryClient } from '@tanstack/react-query'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'
import { toReadableDate } from '@/utils'

import {
    BadgeCheckFillIcon,
    CheckIcon,
    EyeIcon,
    UserListIcon,
    XIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { MemberOverallInfoModal } from '@/components/member-infos/view-member-info'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import {
    useAllPendingMemberProfiles,
    useApproveMemberProfile,
    useDeclineMemberProfile,
} from '@/hooks/api-hooks/member/use-member-profile'
import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import { IClassProps, IMemberProfile } from '@/types'

import KanbanContainer from '../kanban/kanban-container'
import KanbanItemsContainer from '../kanban/kanban-items-container'
import KanbanTitle from '../kanban/kanban-title'

interface Props extends IClassProps {}

const NewMemberProfileKanban = (_props: Props) => {
    const queryClient = useQueryClient()
    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()
    const { data, isRefetching, refetch } = useAllPendingMemberProfiles()

    useSubscribe(`member_profile.update.branch.${branch_id}`, () => {
        queryClient.invalidateQueries({
            queryKey: ['member-profile', 'all', 'pending'],
        })
        queryClient.invalidateQueries({
            queryKey: ['member-profile', 'resource-query'],
        })
    })

    return (
        <KanbanContainer className="w-[360px]">
            <div className="flex items-center">
                <UserListIcon className="mr-2 size-4" />
                <KanbanTitle
                    totalItems={data.length}
                    title="New Member Profile Approvals"
                    isLoading={isRefetching}
                    onRefresh={() => refetch()}
                />
            </div>
            <Separator />
            <KanbanItemsContainer>
                {data.map((member) => (
                    <MemberProfileCard member={member} key={member.id} />
                ))}
                {data.length === 0 && (
                    <p className="text-center text-xs text-muted-foreground/60">
                        no pending request
                    </p>
                )}
            </KanbanItemsContainer>
        </KanbanContainer>
    )
}

const MemberProfileCard = ({ member }: { member: IMemberProfile }) => {
    const viewMemberModal = useModalState()
    const { onOpen } = useConfirmModalStore()
    const { mutate: approve, isPending: isApproving } =
        useApproveMemberProfile()

    const { mutate: decline, isPending: isDeclining } =
        useDeclineMemberProfile()

    return (
        <div className="relative space-y-2 rounded-xl bg-popover p-4 text-sm">
            <MemberOverallInfoModal
                overallInfoProps={{
                    memberProfileId: member.id,
                    defaultMemberProfile: member,
                }}
                {...viewMemberModal}
            />
            <div className="flex items-center gap-x-2">
                <ImageDisplay
                    className="size-8"
                    src={member?.media?.download_url}
                />
                <div className="w-full">
                    <div className="flex justify-between gap-x-2">
                        <p className="truncate">{member?.full_name ?? '-'}</p>
                        <div className="flex items-center gap-x-2">
                            <p className="text-xs text-muted-foreground">
                                {member?.member_type?.name ?? 'unknown type'}
                            </p>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="size-fit p-1"
                                disabled={isDeclining || isApproving}
                                onClick={() =>
                                    viewMemberModal.onOpenChange(true)
                                }
                            >
                                <EyeIcon />
                            </Button>
                        </div>
                    </div>
                    <p className="relative max-w-[90%] truncate text-xs text-muted-foreground/70">
                        {member?.user?.email ?? '-'}
                        {!member?.user?.is_email_verified && (
                            <BadgeCheckFillIcon className="ml-1 inline text-primary" />
                        )}
                    </p>
                </div>
            </div>
            <fieldset
                disabled={isApproving || isDeclining}
                className="flex items-center justify-end gap-x-1"
            >
                <Button
                    variant="secondary"
                    className="size-fit px-2 py-1"
                    onClick={() =>
                        onOpen({
                            title: 'Decline Member Profile',
                            description:
                                'Are you sure to decline this member profile?',
                            confirmString: 'Decline',
                            onConfirm: () => decline(member.id),
                        })
                    }
                >
                    {isDeclining ? (
                        <LoadingSpinner className="size-3" />
                    ) : (
                        <XIcon className="size-5" />
                    )}
                </Button>
                <Button
                    className="size-fit px-2 py-1"
                    onClick={() =>
                        onOpen({
                            title: 'Approve Member Profile',
                            description:
                                'Are you sure to approve this member profile?',
                            confirmString: 'Approve',
                            onConfirm: () => approve(member.id),
                        })
                    }
                >
                    {isApproving ? (
                        <LoadingSpinner className="size-3" />
                    ) : (
                        <CheckIcon className="size-5" />
                    )}
                </Button>
            </fieldset>
            <p className="absolute bottom-3 left-3 text-xs text-muted-foreground/40">
                Created {toReadableDate(member.created_at, 'MMM d yyyy')}
            </p>
        </div>
    )
}

export default NewMemberProfileKanban
