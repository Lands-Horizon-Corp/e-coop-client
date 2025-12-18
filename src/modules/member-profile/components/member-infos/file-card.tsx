import { toast } from 'sonner'

import { cn } from '@/helpers'
import { toReadableDateTime } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import {
    TDownloadMediaProp,
    downloadMedia,
    formatBytes,
    getFileCategory,
    getFileInfo,
} from '@/modules/media'
import MediaResourceFileIcon from '@/modules/media/components/media-resource-file-icon'
import { FileItemProps } from '@/modules/media/components/media-uploader'
import {
    IMemberProfileMedia,
    useDeleteMemberProfileMediaById,
} from '@/modules/member-profile-media'
import { UpdateMemberProfileMediaFormModal } from '@/modules/member-profile-media/components/form/update-member-profile-media-form'

import {
    CalendarIcon,
    DownloadIcon,
    HardDriveIcon,
    PencilFillIcon,
    TrashIcon,
    UserIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import ActionTooltip from '@/components/tooltips/action-tooltip'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button } from '@/components/ui/button'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { useModalState } from '@/hooks/use-modal-state'

interface FileCardProps extends FileItemProps {
    memberMedia: IMemberProfileMedia
    viewMode: 'grid' | 'list'
    index: number
}

export const FileCard = ({ memberMedia, viewMode, index }: FileCardProps) => {
    const editModal = useModalState()
    const deleteMutation = useDeleteMemberProfileMediaById()

    const media = memberMedia.media
    const { fullFileName, fileType } = media
        ? getFileInfo(media)
        : { fullFileName: '', fileType: '' }

    const category = media ? getFileCategory(fullFileName, fileType) : 'unknown'
    const isImage = category === 'image'

    const handleDelete = () => {
        toast.promise(deleteMutation.mutateAsync(memberMedia.id), {
            loading: 'Deleting file...',
            success: 'File deleted successfully',
            error: (e) =>
                serverRequestErrExtractor({ error: e }) ||
                'Failed to delete file',
        })
    }

    const handleDownload = () => {
        if (media?.download_url) {
            downloadMedia(media as TDownloadMediaProp)
        }
    }

    return (
        <>
            <UpdateMemberProfileMediaFormModal
                {...editModal}
                formProps={{ defaultValues: memberMedia }}
            />

            {viewMode === 'list' ? (
                <div
                    className="group flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card hover:bg-accent/10 hover:border-primary/70 transition-all duration-200 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
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

                    <div className="flex-1 min-w-0">
                        <p className="truncate font-medium">
                            {memberMedia.name}
                        </p>
                        {memberMedia.created_by && (
                            <p className="text-xs text-muted-foreground">
                                Uploaded by :{' '}
                                {memberMedia.created_by.full_name ?? 'Unknown'}
                            </p>
                        )}
                    </div>

                    <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <HardDriveIcon className="size-3.5" />
                            {formatBytes(media?.file_size ?? 0)}
                        </span>
                        <span className="flex items-center gap-1">
                            <CalendarIcon className="size-3.5" />
                            {toReadableDateTime(memberMedia.created_at)}
                        </span>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                        <ActionTooltip side="bottom" tooltipContent="Edit File">
                            <Button
                                className="size-fit rounded-md p-1 hover:text-destructive-foreground"
                                onClick={() => editModal.onOpenChange(true)}
                                size="icon"
                                variant="secondary"
                            >
                                <PencilFillIcon className="size-4 cursor-pointer" />
                            </Button>
                        </ActionTooltip>
                        <ActionTooltip
                            side="bottom"
                            tooltipContent="Delete file"
                        >
                            <Button
                                className="size-fit rounded-md p-1 hover:text-destructive-foreground"
                                hoverVariant="destructive"
                                onClick={handleDelete}
                                size="icon"
                                variant="secondary"
                            >
                                <TrashIcon className="size-4 cursor-pointer" />
                            </Button>
                        </ActionTooltip>
                    </div>
                </div>
            ) : (
                <div
                    className="group relative flex flex-col rounded-xl border border-border/50 bg-card overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 75}ms` }}
                >
                    <div
                        className={cn(
                            'relative h-32 flex items-center justify-center'
                        )}
                    >
                        {media && isImage ? (
                            <PreviewMediaWrapper media={media}>
                                <ImageDisplay
                                    className="h-full w-full rounded-none object-cover"
                                    src={media.download_url}
                                />
                            </PreviewMediaWrapper>
                        ) : media ? (
                            <MediaResourceFileIcon
                                iconClassName="size-24"
                                media={media}
                            />
                        ) : null}

                        <div className="absolute inset-0 bg-background/80 rounded-t-xl backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            {media?.download_url && (
                                <Button
                                    className="cursor-pointer"
                                    onClick={handleDownload}
                                    size="sm"
                                    variant="secondary"
                                >
                                    <DownloadIcon className="size-4 mr-1" />{' '}
                                    Download
                                </Button>
                            )}
                            <Button
                                className="cursor-pointer"
                                onClick={() => editModal.onOpenChange(true)}
                                size="sm"
                                variant="secondary"
                            >
                                <PencilFillIcon className="size-4 mr-1" /> Edit
                            </Button>
                        </div>
                    </div>

                    <div className="p-4 space-y-3">
                        <div>
                            <p className="truncate font-medium">
                                {memberMedia.name}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <HardDriveIcon className="h-3 w-3" />
                                {formatBytes(media?.file_size || 0)}
                            </span>
                            <span className="flex items-center gap-1">
                                <CalendarIcon className="h-3 w-3" />
                                {toReadableDateTime(memberMedia.created_at)}
                            </span>
                        </div>

                        {memberMedia.created_by && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <UserIcon className="h-3 w-3" />
                                {memberMedia.created_by.full_name ?? 'Unknown'}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
