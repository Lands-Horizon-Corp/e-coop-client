import { useState } from 'react'

import { calculateUploadProgress } from '@/helpers/axios-helpers/axios-progress-helper'
import { base64ImagetoFile } from '@/helpers/picture-crop-helper'
import { cn } from '@/helpers/tw-utils'
import { useUploadMedia } from '@/modules/media/media.service'
import { IMedia } from '@/modules/media/media.types'

import { AdjustIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import PictureCrop from '@/components/picture-crop'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import ActionTooltip from '@/components/tooltips/action-tooltip'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

import SingleImageUploadOption from './upload-options'

export interface ISingleImageUploadProps {
    disableCrop?: boolean
    defaultImage?: string
    defaultFileName?: string
    squarePreview?: boolean
    onUploadComplete: (mediaResource: IMedia) => void
}

const SingleImageUpload = ({
    disableCrop,
    squarePreview = false,
    defaultFileName,
    onUploadComplete,
}: ISingleImageUploadProps) => {
    const [reAdjust, setReAdjust] = useState(false)
    const [newImage, setNewImage] = useState<string | null>(null)
    const [croppedImage, setCroppedImage] = useState<string | null>(null)
    const [uploadMediaProgress, setUploadMediaProgress] = useState<number>(0)

    const {
        data: uploadedPhoto,
        isPending: isUploadingPhoto,
        mutate: uploadPhoto,
    } = useUploadMedia({
        options: {
            onSuccess: (data) => onUploadComplete?.(data),
        },
        onProgress: (progressEvent) => {
            const calculated = calculateUploadProgress(progressEvent)
            if (!calculated) return

            setUploadMediaProgress(calculated.progress)
        },
    })

    return (
        <div className="space-y-4">
            {newImage === null && (
                <SingleImageUploadOption
                    onPhotoChoose={(base64Image) => {
                        setNewImage(base64Image)
                        if (disableCrop) setCroppedImage(base64Image)
                    }}
                />
            )}
            {newImage !== null &&
            !disableCrop &&
            (!croppedImage || reAdjust) ? (
                <PictureCrop
                    image={newImage}
                    onCancel={() => {
                        if (croppedImage) {
                            setReAdjust(false)
                        } else {
                            setNewImage(null)
                        }
                        setReAdjust(false)
                    }}
                    onCrop={(result) => {
                        setReAdjust(false)
                        setCroppedImage(result)
                    }}
                />
            ) : null}
            {croppedImage && !reAdjust && (
                <div className="space-y-4">
                    <div className="relative mx-auto size-fit">
                        <ImageDisplay
                            className={cn(
                                'size-48 rounded-lg',
                                squarePreview && ''
                            )}
                            fallback="-"
                            src={croppedImage}
                        />
                        {!disableCrop && (
                            <ActionTooltip
                                align="center"
                                side="right"
                                tooltipContent="ReAdjust Image"
                            >
                                <Button
                                    className="absolute bottom-2 right-2 size-fit rounded-full border border-transparent p-1 hover:border-foreground/20"
                                    onClick={() => setReAdjust(true)}
                                    variant="secondary"
                                >
                                    <AdjustIcon className="size-4 opacity-50 duration-300 ease-in-out group-hover:opacity-80" />
                                </Button>
                            </ActionTooltip>
                        )}
                    </div>
                    {isUploadingPhoto && (
                        <>
                            <Progress
                                className="h-1"
                                value={uploadMediaProgress}
                            />
                            <div className="flex items-center justify-center gap-x-1 text-center text-xs text-foreground/60">
                                <LoadingSpinner className="size-2" />
                                {isUploadingPhoto && 'uploading picture...'}
                            </div>
                        </>
                    )}
                    <fieldset
                        className="flex w-full items-center justify-center gap-x-2"
                        disabled={isUploadingPhoto}
                    >
                        {!uploadedPhoto && !isUploadingPhoto && (
                            <Button
                                onClick={() => {
                                    setNewImage(null)
                                    setCroppedImage(null)
                                }}
                                variant="secondary"
                            >
                                Replace
                            </Button>
                        )}
                        {!uploadedPhoto && !isUploadingPhoto && (
                            <Button
                                onClick={() =>
                                    uploadPhoto({
                                        file: base64ImagetoFile(
                                            croppedImage,
                                            `${defaultFileName}.jpg`
                                        ) as File,
                                    })
                                }
                            >
                                Upload
                            </Button>
                        )}
                    </fieldset>
                </div>
            )}
        </div>
    )
}

export default SingleImageUpload
