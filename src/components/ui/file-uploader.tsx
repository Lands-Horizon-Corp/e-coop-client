import { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { cn } from '@/helpers/tw-utils'
import {
    DropzoneOptions,
    FileRejection,
    FileWithPath,
    useDropzone,
} from 'react-dropzone'

import {
    HardDriveUploadIcon,
    ReplaceIcon,
    TrashIcon,
    UploadIcon,
} from '../icons'
import { Button } from './button'
import FileTypeIcon from './file-type'
import { ScrollArea } from './scroll-area'
import { formatBytes } from '@/helpers/common-helper'

interface FileUploaderProps extends DropzoneOptions {
    className?: string
    itemClassName?: string
    onFileChange?: (file: File[]) => void
    selectedPhotos?: (selectedPhoto: string) => void
    buttonOnly?: boolean
}

const FileUploader = ({
    className,
    onFileChange,
    selectedPhotos,
    itemClassName,
    buttonOnly = false,
    ...props
}: FileUploaderProps) => {
    const [hasError, setHasError] = useState(false)
    const [uploadedFiles, setUploadedFiles] = useState<readonly FileWithPath[]>(
        []
    )
    const handleFilesChange = useCallback((newFiles: FileWithPath[]) => {
        setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles])
    }, [])

    const onDrop = useCallback(
        (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            if (fileRejections.length > 0) {
                const error = fileRejections[0].errors[0]
                const errorMessage =
                    error.code === 'too-many-files'
                        ? 'Only one image file is allowed. Please choose just one.'
                        : error.message
                toast.error(errorMessage)
                setHasError(true)
                return
            }

            const file = acceptedFiles[0]
            if (file) {
                const reader = new FileReader()
                reader.addEventListener('load', () => {
                    const newImgUrl = reader.result?.toString() ?? ''
                    selectedPhotos?.(newImgUrl)
                })
                reader.readAsDataURL(file)
            }

            setHasError(false)
            onFileChange?.(acceptedFiles)
            handleFilesChange(acceptedFiles)
        },
        [onFileChange, handleFilesChange, selectedPhotos]
    )

    const { getRootProps, getInputProps, open } = useDropzone({
        onDrop,
        onError: (error) => {
            toast.error(error.message)
        },
        ...props,
        noClick: true,
    })

    const handleDeleteFile = (index: number) => () => {
        setUploadedFiles((prevFiles) =>
            prevFiles.filter((_, idx) => idx !== index)
        )
        selectedPhotos?.('')
    }

    const openFile = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        e.preventDefault()
        open()
    }

    const isEmpty = uploadedFiles.length === 0 || selectedPhotos?.length === 0

    return (
        <>
            {buttonOnly ? (
                <div className="flex w-fit gap-x-2" {...getRootProps()}>
                    <input {...getInputProps()} aria-hidden="true" />
                    <Button
                        onClick={openFile}
                        disabled={uploadedFiles.length > 0}
                        className="flex items-center justify-center text-xs"
                        aria-label="Select files"
                    >
                        Select Files
                        <HardDriveUploadIcon className="ml-2" />
                    </Button>
                    <Button
                        variant={'secondary'}
                        disabled={isEmpty}
                        onClick={(e) => {
                            e.preventDefault()
                            setUploadedFiles([])
                            selectedPhotos?.('')
                        }}
                    >
                        replace
                        <ReplaceIcon className="ml-2" />
                    </Button>
                </div>
            ) : (
                <div className="max-h-fit w-full">
                    <div
                        {...getRootProps()}
                        className={cn(
                            'mb-2 flex h-full max-h-64 min-h-64 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-800/30 p-2 pb-4 text-sm dark:bg-background',
                            className
                        )}
                        aria-label="File upload area"
                    >
                        <input {...getInputProps()} aria-hidden="true" />
                        <UploadIcon className="size-24 text-primary" />
                        <p>
                            <span
                                onClick={openFile}
                                className="cursor-pointer font-semibold underline"
                                aria-label="Click to upload files"
                            >
                                Click to upload
                            </span>{' '}
                            or Drag and Drop
                        </p>
                        <Button
                            onClick={openFile}
                            disabled={uploadedFiles.length > 0}
                            variant="outline"
                            className="text-xs"
                            aria-label="Select files"
                        >
                            Select Files
                        </Button>
                    </div>
                    <ScrollArea className="max-h-64 overflow-auto">
                        <div className={cn('w-full space-y-2', itemClassName)}>
                            {!hasError &&
                                uploadedFiles.map((file, idx) => (
                                    <UploadedFileItem
                                        key={idx}
                                        file={file}
                                        onDelete={handleDeleteFile(idx)}
                                    />
                                ))}
                        </div>
                    </ScrollArea>
                </div>
            )}
        </>
    )
}

interface UploadedFileItemProps {
    file: File
    onDelete: () => void
}

const UploadedFileItem = ({ file, onDelete }: UploadedFileItemProps) => {
    return (
        <div className="flex w-full items-center space-x-3 rounded-lg border border-slate-300 p-3">
            <FileTypeIcon file={file} />
            <div className="flex-grow">
                <p className="text-xs font-semibold">{file.name}</p>
                <p className="text-xs">{formatBytes(file.size)}</p>
            </div>
            <TrashIcon
                onClick={onDelete}
                size={18}
                className="cursor-pointer text-destructive hover:scale-105"
            />
        </div>
    )
}

export default FileUploader
