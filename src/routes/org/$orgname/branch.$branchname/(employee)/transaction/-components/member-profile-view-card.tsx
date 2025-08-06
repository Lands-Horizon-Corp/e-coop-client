import { toast } from 'sonner'

import { useImagePreview } from '@/store/image-preview-store'

import CopyWrapper from '@/components/elements/copy-wrapper'
import HoveruserInfo from '@/components/elements/hover-elements/hover-user-info'
import ImageNameDisplay from '@/components/elements/image-name-display'
import { GradientBackground } from '@/components/gradient-background/gradient-background'
import {
    BadgeCheckIcon,
    IdCardIcon,
    PhoneIcon,
    SignatureLightIcon,
    UserIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import MemberOverallInfo, {
    MemberOverallInfoModal,
} from '@/components/member-infos/view-member-info'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Separator } from '@/components/ui/separator'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { useModalState } from '@/hooks/use-modal-state'

import { IMedia, IMemberProfile } from '@/types'

type MemberProfileTransactionViewProps = {
    memberInfo: IMemberProfile
}

const MemberProfileTransactionView = ({
    memberInfo,
}: MemberProfileTransactionViewProps) => {
    const infoModal = useModalState(false)
    const { onOpen } = useImagePreview()

    const handleMedia = (media: IMedia | undefined) => {
        if (media) {
            onOpen({
                Images: [media],
            })
        } else {
            toast.warning('No media available for preview.')
        }
    }

    const handleImageClick = (media: IMedia | undefined, type: string) => {
        if (type === 'profile') {
            handleMedia(media)
        }
        if (type === 'signature') {
            handleMedia(media)
        }
    }

    return (
        <>
            <MemberOverallInfoModal
                {...infoModal}
                overallInfoProps={{
                    memberProfileId: memberInfo.id,
                }}
            />
            <GradientBackground
                gradientOnly
                opacity={0}
                className="w-full ecoop-scroll overflow-x-auto  h-fit flex-col space-y-2 border-[0.5px] min-w-[300px] overscroll-contain bg-sidebar/20 p-5"
            >
                <div className="flex w-full  space-x-5 items-center h-fit ">
                    <div className="flex items-center h-fit gap-y-2 flex-col min-w-[6vw] max-w-[5vw]">
                        <PreviewMediaWrapper media={memberInfo.media}>
                            <ImageDisplay
                                className=" aspect-square size-fit rounded-xl duration-150 ease-in-out hover:scale-105"
                                src={memberInfo.media?.download_url}
                                onClick={() => {
                                    handleImageClick(
                                        memberInfo.media,
                                        'profile'
                                    )
                                }}
                                fallback={
                                    memberInfo.first_name.charAt(0) ?? '-'
                                }
                            />
                        </PreviewMediaWrapper>
                        <Drawer>
                            <DrawerTrigger asChild className="border">
                                <Button
                                    variant={'secondary'}
                                    size="sm"
                                    className="text-xs w-full min-w-24"
                                >
                                    View Profile
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent className="h-full w-full">
                                <MemberOverallInfo
                                    className="overflow-y-auto px-5"
                                    memberProfileId={memberInfo?.id}
                                />
                            </DrawerContent>
                        </Drawer>
                    </div>
                    <div className="space-y-3 h-full min-w-fit flex flex-col justify-start w-full">
                        <div className="flex items-center justify-between">
                            <div className="w-full flex items-center gap-x-2 justify-between">
                                <div className="flex w-fit items-center gap-x-2">
                                    <h2 className="truncate font-bold">
                                        {memberInfo.full_name}
                                    </h2>
                                    {memberInfo.status === 'verified' && (
                                        <BadgeCheckIcon className="text-primary" />
                                    )}
                                </div>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant={'ghost'}
                                            size="icon"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                handleImageClick(
                                                    memberInfo.signature_media,
                                                    'signature'
                                                )
                                            }}
                                        >
                                            <SignatureLightIcon size={25} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        View Signature
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            {memberInfo.user && (
                                <HoverCard>
                                    <HoverCardTrigger>
                                        <ImageNameDisplay
                                            src={
                                                memberInfo.user?.media
                                                    ?.download_url
                                            }
                                            name={memberInfo.user.first_name}
                                            className="rounded-full bg-card/80 p-1 text-sm"
                                            nameClassName="mr-2"
                                        />
                                    </HoverCardTrigger>
                                    <HoverCardContent className="border-0 bg-transparent p-0">
                                        <HoveruserInfo
                                            userId={memberInfo.user.id}
                                            defaultValue={memberInfo.user}
                                        />
                                    </HoverCardContent>
                                </HoverCard>
                            )}
                        </div>
                        <Separator />
                        <div className="flex  justify-between space-x-5 pr-5 pt-2 text-xs">
                            <div>
                                <h3 className="mb-1 font-medium text-muted-foreground">
                                    Contact Number
                                </h3>
                                <div className="flex items-center gap-2">
                                    <PhoneIcon className="400 size-3" />
                                    <span>
                                        <CopyWrapper>
                                            {memberInfo.contact_number}
                                        </CopyWrapper>
                                    </span>
                                </div>
                            </div>
                            <div>
                                <h3 className="mb-1 font-medium text-muted-foreground">
                                    Passbook Number
                                </h3>
                                <div className="flex items-center gap-2">
                                    <IdCardIcon className="size-3" />
                                    <span className="font-mono">
                                        <CopyWrapper>
                                            {memberInfo.passbook}
                                        </CopyWrapper>
                                    </span>
                                </div>
                            </div>
                            <div>
                                <h3 className="mb-1 font-medium text-muted-foreground">
                                    Member Type
                                </h3>
                                <div className="flex items-center gap-2">
                                    <UserIcon className="size-3" />
                                    <span>
                                        <CopyWrapper>
                                            {memberInfo.member_type?.name}
                                        </CopyWrapper>
                                    </span>
                                </div>
                            </div>
                            <div className="text-end">
                                <h3 className="mb-1 font-medium text-muted-foreground">
                                    Member Profile ID
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="truncate font-mono">
                                        <CopyWrapper>
                                            {memberInfo.id}
                                        </CopyWrapper>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </GradientBackground>
        </>
    )
}

export default MemberProfileTransactionView
