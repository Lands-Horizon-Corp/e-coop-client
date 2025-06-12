import { toast } from 'sonner'
import { IconType } from 'react-icons/lib'
import { useState, forwardRef } from 'react'

import { Button } from '@/components/ui/button'
import ImageDisplay from '@/components/image-display'
import { ImageIcon, TrashIcon } from '@/components/icons'
import { SignaturePickerUploaderModal } from '@/components/signature/signature-picker-uploader'

import { IClassProps, IMedia, TEntityId } from '@/types'
import { cn } from '@/lib'

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
                    title="Upload Signature"
                    description="Create,Capture or Upload your signature."
                    open={uploaderModal}
                    onOpenChange={setUploaderModal}
                    signatureUploadProps={{
                        onSignatureUpload: (media) => {
                            toast.success(
                                `Signature Uploaded ${media.file_name}`
                            )
                            onChange?.(media)
                            setUploaderModal(false)
                        },
                    }}
                    className="min-w-fit bg-popover p-8"
                />
                <div className={cn('flex items-end gap-x-1', className)}>
                    <ImageDisplay
                        className="size-20 rounded-lg border-4 border-popover"
                        src={mediaImage?.download_url}
                    />
                    <Button
                        ref={ref}
                        size="sm"
                        type="button"
                        onClick={() => {
                            setUploaderModal(true)
                        }}
                        variant="outline"
                        {...other}
                        className="relative flex !h-full max-h-none w-full grow items-center justify-between gap-x-2 rounded-md border bg-background p-2"
                    >
                        {mediaImage ? (
                            <>
                                {mediaImage.file_name ?? 'unknown file'}
                                <Button
                                    size="icon"
                                    type="button"
                                    variant="secondary"
                                    hoverVariant="destructive"
                                    className="size-fit p-1"
                                    onClick={(e) => {
                                        onChange?.(undefined)
                                        e.stopPropagation()
                                    }}
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
