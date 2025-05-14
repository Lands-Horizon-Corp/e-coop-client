import { cn } from '@/lib'
import { useState, useEffect } from 'react'
import ActionTooltip from '../action-tooltip'
import { AdjustIcon } from '../icons'
import Modal, { IModalProps } from '../modals/modal'
import PictureCrop from '../picture-crop'
import UserAvatar from '../user-avatar'
import PictureDrop from './picture-drop'
import { Button } from '../ui/button'

interface singlePictureUploadModalProps extends IModalProps {
    onPhotoChoose: (imageBase64: string) => void
    defaultImage: string
}

export const SinglePictureUploadModal = ({
    title = 'Upload Image',
    className,
    onPhotoChoose,
    ...props
}: singlePictureUploadModalProps) => {
    return (
        <Modal title={title} className={cn('', className)} {...props}>
            <ImageDropPicker {...props} onPhotoChoose={onPhotoChoose} />
        </Modal>
    )
}

export const ImageDropPicker = ({
    onPhotoChoose,
    onOpenChange,
    defaultImage,
}: singlePictureUploadModalProps) => {
    const [reAdjust, setReAdjust] = useState(false)
    const [newImage, setNewImage] = useState<string | null>(null)
    const [croppedImage, setCroppedImage] = useState<string | null>(null)

    const openPickedImage = !!croppedImage && !reAdjust

    const shouldOpenCropper = newImage && (!croppedImage || reAdjust)

    const shouldOpenImagePicker = newImage === null

    useEffect(() => {
        if (defaultImage) {
            setCroppedImage(defaultImage)
            setNewImage(defaultImage)
        }
    }, [defaultImage])

    return (
        <>
            {openPickedImage && (
                <div className="relative mx-auto size-fit">
                    <UserAvatar
                        fallback="-"
                        src={croppedImage ?? ''}
                        className="size-48"
                    />
                    <ActionTooltip
                        tooltipContent="ReAdjust Image"
                        align="center"
                        side="right"
                    >
                        <Button
                            variant="secondary"
                            onClick={() => setReAdjust(true)}
                            className="absolute bottom-2 right-2 size-fit rounded-full border border-transparent p-1 hover:border-foreground/20"
                        >
                            <AdjustIcon className="size-4 opacity-50 duration-300 ease-in-out group-hover:opacity-80" />
                        </Button>
                    </ActionTooltip>
                </div>
            )}
            {shouldOpenImagePicker && (
                <SingleImageUploadOption
                    onPhotoChoose={(base64Image) => setNewImage(base64Image)}
                />
            )}
            {shouldOpenCropper ? (
                <PictureCrop
                    image={newImage ?? ''}
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

            <div className="flex justify-end gap-2">
                <Button
                    variant="secondary"
                    disabled={!newImage && !defaultImage}
                    onClick={() => {
                        setNewImage(null)
                        setCroppedImage(null)
                    }}
                >
                    Replace
                </Button>
                <Button
                    disabled={reAdjust || !croppedImage || !newImage}
                    onClick={(e) => {
                        e.preventDefault()
                        onOpenChange?.(false)
                        if (croppedImage) {
                            onPhotoChoose(croppedImage)
                        }
                    }}
                >
                    confirm
                </Button>
            </div>
        </>
    )
}

type Props = {
    onPhotoChoose: (imageBase64: string) => void
}

const SingleImageUploadOption = ({ onPhotoChoose }: Props) => {
    const onFileSelect = (files: FileList) => {
        if (files && files.length > 0) {
            const reader = new FileReader()
            reader.addEventListener('load', () => {
                const newImgUrl = reader.result?.toString() ?? ''
                onPhotoChoose(newImgUrl)
            })
            reader.readAsDataURL(files?.[0])
        }
    }
    return (
        <div>
            <PictureDrop onFileSelect={onFileSelect} />
        </div>
    )
}
