import { toReadableDateTime } from '@/helpers/date-utils'
import {
    TDownloadMediaProp,
    downloadMedia,
    formatBytes,
    getFileCategory,
    getFileInfo,
} from '@/modules/media'
import MediaResourceFileIcon from '@/modules/media/components/media-resource-file-icon'

import {
    CalendarIcon,
    DownloadIcon,
    HardDriveIcon,
    TrashIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import ActionTooltip from '@/components/tooltips/action-tooltip'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button } from '@/components/ui/button'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { IMemberProfileArchive } from '../member-profile-archive.types'

interface MemberArchiveItemProps {
    memberArchive: IMemberProfileArchive
    uploadedBy?: string
    onRemove?: () => void
    otherAction?: React.ReactNode
}

const MemberArchiveItem = ({
    memberArchive,
    uploadedBy,
    onRemove,
    otherAction,
}: MemberArchiveItemProps) => {
    const media = memberArchive.media

    const { fullFileName, fileType } = media
        ? getFileInfo(media)
        : { fullFileName: '', fileType: '' }

    const category = media ? getFileCategory(fullFileName, fileType) : 'unknown'
    const isImage = category === 'image'

    const handleDownload = () => {
        if (media?.download_url) {
            downloadMedia(media as TDownloadMediaProp)
        }
    }

    const createdDate = media?.created_at || memberArchive.created_at

    return (
        <div
            className="space-y-2 min-w-0 max-w-full rounded-lg border border-secondary hover:border-primary/60 duration-200 ease-in-out bg-popover p-3"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex items-center gap-x-3">
                <div className="size-12 items-center flex justify-center flex-shrink-0">
                    {media && isImage ? (
                        <AspectRatio ratio={1 / 1}>
                            <PreviewMediaWrapper media={media}>
                                <ImageDisplay
                                    className="size-full rounded-xl object-cover"
                                    src={media.download_url}
                                />
                            </PreviewMediaWrapper>
                        </AspectRatio>
                    ) : media ? (
                        <MediaResourceFileIcon
                            iconClassName="size-24"
                            media={media}
                        />
                    ) : null}
                </div>

                <div className="flex-1 space-y-1 min-w-0">
                    <p className="truncate font-medium">{media?.file_name}</p>
                    <p className="truncate text-muted-foreground text-xs">
                        {memberArchive?.description || 'No description'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Uploaded by : {uploadedBy ?? 'Unknown'}
                    </p>
                </div>

                <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <HardDriveIcon className="size-3.5" />
                        {formatBytes(media?.file_size ?? 0)}
                    </span>
                    <span className="flex items-center gap-1">
                        <CalendarIcon className="size-3.5" />
                        {createdDate ? toReadableDateTime(createdDate) : '-'}
                    </span>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                    {media?.download_url && (
                        <ActionTooltip
                            side="bottom"
                            tooltipContent="Download file"
                        >
                            <Button
                                className="size-fit rounded-md p-1"
                                onClick={handleDownload}
                                size="icon"
                                type="button"
                                variant="secondary"
                            >
                                <DownloadIcon className="size-4 cursor-pointer" />
                            </Button>
                        </ActionTooltip>
                    )}
                    {onRemove && (
                        <ActionTooltip
                            side="bottom"
                            tooltipContent="Delete file"
                        >
                            <Button
                                className="size-fit rounded-md p-1 hover:text-destructive-foreground"
                                hoverVariant="destructive"
                                onClick={onRemove}
                                size="icon"
                                variant="secondary"
                            >
                                <TrashIcon className="size-4 cursor-pointer" />
                            </Button>
                        </ActionTooltip>
                    )}
                    {otherAction}
                </div>
            </div>
        </div>
    )
}

export default MemberArchiveItem
export { type MemberArchiveItemProps }
