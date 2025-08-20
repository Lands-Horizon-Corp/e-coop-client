import { useState } from 'react'
import { toast } from 'sonner'

import { toDateTimeFormatFile } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { useUploadMedia } from '@/modules/media'

import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import FormErrorMessage from '@/components/ui/form-error-message'
import WebCam from '@/components/webcam'

import { useCamera } from '@/hooks/use-camera'

import { IClassProps, IOperationCallback } from '@/types'

import { useTimeInOut } from '../../timesheet.service'
import { ITimesheet } from '../../timesheet.types'
import RealtimeTimeText from './realtime-time-text'

interface Props extends IClassProps, IOperationCallback<ITimesheet> {
    timesheet?: ITimesheet
    onCancel?: () => void
}

const TimeInOut = ({
    timesheet,
    className,
    onSuccess,
    onError,
    onCancel,
}: Props) => {
    const { camRef, captureImageToFile } = useCamera()
    const [imageId, setImageId] = useState<string | undefined>(undefined)

    const {
        mutateAsync: uploadMediaAsync,
        isPending: isUploading,
        error: uploadImageError,
    } = useUploadMedia()

    const {
        mutate: saveTimeInOut,
        isPending: isSaving,
        error: rawError,
    } = useTimeInOut({
        options: {
            onSuccess: (timesheetData) => {
                onSuccess?.(timesheetData)
                setImageId(undefined)
            },
            onError,
        },
    })

    const error = serverRequestErrExtractor({
        error: uploadImageError || rawError,
    })

    const handleSave = async () => {
        const image = captureImageToFile({
            captureFileName: `${timesheet ? 'time-out' : 'time-in'}_${toDateTimeFormatFile(new Date())}`,
        })
        let uploaded: string | undefined = imageId

        if (!image) {
            toast.warning('Failed to capture image')
        } else if (!imageId) {
            const uploadedImage = await uploadMediaAsync(image)
            uploaded = uploadedImage.id
            setImageId(uploaded)
        }

        saveTimeInOut({ media_id: uploaded })
    }

    return (
        <div className={cn('flex flex-col gap-y-3', className)}>
            <div className="relative mx-auto">
                <WebCam
                    ref={camRef}
                    className="!h-[300px] !w-[350px] rounded-2xl"
                />
            </div>
            <RealtimeTimeText className="text-center text-sm text-muted-foreground" />
            <FormErrorMessage errorMessage={error} />
            <div className="flex w-full items-center gap-x-2">
                <Button
                    size="sm"
                    variant="ghost"
                    className="w-full border hover:bg-background/40 hover:text-foreground dark:border-none"
                    onClick={() => onCancel?.()}
                    disabled={isSaving || isUploading}
                >
                    Cancel
                </Button>
                <Button
                    size="sm"
                    className="w-full gap-x-2"
                    onClick={() => handleSave()}
                    disabled={isSaving || isUploading}
                >
                    {(isSaving || isUploading) && <LoadingSpinner />}
                    {error
                        ? 'Try Again'
                        : !isSaving
                          ? 'Caputre & Save'
                          : 'Saving'}
                </Button>
            </div>
        </div>
    )
}

export default TimeInOut
