import { ReactElement, forwardRef, useState } from 'react'

import { cn } from '@/helpers/tw-utils'
import { IMedia } from '@/modules/media'

import { ImageIcon, UploadIcon, XIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import SingleImageUploaderModal from '@/components/single-image-uploader/single-image-uploader-modal'
import { Button, ButtonProps } from '@/components/ui/button'

import { IClassProps } from '@/types'

interface ImageFieldProps extends Omit<ButtonProps, 'onChange'>, IClassProps {
    name?: string
    value?: string
    placeholder?: string
    displayComponent?: (value?: string) => ReactElement
    onChange?: (media: IMedia | undefined) => void
    isFieldView?: boolean
}

const ImageField = forwardRef<HTMLButtonElement, ImageFieldProps>(
    (
        {
            value,
            placeholder,
            className,
            onChange,
            isFieldView = false,
            ...props
        },
        ref
    ) => {
        const [open, setOpen] = useState(false)

        return (
            <>
                <SingleImageUploaderModal
                    onOpenChange={setOpen}
                    open={open}
                    singleImageUploadProps={{
                        disableCrop: true,
                        squarePreview: true,
                        defaultImage: value,
                        onUploadComplete: (media) => {
                            onChange?.(media)
                            setOpen(false)
                        },
                    }}
                    title="Upload"
                />
                <Button
                    ref={ref}
                    {...props}
                    className={cn(
                        'has-disabled:pointer-events-none has-disabled:opacity-50 relative flex h-52 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-primary/60 bg-primary/5 p-4 transition-colors hover:border-foreground hover:bg-primary/20 dark:border-primary/20 dark:bg-background/40',
                        value &&
                            'border-none border-ring ring-2 ring-muted-foreground/20 ring-offset-1',
                        className
                    )}
                    onClick={() => setOpen(true)}
                    role="button"
                    size="nostyle"
                    type="button"
                    variant="nostyle"
                >
                    {value ? (
                        <div
                            className="absolute left-0 top-0 size-full cursor-default"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ImageDisplay
                                className="block size-full rounded-none"
                                src={value}
                            />
                            <span
                                className="absolute right-2 top-2 block size-fit cursor-pointer rounded-full bg-secondary p-1.5 duration-300 ease-out hover:bg-secondary/70"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onChange?.(undefined)
                                }}
                            >
                                <XIcon className="size-4" />
                            </span>
                        </div>
                    ) : (
                        <>
                            {isFieldView ? (
                                <div className="flex items-center   ">
                                    upload photo <UploadIcon className="ml-2" />
                                </div>
                            ) : (
                                <div className="flex flex-1 flex-col items-center justify-center">
                                    <div className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background">
                                        <ImageIcon />
                                    </div>
                                    {placeholder}
                                </div>
                            )}
                        </>
                    )}
                </Button>
            </>
        )
    }
)

export default ImageField
