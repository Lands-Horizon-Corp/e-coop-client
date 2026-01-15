import { dateAgo, toReadableDate } from '@/helpers/date-utils'
import {
    TDownloadMediaProp,
    downloadMedia,
    formatBytes,
    getFileCategory,
    getFileInfo,
} from '@/modules/media'
import MediaResourceFileIcon from '@/modules/media/components/media-resource-file-icon'

import { highlightMatch } from '@/components/hightlight-match'
import { DownloadIcon, TrashIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import ActionTooltip from '@/components/tooltips/action-tooltip'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button } from '@/components/ui/button'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { IOrganizationMedia } from '../organization-media.types'

interface OrganizationMediaItemProps {
    organizationMedia: IOrganizationMedia
    uploadedBy?: string
    onRemove?: () => void
    otherAction?: React.ReactNode
    searchTerm?: string
}

const OrganizationMediaItem = ({
    organizationMedia,
    uploadedBy,
    onRemove,
    otherAction,
    searchTerm,
}: OrganizationMediaItemProps) => {
    const media = organizationMedia.media

    // Get file info to determine category
    const { fullFileName, fileType } = media
        ? getFileInfo(media)
        : { fullFileName: '', fileType: '' }

    const category = media ? getFileCategory(fullFileName, fileType) : 'unknown'
    const isImage = category === 'image'

    // Handle download
    const handleDownload = () => {
        if (media?.download_url) {
            downloadMedia(media as TDownloadMediaProp)
        }
    }

    // Get created date
    const createdDate = media?.created_at || organizationMedia.created_at

    return (
        <div
            className="space-y-2 min-w-0 max-w-full rounded-lg border border-secondary bg-popover p-3"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex space-x-3">
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
                <div className="flex-1 space-y-1 min-w-0 overflow-hidden">
                    <p className="truncate text-sm font-semibold">
                        {searchTerm
                            ? highlightMatch(organizationMedia.name, searchTerm)
                            : organizationMedia.name}
                    </p>
                    {media && (
                        <p className="text-xs text-muted-foreground">
                            {formatBytes(media.file_size ?? 1)}
                            {createdDate && (
                                <span className="text-xs text-muted-foreground cursor-default">
                                    {' '}
                                    •{' '}
                                    {toReadableDate(
                                        createdDate,
                                        'MMM d, yyyy'
                                    )}{' '}
                                    • {dateAgo(createdDate)}
                                </span>
                            )}
                        </p>
                    )}
                    {organizationMedia.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                            {organizationMedia.description}
                        </p>
                    )}
                    {uploadedBy && (
                        <p className="text-xs text-muted-foreground">
                            Uploaded by : {uploadedBy}
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                    {/* Download Button */}
                    {media?.download_url && (
                        <ActionTooltip
                            side="left"
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
                    {/* Delete Button */}
                    {onRemove && (
                        <ActionTooltip side="left" tooltipContent="Delete file">
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

export default OrganizationMediaItem
export { type OrganizationMediaItemProps }
