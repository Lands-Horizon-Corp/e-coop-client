import { formatBytes } from '@/helpers'

import { IMedia } from '@/types'

import { DotMediumIcon, TrashIcon } from '../icons'
import ImageDisplay from '../image-display'
import { AspectRatio } from '../ui/aspect-ratio'
import { Button } from '../ui/button'
import FileTypeIcon from '../ui/file-type'
import { Progress } from '../ui/progress'
import PreviewMediaWrapper from '../wrappers/preview-media-wrapper'

interface FileItemProps {
    file?: File
    media?: IMedia
    uploadDetails?: {
        isUploading?: boolean
        eta?: string
        progress?: number
    }
    onRemoveFile?: () => void
}

const FileItem = ({
    file,
    uploadDetails,
    media,
    onRemoveFile,
}: FileItemProps) => {
    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="space-y-2 rounded-lg border border-secondary bg-popover p-3"
        >
            <div className="flex space-x-3">
                {media ? (
                    <div className="size-12">
                        <AspectRatio ratio={1 / 1}>
                            <PreviewMediaWrapper media={media}>
                                <ImageDisplay
                                    src={media.download_url}
                                    className="size-full rounded-none object-cover"
                                />
                            </PreviewMediaWrapper>
                        </AspectRatio>
                    </div>
                ) : file ? (
                    <FileTypeIcon file={file} />
                ) : (
                    ''
                )}
                <div className="flex-grow space-y-2">
                    <p className="text-xs font-semibold">
                        {media?.file_name ?? file?.name ?? ''}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {formatBytes(media?.file_size ?? file?.size ?? 1)}
                    </p>
                </div>
                <Button
                    size="icon"
                    variant="secondary"
                    disabled={uploadDetails?.isUploading}
                    hoverVariant="destructive"
                    onClick={onRemoveFile}
                    className="size-fit rounded-md p-1 hover:text-destructive-foreground"
                >
                    <TrashIcon className="size-4 cursor-pointer" />
                </Button>
            </div>
            {uploadDetails?.isUploading && (
                <div className="space-y-1 pb-1">
                    <p className="inline-flex items-center text-xs text-muted-foreground/60">
                        {uploadDetails.progress}%{''}
                        <DotMediumIcon className="inline" />{' '}
                        {uploadDetails?.eta} seconds left.
                    </p>
                    <Progress
                        value={uploadDetails?.progress}
                        className="h-0.5"
                    />
                </div>
            )}
        </div>
    )
}

export default FileItem
