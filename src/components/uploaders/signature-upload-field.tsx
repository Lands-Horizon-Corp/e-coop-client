import { forwardRef, useState } from 'react'

import { toast } from 'sonner'

import { cn } from '@/helpers/tw-utils'
import { IMedia } from '@/modules/media'
import { IconType } from 'react-icons/lib'

import { ImageIcon, TrashIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { SignaturePickerUploaderModal } from '@/components/signature/signature-picker-uploader'
import { Button } from '@/components/ui/button'

import { IClassProps, TEntityId } from '@/types'

export interface SignatureUploadField extends IClassProps {
    id?: string
    name?: string
    value?: TEntityId
    disabled?: boolean
    placeholder?: string
    DisplayIcon?: IconType
    mediaImage?: IMedia | undefined
    onChange?: (media: IMedia | undefined) => void
}

export const SignatureUploadField = forwardRef<
    HTMLButtonElement,
    SignatureUploadField
>(
    (
        {
            className,
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
            <>
                <SignaturePickerUploaderModal
                    className="min-w-fit bg-popover p-8"
                    description="Create,Capture or Upload your signature."
                    onOpenChange={setUploaderModal}
                    open={uploaderModal}
                    signatureUploadProps={{
                        onSignatureUpload: (media) => {
                            toast.success(
                                `Signature Uploaded ${media.file_name}`
                            )
                            onChange?.(media)
                            setUploaderModal(false)
                        },
                    }}
                    title="Upload Signature"
                />
                <div className={cn('flex items-end gap-x-1', className)}>
                    <ImageDisplay
                        className="size-20 rounded-lg border-4 border-popover"
                        src={mediaImage?.download_url}
                    />
                    <Button
                        onClick={() => {
                            setUploaderModal(true)
                        }}
                        ref={ref}
                        size="sm"
                        type="button"
                        variant="outline"
                        {...other}
                        className="relative flex !h-full max-h-none w-full grow items-center justify-between gap-x-2 rounded-md border bg-background p-2"
                    >
                        {mediaImage ? (
                            <>
                                {mediaImage.file_name ?? 'unknown file'}
                                <Button
                                    className="size-fit p-1"
                                    hoverVariant="destructive"
                                    onClick={(e) => {
                                        onChange?.(undefined)
                                        e.stopPropagation()
                                    }}
                                    size="icon"
                                    type="button"
                                    variant="secondary"
                                >
                                    <TrashIcon />
                                </Button>
                            </>
                        ) : (
                            <>
                                {placeholder}
                                <DisplayIcon className="shrink-0 text-muted-foreground/80" />
                            </>
                        )}
                    </Button>
                </div>
            </>
        )
    }
)

SignatureUploadField.displayName = 'SignatureUploadField'
