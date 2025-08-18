import { useState } from 'react'
import { toast } from 'sonner'

import { cn } from '@/helpers/tw-utils'
import { toDateTimeFormatFile } from '@/utils'

import { useSinglePictureUpload } from '@/hooks/api-hooks/use-media'
import { useTimeInOut } from '@/hooks/api-hooks/use-timesheet'
import { useCamera } from '@/hooks/use-camera'

import { IClassProps, IOperationCallbacks, ITimesheet } from '@/types'

import LoadingSpinner from '../spinners/loading-spinner'
import { Button } from '../ui/button'
import FormErrorMessage from '../ui/form-error-message'
import WebCam from '../webcam'
import RealtimeTimeText from './realtime-time-text'

interface Props extends IClassProps, IOperationCallbacks<ITimesheet, string> {
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
    } = useSinglePictureUpload()

    const {
        mutate: saveTimeInOut,
        isPending: isSaving,
        error,
    } = useTimeInOut({
        onSuccess: (timesheetData) => {
            onSuccess?.(timesheetData)
            setImageId(undefined)
        },
        onError,
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
            <FormErrorMessage errorMessage={error || uploadImageError} />
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
