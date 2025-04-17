import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import FileTypeIcon from '../ui/file-type'
import { DotMediumIcon, TrashIcon } from '../icons'

import { formatBytes } from '@/helpers'
import { IMediaResource } from '@/server'
import { AspectRatio } from '../ui/aspect-ratio'
import ImageDisplay from '../image-display'

interface FileItemProps {
    file?: File
    media?: IMediaResource
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
                            <ImageDisplay
                                src={media.downloadURL}
                                className="size-full rounded-none object-cover"
                            />
                        </AspectRatio>
                    </div>
                ) : file ? (
                    <FileTypeIcon file={file} />
                ) : (
                    ''
                )}
                <div className="flex-grow space-y-2">
                    <p className="text-xs font-semibold">
                        {media?.fileName ?? file?.name ?? ''}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {formatBytes(media?.fileSize ?? file?.size ?? 1)}
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
