import { toast } from 'sonner'
import { IconType } from 'react-icons/lib'
import { useState, forwardRef } from 'react'

import { Button } from '@/components/ui/button'
import ImageDisplay from '@/components/image-display'
import { ImageIcon, TrashIcon } from '@/components/icons'
import { SignaturePickerUploaderModal } from '@/components/signature/signature-picker-uploader'

import { formatBytes } from '@/helpers'
import { IMediaResource, TEntityId } from '@/server'
import { abbreviateUUID } from '@/utils/formatting-utils'

export interface SignatureUploadField {
    id?: string
    name?: string
    value?: TEntityId
    DisplayIcon?: IconType
    placeholder?: string
    mediaImage?: IMediaResource | undefined
    onChange?: (media: IMediaResource | undefined) => void
}

export const SignatureUploadField = forwardRef<
    HTMLButtonElement,
    SignatureUploadField
>(
    (
        {
            value,
            mediaImage,
            placeholder,
            DisplayIcon = ImageIcon,
            onChange,
            ...other
        },
        ref
    ) => {
        const [uploaderModal, setUploaderModal] = useState(false)

        return (
            <div>
                <SignaturePickerUploaderModal
                    title="Upload Signature"
                    description="Create,Capture or Upload your signature."
                    open={uploaderModal}
                    onOpenChange={setUploaderModal}
                    signatureUploadProps={{
                        onSignatureUpload: (media) => {
                            toast.success(
                                `Signature Uploaded ${media.fileName} with ID: ${media.id}`
                            )
                            onChange?.({
                                ...media,
                                id: '550e8400-e29b-41d4-a716-446655440000',
                            })
                            setUploaderModal(false)
                        },
                    }}
                    className="min-w-fit bg-popover p-8"
                />
                {mediaImage ? (
                    <div className="flex items-center gap-x-2 rounded-md border bg-background p-2">
                        <ImageDisplay
                            className="size-14 rounded-lg"
                            src={mediaImage.downloadURL}
                        />
                        <div className="grow space-y-1 text-xs">
                            <p>{mediaImage.fileName}</p>
                            <p className="text-muted-foreground/70">
                                {formatBytes(mediaImage.fileSize)}
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
                            (placeholder ?? 'Upload Signature')
                        )}
                        <DisplayIcon className="shrink-0 text-muted-foreground/80" />
                    </Button>
                )}
            </div>
        )
    }
)

SignatureUploadField.displayName = 'SignatureUploadField'
