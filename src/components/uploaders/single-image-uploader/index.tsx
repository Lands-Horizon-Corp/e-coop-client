import { toast } from 'sonner'
import { useState } from 'react'

import {
    TrashIcon,
    CameraIcon,
    DotMediumIcon,
    HardDriveUploadIcon,
} from '@/components/icons'
import WebCam from '@/components/webcam'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import FileTypeIcon from '@/components/ui/file-type'
import SingleFileDrop from '../file-drop/single-file-drop'
import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { cn } from '@/lib'
import { formatBytes } from '@/helpers'
import { IMediaResource } from '@/types'
import { IClassProps } from '@/types'
import { useCamera } from '@/hooks/use-camera'
import { useSinglePictureUpload } from '@/hooks/api-hooks/use-media-resource'

type TUploadSource = 'file' | 'capture'

interface ISingleImageUploaderProps extends IClassProps {
    onSuccess?: (media: IMediaResource) => void
}

const SingleImageUploader = ({
    className,
    onSuccess,
}: ISingleImageUploaderProps) => {
    const [eta, setEta] = useState('')
    const [progress, setProgress] = useState(0)
    const [file, setFile] = useState<File | undefined>(undefined)
    const [uploadSource, setUploadSource] = useState<TUploadSource>('file')

    const { camRef, captureImageToFile } = useCamera()

    const {
        data: uploadedFile,
        isPending: isUploadingPhoto,
        mutate: uploadPhoto,
        reset,
    } = useSinglePictureUpload({
        onSuccess: (media) => {
            onSuccess?.(media)
        },
        onUploadProgressChange: (progress) => setProgress(progress),
        onUploadETAChange: (ETA) => setEta(ETA),
    })

    return (
        <div className={cn('relative space-y-2 p-1', className)}>
            <Tabs
                defaultValue="file"
                value={uploadSource}
                className="items-start justify-start"
                onValueChange={(uploadSource) =>
                    setUploadSource(uploadSource as TUploadSource)
                }
            >
                <ScrollArea>
                    <TabsList className="relative mb-3 h-auto w-full justify-start gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-border">
                        <TabsTrigger
                            value="file"
                            className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                        >
                            <HardDriveUploadIcon className="-ms-0.5 me-1.5 opacity-60" />
                            File Upload
                        </TabsTrigger>
                        <TabsTrigger
                            value="capture"
                            className="overflow-hidden rounded-b-none border-x border-t border-border bg-muted py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                        >
                            <CameraIcon className="-ms-0.5 me-1.5 opacity-60" />
                            Capture
                        </TabsTrigger>
                    </TabsList>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
                <TabsContent value="file" className="relative p-1">
                    <SingleFileDrop
                        maxFiles={1}
                        accept={{
                            'image/png': ['.png'],
                            'image/webp': ['.webp'],
                            'image/jpeg': ['.jpg', '.jpeg'],
                        }}
                        onFileSelect={(files) => {
                            setFile(files[0])
                        }}
                    />
                </TabsContent>
                <TabsContent
                    value="capture"
                    className="relative flex flex-col items-center gap-y-4"
                >
                    <WebCam ref={camRef} className="h-full w-full" />
                    <Button
                        size="icon"
                        variant="secondary"
                        className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full"
                        onClick={() => {
                            captureImageToFile({
                                onCaptureSuccess: (image) => setFile(image),
                                onCaptureError: () =>
                                    toast.error('Failed to capture'),
                            })
                        }}
                    >
                        <CameraIcon />
                    </Button>
                </TabsContent>
            </Tabs>

            {file && (
                <div className="space-y-2 rounded-lg border border-secondary bg-popover p-3">
                    <div className="flex space-x-3">
                        <FileTypeIcon file={file} />
                        <div className="flex-grow space-y-2">
                            <p className="text-xs font-semibold">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {formatBytes(file.size)}
                            </p>
                        </div>
                        <Button
                            size="icon"
                            variant="secondary"
                            disabled={isUploadingPhoto}
                            hoverVariant="destructive"
                            onClick={() => {
                                setFile(undefined)
                                reset()
                            }}
                            className="size-fit rounded-md p-1 hover:text-destructive-foreground"
                        >
                            <TrashIcon className="size-4 cursor-pointer" />
                        </Button>
                    </div>
                    {isUploadingPhoto && (
                        <div className="space-y-1 pb-1">
                            <p className="inline-flex items-center text-xs text-muted-foreground/60">
                                {progress}%{''}
                                <DotMediumIcon className="inline" /> {eta}{' '}
                                seconds left.
                            </p>
                            <Progress value={progress} className="h-0.5" />
                        </div>
                    )}
                </div>
            )}
            <Button
                className="w-full"
                disabled={
                    isUploadingPhoto || !file || uploadedFile !== undefined
                }
                onClick={() => (file ? uploadPhoto(file) : undefined)}
            >
                {isUploadingPhoto ? (
                    <span>
                        <LoadingSpinner className="mr-2 inline size-4" />
                        uploading...
                    </span>
                ) : (
                    'Upload'
                )}
            </Button>
        </div>
    )
}

export const SingleImageUploaderModal = ({
    singleImageUploaderProp,
    ...other
}: IModalProps & { singleImageUploaderProp: ISingleImageUploaderProps }) => {
    return (
        <Modal {...other}>
            <SingleImageUploader {...singleImageUploaderProp} />
        </Modal>
    )
}

export default SingleImageUploader
