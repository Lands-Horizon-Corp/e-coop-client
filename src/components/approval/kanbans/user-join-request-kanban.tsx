import { Button } from '@/components/ui/button'
import KanbanTitle from '../kanban/kanban-title'
import { Separator } from '@/components/ui/separator'
import ImageDisplay from '@/components/image-display'
import KanbanContainer from '../kanban/kanban-container'
import {
    XIcon,
    CheckIcon,
    UserListIcon,
    BadgeCheckFillIcon,
} from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import KanbanItemsContainer from '../kanban/kanban-items-container'

import {
    useUserOrgJoinRequests,
    useUserOrgAcceptJoinRequest,
    useUserOrgRejectJoinRequest,
} from '@/hooks/api-hooks/use-user-organization'
import { toReadableDate } from '@/utils'
import useConfirmModalStore from '@/store/confirm-modal-store'

import { IClassProps, IUserOrganization } from '@/types'
import { cn } from '@/lib'

interface Props extends IClassProps {}

const UserJoinRequestKanban = (_props: Props) => {
    const { data, isPending } = useUserOrgJoinRequests()

    return (
        <KanbanContainer className="w-[360px]">
            <div className="flex items-center">
                <UserListIcon className="mr-2 size-4" />
                <KanbanTitle
                    isLoading={isPending}
                    totalItems={data.length}
                    title="User Join Requests"
                />
            </div>
            <Separator />
            <KanbanItemsContainer>
                {data.map((userOrg) => (
                    <JoinRequestCard userOrg={userOrg} key={userOrg.id} />
                ))}
            </KanbanItemsContainer>
        </KanbanContainer>
    )
}

const JoinRequestCard = ({ userOrg }: { userOrg: IUserOrganization }) => {
    const { onOpen } = useConfirmModalStore()

    const { mutate: approve, isPending: isApproving } =
        useUserOrgAcceptJoinRequest()

    const { mutate: reject, isPending: isRejecting } =
        useUserOrgRejectJoinRequest()

    const isLoading = isApproving || isRejecting

    return (
        <div className="relative space-y-2 rounded-xl bg-popover p-4 text-sm">
            <div className="flex items-center gap-x-2">
                <ImageDisplay
                    className="size-8"
                    src={userOrg?.user?.media?.download_url}
                />
                <div className="w-full">
                    <div className="flex justify-between gap-x-2">
                        <p className="truncate">
                            {userOrg?.user?.full_name ?? '-'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Joining as{' '}
                            <span
                                className={cn(
                                    'rounded-full bg-secondary px-2 py-0.5 capitalize',
                                    userOrg.user_type === 'member' &&
                                        'bg-primary/20 text-primary',
                                    userOrg.user_type === 'employee' &&
                                        'bg-blue-400/20 text-blue-400'
                                )}
                            >
                                {userOrg?.user_type ?? 'unknown role'}
                            </span>
                        </p>
                    </div>
                    <p className="relative max-w-[90%] truncate text-xs text-muted-foreground/70">
                        {userOrg?.user?.email ?? '-'}
                        {!userOrg?.user?.is_email_verified && (
                            <BadgeCheckFillIcon className="ml-1 inline text-primary" />
                        )}
                    </p>
                </div>
            </div>
            <fieldset
                disabled={isLoading}
                className="flex items-center justify-end gap-x-1"
            >
                <Button
                    variant="secondary"
                    hoverVariant="destructive"
                    className="size-fit px-2 py-1"
                    onClick={() =>
                        onOpen({
                            title: 'Reject Join Request',
                            description:
                                "Are you sure to Reject this user's request to join?",
                            confirmString: 'Reject',
                            onConfirm: () => reject(userOrg.id),
                        })
                    }
                >
                    {isRejecting ? (
                        <LoadingSpinner className="size-3" />
                    ) : (
                        // 'Decline'
                        <XIcon className="size-5" />
                    )}
                </Button>
                <Button
                    className="size-fit px-2 py-1"
                    onClick={() =>
                        onOpen({
                            title: 'Approve Join Request',
                            description:
                                'Are you sure to approve this user to join the organization?',
                            confirmString: 'Approve',
                            onConfirm: () => approve(userOrg.id),
                        })
                    }
                >
                    {isApproving ? (
                        <LoadingSpinner className="size-3" />
                    ) : (
                        // 'Approve'
                        <CheckIcon className="size-5" />
                    )}
                </Button>
            </fieldset>
            <p className="absolute bottom-3 left-3 text-xs text-muted-foreground/40">
                Applied on {toReadableDate(userOrg.created_at, 'MMM d yyyy')}
            </p>
        </div>
    )
}

export default UserJoinRequestKanban
