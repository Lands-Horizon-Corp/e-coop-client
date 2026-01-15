import { cn } from '@/helpers'
import { IUserOrganization } from '@/modules/user-organization'
import { ArrowRightIcon } from 'lucide-react'

import {
    DotBigIcon,
    LoadingCircleIcon,
    PinLocationIcon,
} from '@/components/icons'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

type ListOfBranchesProps = {
    userOrg: IUserOrganization
    onClick: () => void
    isCurrent: boolean
    isLoading: boolean
    onSelect: (org: IUserOrganization) => void
}

const ListOfBranches = ({
    userOrg,
    onClick,
    isCurrent,
    isLoading,
    onSelect,
}: ListOfBranchesProps) => {
    const mediaUrl = userOrg.branch?.media?.download_url
    const isPending = userOrg.application_status === 'pending'
    return (
        <div key={userOrg.branch?.id ?? ''}>
            <div className="relative inline-flex min-h-16 w-full justify-between rounded-xl bg-sidebar cursor-pointer items-center gap-x-2 border-0 p-2 hover:bg-card/70 ">
                <div className="flex max-w-full min-w-0">
                    <div className="inline-flex space-x-2 truncate">
                        <div className="relative">
                            <Avatar className="relative size-12">
                                <AvatarImage src={mediaUrl} />
                            </Avatar>
                            <Button
                                className="absolute rounded-full size-6 cursor-pointer bottom-0 right-0 "
                                onClick={() => {
                                    onSelect?.(userOrg)
                                }}
                                size={'icon'}
                            >
                                <PinLocationIcon className="size-fit" />
                            </Button>{' '}
                        </div>
                        <div className="w-full items-center truncate min-w-0 max-w-full ">
                            <div className="flex items-center text-xs text-muted-foreground">
                                {userOrg.application_status}
                                <DotBigIcon
                                    className={cn(
                                        'inline ml-1',
                                        userOrg.application_status ===
                                            'accepted'
                                            ? 'text-green-400'
                                            : 'text-destructive'
                                    )}
                                />
                            </div>
                            <h1 className="truncate">{userOrg.branch?.name}</h1>
                            <div className="w-full">
                                <div className="flex items-center max-w-full gap-y-2 text-xs">
                                    <p className="truncate min-w-0 text-xs text-muted-foreground/80">
                                        {userOrg.branch?.address}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {!isPending && (
                    <div className="flex flex-col items-center ">
                        <span className="text-muted-foreground text-xs">
                            {' '}
                            as {userOrg.user_type}
                        </span>
                        <Button
                            disabled={
                                userOrg.application_status === 'pending' ||
                                isLoading
                            }
                            onClick={onClick}
                            size="sm"
                            variant={isCurrent ? 'default' : 'outline'}
                        >
                            {isLoading ? (
                                <>
                                    {isCurrent ? (
                                        <LoadingCircleIcon className=" animate-spin" />
                                    ) : (
                                        'Switching...'
                                    )}
                                </>
                            ) : isCurrent ? (
                                'Current'
                            ) : (
                                <>
                                    Switch <ArrowRightIcon />
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ListOfBranches
