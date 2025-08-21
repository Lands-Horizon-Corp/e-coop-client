import { forwardRef, useState } from 'react'

import { toast } from 'sonner'

import { formatBytes } from '@/helpers'
import { abbreviateUUID } from '@/utils/formatting-utils'
import { IconType } from 'react-icons/lib'

import { ImageIcon, TrashIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { Button } from '@/components/ui/button'
import { SingleImageUploaderModal } from '@/components/uploaders/single-image-uploader'

import { IMedia, TEntityId } from '@/types'

export interface SingleImageUploadFieldProps {
    id?: string
    name?: string
    value?: TEntityId
    DisplayIcon?: IconType
    placeholder?: string
    mediaImage?: IMedia | undefined
    onChange?: (media: IMedia | undefined) => void
    uploaderModalTitle?: string
    uploaderModalDescription?: string
}

export const SingleImageUploadField = forwardRef<
    HTMLButtonElement,
    SingleImageUploadFieldProps
>(
    (
        {
            value,
            mediaImage,
            placeholder,
            uploaderModalTitle = 'Upload Image',
            uploaderModalDescription = 'Choose/Upload single image. You may also capture using camera.',
            DisplayIcon = ImageIcon,
            onChange,
            ...other
        },
        ref
    ) => {
        const [uploaderModal, setUploaderModal] = useState(false)

        return (
            <div>
                <SingleImageUploaderModal
                    title={uploaderModalTitle}
                    description={uploaderModalDescription}
                    open={uploaderModal}
                    onOpenChange={setUploaderModal}
                    singleImageUploaderProp={{
                        onSuccess: (media: IMedia) => {
                            toast.success(
                                `Image Uploaded ${media.file_name} with ID: ${media.id}`
                            )
                            onChange?.({
                                ...media,
                                id: '550e8400-e29b-41d4-a716-446655440000',
                            })
                            setUploaderModal(false)
                        },
                        className: 'p-0',
                    }}
                    className="max-w-xl bg-popover p-8"
                />
                {mediaImage ? (
                    <div className="flex items-center gap-x-2 rounded-md border bg-background p-2">
                        <ImageDisplay
                            className="size-14 rounded-lg"
                            src={mediaImage.download_url}
                        />
                        <div className="grow space-y-1 text-xs">
                            <p>{mediaImage.file_name}</p>
                            <p className="text-muted-foreground/70">
                                {formatBytes(mediaImage.file_size)}
                            </p>
                        </div>
                        <Button
                            size="icon"
                            type="button"
                            variant="secondary"
                            hoverVariant="destructive"
                            className="size-fit p-1"
                            onClick={() => {
                                onChange?.(undefined)
                            }}
                        >
                            <TrashIcon />
                        </Button>
                    </div>
                ) : (
                    <Button
                        {...other}
                        ref={ref}
                        type="button"
                        role="combobox"
                        variant="outline"
                        onClick={() => setUploaderModal(true)}
                        className="w-full justify-between bg-background px-3 font-normal outline-offset-0 hover:bg-background focus-visible:border-ring focus-visible:outline-[3px] focus-visible:outline-ring/20"
                    >
                        {value ? (
                            <span>
                                {abbreviateUUID(value, 14)} (Uploaded Image)
                            </span>
                        ) : (
                            (placeholder ?? 'Upload Image')
                        )}
                        <DisplayIcon className="shrink-0 text-muted-foreground/80" />
                    </Button>
                )}
            </div>
        )
    }
)

SingleImageUploadField.displayName = 'SingleImageUploadField'
