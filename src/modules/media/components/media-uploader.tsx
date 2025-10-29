import { useCallback, useEffect, useRef, useState } from 'react'

import { AxiosProgressEvent } from 'axios'
import { toast } from 'sonner'

import { cn } from '@/helpers'
import { dateAgo, toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { type Accept, type DropzoneOptions, useDropzone } from 'react-dropzone'

import { DownloadIcon, TrashIcon, UploadIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import Modal, { IModalProps } from '@/components/modals/modal'
import ActionTooltip from '@/components/tooltips/action-tooltip'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import {
    TDownloadMediaProp,
    downloadMedia,
    formatBytes,
    getFileCategory,
    getFileInfo,
} from '../'
import { logger, useUploadMedia } from '../media.service'
import { IMedia } from '../media.types'
import MediaResourceFileIcon from './media-resource-file-icon'

interface BaseMediaUploaderProps {
    maxSize?: number
    accept?: Accept
    maxFiles?: number
    disabled?: boolean
    className?: string
}

interface SingleModeProps extends BaseMediaUploaderProps {
    mode: 'single'
    onSingleUploadComplete: (uploadedFile: IMedia) => void
    onMultipleUploadComplete?: never
}

interface MultipleModeProps extends BaseMediaUploaderProps {
    mode: 'multiple'
    onMultipleUploadComplete: (uploadedFiles: IMedia[]) => void
    onSingleUploadComplete?: never
}

type MediaUploaderProps = SingleModeProps | MultipleModeProps

interface FileUploadState {
    file: File
    media?: IMedia
    isUploading: boolean
    progress: number
    eta: string
    error?: string
}

interface FileItemProps {
    file?: File
    media?: IMedia
    uploadDetails?: {
        isUploading?: boolean
        eta?: string
        progress?: number
    }
    onRemoveFile?: () => void
    displayMode?: boolean
    uploadedBy?: string
}

const FileItem = ({
    file,
    uploadDetails,
    media,
    uploadedBy,
    onRemoveFile,
}: FileItemProps) => {
    // Determine what to display based on media or file
    const displaySource = media || file

    // Get file info to determine category
    const { fullFileName, fileType } = displaySource
        ? getFileInfo(displaySource)
        : { fullFileName: '', fileType: '' }

    const category = displaySource
        ? getFileCategory(fullFileName, fileType)
        : 'unknown'
    const isImage = category === 'image'

    // Create preview URL only for image files that haven't been uploaded yet
    const previewUrl =
        file && isImage && !media ? URL.createObjectURL(file) : null

    // Cleanup preview URL on unmount
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl)
            }
        }
    }, [previewUrl])

    // Handle download
    const handleDownload = () => {
        downloadMedia(media || (previewUrl as TDownloadMediaProp))
    }

    // Get created date
    const createdDate =
        media?.created_at || (file ? new Date(file.lastModified) : null)

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
                    ) : file && isImage && previewUrl && !media ? (
                        <AspectRatio ratio={1 / 1}>
                            <img
                                alt={file.name}
                                className="size-full rounded object-cover"
                                src={previewUrl}
                            />
                        </AspectRatio>
                    ) : displaySource ? (
                        <MediaResourceFileIcon
                            iconClassName="size-24"
                            media={displaySource}
                        />
                    ) : null}
                </div>
                <div className="flex-1 space-y-1 min-w-0 overflow-hidden">
                    <p className="truncate text-sm font-semibold">
                        {file?.name ?? media?.file_name ?? ''}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {formatBytes(media?.file_size ?? file?.size ?? 1)}
                        {createdDate && (
                            <span className="text-xs text-muted-foreground cursor-default">
                                {' '}
                                • {toReadableDate(
                                    createdDate,
                                    'MMM d, yyyy'
                                )} • {dateAgo(createdDate)}
                            </span>
                        )}
                    </p>
                    {uploadedBy && (
                        <p className="text-xs text-muted-foreground">
                            Uploaded by : {uploadedBy}
                        </p>
                    )}
                </div>
                <div className="flex flex-col gap-1 flex-shrink-0">
                    {/* Download Button */}
                    {(media?.download_url || (file && previewUrl)) && (
                        <ActionTooltip
                            side="left"
                            tooltipContent="Download file"
                        >
                            <Button
                                className="size-fit rounded-md p-1"
                                onClick={handleDownload}
                                size="icon"
                                variant="secondary"
                            >
                                <DownloadIcon className="size-4 cursor-pointer" />
                            </Button>
                        </ActionTooltip>
                    )}
                    {/* Delete Button */}
                    {onRemoveFile && (
                        <ActionTooltip side="left" tooltipContent="Delete file">
                            <Button
                                className="size-fit rounded-md p-1 hover:text-destructive-foreground"
                                disabled={uploadDetails?.isUploading}
                                hoverVariant="destructive"
                                onClick={onRemoveFile}
                                size="icon"
                                variant="secondary"
                            >
                                <TrashIcon className="size-4 cursor-pointer" />
                            </Button>
                        </ActionTooltip>
                    )}
                </div>
            </div>
            {uploadDetails?.isUploading && (
                <div className="space-y-1 pb-1">
                    <p className="text-xs text-muted-foreground/60">
                        {uploadDetails.progress}% • {uploadDetails.eta} seconds
                        left
                    </p>
                    <Progress className="h-1" value={uploadDetails.progress} />
                </div>
            )}
        </div>
    )
}

const MediaUploader = (props: MediaUploaderProps) => {
    const {
        mode,
        maxSize = 100 * 1024 * 1024, // 100MB default
        accept,
        maxFiles = mode === 'single' ? 1 : 10,
        disabled = false,
        className = '',
    } = props

    const [fileStates, setFileStates] = useState<Map<string, FileUploadState>>(
        new Map()
    )
    const [uploadQueue, setUploadQueue] = useState<string[]>([])
    const [currentlyUploading, setCurrentlyUploading] = useState<string | null>(
        null
    )
    const completionCalledRef = useRef(false)

    // Generate unique key for file
    const getFileKey = (file: File): string => {
        return `${file.name}-${file.size}-${file.lastModified}`
    }

    // Progress callback
    const handleProgress = useCallback(
        (progressEvent: AxiosProgressEvent, fileKey: string) => {
            const progress = Math.round(
                ((progressEvent.loaded ?? 0) / (progressEvent.total ?? 1)) * 100
            )

            // Calculate ETA
            const elapsed = 1 // Simple estimation
            const speed = progressEvent.loaded / elapsed
            const remaining = (progressEvent.total ?? 0) - progressEvent.loaded
            const eta = speed > 0 ? Math.ceil(remaining / speed / 1000) : 0

            setFileStates((prev) => {
                const newMap = new Map(prev)
                const state = newMap.get(fileKey)
                if (state) {
                    newMap.set(fileKey, {
                        ...state,
                        progress,
                        eta: eta.toString(),
                    })
                }
                return newMap
            })
        },
        []
    )

    // Upload mutation with progress tracking
    const { mutate: uploadFile } = useUploadMedia({
        onProgress: (progressEvent: AxiosProgressEvent) => {
            if (currentlyUploading) {
                handleProgress(progressEvent, currentlyUploading)
            }
        },
    })

    // Check if all uploads are complete
    const checkAllUploadsComplete = useCallback(
        (_lastUploadedKey: string, lastUploadedMedia: IMedia) => {
            setFileStates((prev) => {
                const allStates = Array.from(prev.values())
                const allUploaded = allStates.every(
                    (state) => state.media !== undefined
                )

                if (allUploaded && !completionCalledRef.current) {
                    completionCalledRef.current = true
                    const uploadedMedias = allStates
                        .map((state) => state.media)
                        .filter((media): media is IMedia => media !== undefined)

                    // Use setTimeout to avoid calling during render
                    setTimeout(() => {
                        if (mode === 'single' && props.onSingleUploadComplete) {
                            props.onSingleUploadComplete(lastUploadedMedia)
                        } else if (
                            mode === 'multiple' &&
                            props.onMultipleUploadComplete
                        ) {
                            props.onMultipleUploadComplete(uploadedMedias)
                        }
                    }, 0)
                }

                return prev
            })
        },
        [mode, props]
    )

    // Process upload queue
    useEffect(() => {
        if (currentlyUploading || uploadQueue.length === 0) return

        const nextFileKey = uploadQueue[0]
        const fileState = fileStates.get(nextFileKey)

        if (!fileState || fileState.isUploading || fileState.media) {
            setUploadQueue((prev) => prev.slice(1))
            return
        }

        setCurrentlyUploading(nextFileKey)
        setFileStates((prev) => {
            const newMap = new Map(prev)
            const state = newMap.get(nextFileKey)
            if (state) {
                newMap.set(nextFileKey, { ...state, isUploading: true })
            }
            return newMap
        })

        const uploadPromise = new Promise<IMedia>((resolve, reject) => {
            uploadFile(
                { file: fileState.file },
                {
                    onSuccess: (media) => {
                        setFileStates((prev) => {
                            const newMap = new Map(prev)
                            const state = newMap.get(nextFileKey)
                            if (state) {
                                newMap.set(nextFileKey, {
                                    ...state,
                                    media,
                                    isUploading: false,
                                    progress: 100,
                                })
                            }
                            return newMap
                        })

                        setCurrentlyUploading(null)
                        setUploadQueue((prev) => prev.slice(1))

                        // Check if all files are uploaded
                        checkAllUploadsComplete(nextFileKey, media)
                        resolve(media)
                    },
                    onError: (error) => {
                        const errorMessage = serverRequestErrExtractor({
                            error,
                        })

                        logger.error(errorMessage || 'Upload failed')

                        setFileStates((prev) => {
                            const newMap = new Map(prev)
                            const state = newMap.get(nextFileKey)
                            if (state) {
                                newMap.set(nextFileKey, {
                                    ...state,
                                    isUploading: false,
                                    error: errorMessage || 'Upload failed',
                                })
                            }
                            return newMap
                        })

                        setCurrentlyUploading(null)
                        setUploadQueue((prev) => prev.slice(1))
                        reject(error)
                    },
                }
            )
        })

        toast.promise(uploadPromise, {
            loading: `Uploading ${fileState.file.name}...`,
            success: (media) => `Upload complete for '${media.file_name}'`,
            error: (error) => {
                const errorMessage = serverRequestErrExtractor({ error })
                return errorMessage || `Failed to upload ${fileState.file.name}`
            },
        })
    }, [
        uploadQueue,
        currentlyUploading,
        fileStates,
        uploadFile,
        checkAllUploadsComplete,
    ])

    // Handle files dropped (just add to state, don't upload yet)
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const newFileStates = new Map(fileStates)

            acceptedFiles.forEach((file) => {
                const fileKey = getFileKey(file)

                // For single mode, clear existing files
                if (mode === 'single') {
                    newFileStates.clear()
                }

                // Check if file already exists
                if (!newFileStates.has(fileKey)) {
                    newFileStates.set(fileKey, {
                        file,
                        isUploading: false,
                        progress: 0,
                        eta: '0',
                    })
                }
            })

            // Reset completion flag when new files are added
            completionCalledRef.current = false
            setFileStates(newFileStates)
        },
        [fileStates, mode]
    )

    // Handle upload button click
    const handleUpload = useCallback(() => {
        const newQueue: string[] = []

        fileStates.forEach((state, key) => {
            // Only add files that haven't been uploaded yet
            if (!state.media && !state.isUploading) {
                newQueue.push(key)
            }
        })

        // Reset completion flag when starting uploads
        completionCalledRef.current = false
        setUploadQueue((prev) => [...prev, ...newQueue])
    }, [fileStates])

    // Remove file handler
    const handleRemoveFile = (fileKey: string) => {
        setFileStates((prev) => {
            const newMap = new Map(prev)
            newMap.delete(fileKey)
            return newMap
        })

        setUploadQueue((prev) => prev.filter((key) => key !== fileKey))

        if (currentlyUploading === fileKey) {
            setCurrentlyUploading(null)
        }
    }

    // Remove all files
    const handleRemoveAllFiles = () => {
        setFileStates(new Map())
        setUploadQueue([])
        setCurrentlyUploading(null)
    }

    // Dropzone configuration
    const dropzoneOptions: DropzoneOptions = {
        onDrop,
        maxSize,
        accept,
        maxFiles: mode === 'single' ? 1 : maxFiles,
        disabled: disabled || (mode === 'single' && fileStates.size > 0),
        multiple: mode === 'multiple',
    }

    const { getRootProps, getInputProps, isDragActive } =
        useDropzone(dropzoneOptions)

    const fileArray = Array.from(fileStates.entries())
    const hasFiles = fileArray.length > 0

    return (
        <div className={cn('space-y-4 min-w-0 max-w-full', className)}>
            {/* Dropzone Area */}
            <div
                {...getRootProps()}
                className={`
                    flex cursor-pointer flex-col items-center justify-center
                    rounded-lg border-2 border-dashed p-12 transition-colors
                    ${
                        isDragActive
                            ? 'border-primary bg-primary/5'
                            : 'border-secondary bg-background hover:border-primary/50 hover:bg-muted/50'
                    }
                    ${disabled ? 'cursor-not-allowed opacity-50' : ''}
                    ${mode === 'single' && hasFiles ? 'cursor-not-allowed opacity-50' : ''}
                `}
            >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="rounded-full border border-border/50 p-4">
                        <UploadIcon className="size-8 text-muted-foreground" />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Upload files</h3>
                        <p className="text-sm text-muted-foreground">
                            Drag & drop or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground">
                            All files · Max {maxFiles} file
                            {maxFiles > 1 ? 's' : ''} · Up to{' '}
                            {formatBytes(maxSize)}
                        </p>
                    </div>
                </div>
            </div>

            {/* File List */}
            {hasFiles && (
                <>
                    <div className="space-y-3 max-h-[80%] ecoop-scroll">
                        {fileArray.map(([key, state]) => (
                            <FileItem
                                file={state.file}
                                key={key}
                                media={state.media}
                                onRemoveFile={() => handleRemoveFile(key)}
                                uploadDetails={{
                                    isUploading: state.isUploading,
                                    progress: state.progress,
                                    eta: state.eta,
                                }}
                                uploadedBy="You"
                            />
                        ))}
                    </div>

                    {mode === 'multiple' && maxFiles > 1 && (
                        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                            <span>
                                {fileArray.length} file
                                {fileArray.length !== 1 ? 's' : ''}
                                {fileArray.length >= maxFiles && (
                                    <span className="text-destructive font-medium ml-2">
                                        • Maximum reached
                                    </span>
                                )}
                            </span>
                            <span>
                                {maxFiles} file{maxFiles !== 1 ? 's' : ''}{' '}
                                allowed
                            </span>
                        </div>
                    )}

                    <div className="flex gap-2">
                        {/* Upload Button */}
                        <Button
                            className="flex-1"
                            disabled={
                                currentlyUploading !== null ||
                                fileArray.every(
                                    ([_, state]) => state.media !== undefined
                                )
                            }
                            onClick={handleUpload}
                            size="sm"
                            variant="default"
                        >
                            <UploadIcon className="mr-2 size-4" />
                            Upload {mode === 'single' ? 'File' : 'Files'}
                        </Button>

                        {/* Remove All Button (Multiple Mode Only) */}
                        {mode === 'multiple' && fileArray.length > 1 && (
                            <Button
                                disabled={currentlyUploading !== null}
                                onClick={handleRemoveAllFiles}
                                size="sm"
                                variant="ghost"
                            >
                                Remove all
                            </Button>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

export const MediaUploaderModal = ({
    title = 'Uploader',
    description = 'Upload files',
    className,
    uploaderProps,
    ...props
}: IModalProps & {
    uploaderProps: MediaUploaderProps
}) => {
    return (
        <Modal
            className={cn('p-4 !max-w-xl', className)}
            closeButtonClassName="hidden"
            description={description}
            descriptionClassName="hidden"
            title={title}
            titleClassName="hidden"
            {...props}
        >
            <MediaUploader {...uploaderProps} />
        </Modal>
    )
}

export default MediaUploader
export { FileItem, type FileItemProps }
