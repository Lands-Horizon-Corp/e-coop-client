import { useNavigate } from '@tanstack/react-router'

import { toReadableDateShort } from '@/helpers/date-utils'
import { IUserBase } from '@/modules/user'
import { IOrgUserOrganizationGroup } from '@/modules/user-organization'
import useSelectedOrganizationStore from '@/store/selected-organization.store'

import CopyTextButton from '@/components/copy-text-button'
import { EyeIcon, PencilFillIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import TruncatedText from '@/components/ui/truncated-text'

import { TEntityId } from '@/types'

interface OrganizationListProps {
    organization: IOrgUserOrganizationGroup[]
    user: IUserBase
    openOrgModal: (id: TEntityId) => void
    visitOrgBranch: (org: IOrgUserOrganizationGroup) => void
}
const OrganizationList = ({
    organization,
    user,
    openOrgModal,
    visitOrgBranch,
}: OrganizationListProps) => {
    const navigate = useNavigate()

    const sortedOrgFromLatest = [...organization].sort(
        (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    const { setSelectedOrg } = useSelectedOrganizationStore()

    return (
        <div className="w-full flex flex-wrap justify-center gap-5 gap-y-5 mt-10">
            {sortedOrgFromLatest.map((user_organization) => {
                const mediaUrl = user_organization.media?.download_url
                const coverUrl = user_organization.cover_media?.download_url
                const isUserOwner =
                    user_organization.user_organizations[0]?.user_type ===
                    'owner'
                const isOrgCreator = user_organization.created_by_id === user.id
                return (
                    <Card
                        className="relative bg-sidebar/90 duration-300 min-w-xs max-w-xs min-h-60 rounded-3xl hover:bg-background dark:hover:bg-background/50"
                        key={user_organization.id}
                    >
                        <ImageDisplay
                            className="h-full w-auto rounded-3xl -z-10  absolute inset-0"
                            src={coverUrl ?? ''}
                        />
                        <CardHeader>
                            <div className="flex items-center ">
                                <ImageDisplay
                                    className="size-12"
                                    src={mediaUrl ?? ''}
                                />
                                <Badge className="h-8 ml-4" variant={'outline'}>
                                    {toReadableDateShort(
                                        user_organization.created_at
                                    )}
                                </Badge>
                            </div>
                            <CardTitle className="truncate min-w-0 text-xl">
                                <Tooltip delayDuration={800}>
                                    <TooltipTrigger asChild>
                                        <CopyTextButton
                                            textContent={user_organization.id}
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-secondary text-primary">
                                        Copy Organization ID
                                    </TooltipContent>
                                </Tooltip>
                                {user_organization.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="min-h-18 max-h-18 relative">
                            {!user_organization.description && (
                                <p className="text-muted-foreground text-xs absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2">
                                    No Description Available
                                </p>
                            )}
                            <TruncatedText
                                className="text-xs max-h-16 text-card-foreground ecoop-scroll overflow-auto"
                                maxLength={100}
                                text={user_organization.description ?? ''}
                            />
                        </CardContent>
                        <CardFooter className="flex justify-end space-x-1">
                            {(isUserOwner || isOrgCreator) && (
                                <div className="flex justify-start gap-x-2">
                                    <Button
                                        className="rounded-full"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            navigate({
                                                to: `/onboarding/create-branch/${user_organization.id}` as string,
                                            })
                                            setSelectedOrg(user_organization)
                                        }}
                                        size="icon"
                                        variant={'secondary'}
                                    >
                                        <PencilFillIcon className=" h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                            <Button
                                className="rounded-full font-thin cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    openOrgModal(user_organization.id)
                                }}
                                size={'icon'}
                                variant={'secondary'}
                            >
                                <EyeIcon className="h-4 w-4" />
                            </Button>

                            <Button
                                className=" cursor-pointer"
                                onClick={() => {
                                    visitOrgBranch(user_organization)
                                }}
                                size={'sm'}
                            >
                                visit
                            </Button>
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
    )
}

export default OrganizationList
