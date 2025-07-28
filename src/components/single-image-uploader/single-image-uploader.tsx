import { useState } from 'react'

import { base64ImagetoFile } from '@/helpers/picture-crop-helper'
import { cn } from '@/lib'

import ActionTooltip from '@/components/action-tooltip'
import { AdjustIcon } from '@/components/icons'
import PictureCrop from '@/components/picture-crop'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

import { useSinglePictureUpload } from '@/hooks/api-hooks/use-media'

import { IMedia } from '@/types'

import ImageDisplay from '../image-display'
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
    } = useSinglePictureUpload({
        onSuccess: onUploadComplete,
        onUploadProgressChange: (progress) => setUploadMediaProgress(progress),
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
                    onCrop={(result) => {
                        setReAdjust(false)
                        setCroppedImage(result)
                    }}
                    onCancel={() => {
                        if (croppedImage) {
                            setReAdjust(false)
                        } else {
                            setNewImage(null)
                        }
                        setReAdjust(false)
                    }}
                />
            ) : null}
            {croppedImage && !reAdjust && (
                <div className="space-y-4">
                    <div className="relative mx-auto size-fit">
                        <ImageDisplay
                            fallback="-"
                            src={croppedImage}
                            className={cn(
                                'size-48 rounded-lg',
                                squarePreview && ''
                            )}
                        />
                        {!disableCrop && (
                            <ActionTooltip
                                side="right"
                                align="center"
                                tooltipContent="ReAdjust Image"
                            >
                                <Button
                                    variant="secondary"
                                    onClick={() => setReAdjust(true)}
                                    className="absolute bottom-2 right-2 size-fit rounded-full border border-transparent p-1 hover:border-foreground/20"
                                >
                                    <AdjustIcon className="size-4 opacity-50 duration-300 ease-in-out group-hover:opacity-80" />
                                </Button>
                            </ActionTooltip>
                        )}
                    </div>
                    {isUploadingPhoto && (
                        <>
                            <Progress
                                value={uploadMediaProgress}
                                className="h-1"
                            />
                            <div className="flex items-center justify-center gap-x-1 text-center text-xs text-foreground/60">
                                <LoadingSpinner className="size-2" />
                                {isUploadingPhoto && 'uploading picture...'}
                            </div>
                        </>
                    )}
                    <fieldset
                        disabled={isUploadingPhoto}
                        className="flex w-full items-center justify-center gap-x-2"
                    >
                        {!uploadedPhoto && !isUploadingPhoto && (
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setNewImage(null)
                                    setCroppedImage(null)
                                }}
                            >
                                Replace
                            </Button>
                        )}
                        {!uploadedPhoto && !isUploadingPhoto && (
                            <Button
                                onClick={() =>
                                    uploadPhoto(
                                        base64ImagetoFile(
                                            croppedImage,
                                            `${defaultFileName}.jpg`
                                        ) as File
                                    )
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
