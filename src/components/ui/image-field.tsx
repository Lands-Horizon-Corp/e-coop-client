import { ReactElement, forwardRef, useState } from 'react'

import { cn } from '@/helpers/tw-utils'
import { IMedia } from '@/modules/media'

import { ImageIcon, XIcon } from '@/components/icons'
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
}

const ImageField = forwardRef<HTMLButtonElement, ImageFieldProps>(
    ({ value, placeholder, className, onChange, ...props }, ref) => {
        const [open, setOpen] = useState(false)

        return (
            <>
                <SingleImageUploaderModal
                    open={open}
                    title="Upload"
                    onOpenChange={setOpen}
                    singleImageUploadProps={{
                        disableCrop: true,
                        squarePreview: true,
                        defaultImage: value,
                        onUploadComplete: (media) => {
                            onChange?.(media)
                            setOpen(false)
                        },
                    }}
                />
                <Button
                    ref={ref}
                    {...props}
                    role="button"
                    type="button"
                    size="nostyle"
                    variant="nostyle"
                    onClick={() => setOpen(true)}
                    className={cn(
                        'has-disabled:pointer-events-none has-disabled:opacity-50 relative flex h-52 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-primary/60 bg-primary/5 p-4 transition-colors hover:border-foreground hover:bg-primary/20 dark:border-primary/20 dark:bg-background/40',
                        value &&
                            'border-none border-ring ring-2 ring-muted-foreground/20 ring-offset-1',
                        className
                    )}
                >
                    {value ? (
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute left-0 top-0 size-full cursor-default"
                        >
                            <ImageDisplay
                                className="block size-full rounded-none"
                                src={value}
                            />
                            <span
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onChange?.(undefined)
                                }}
                                className="absolute right-2 top-2 block size-fit cursor-pointer rounded-full bg-secondary p-1.5 duration-300 ease-out hover:bg-secondary/70"
                            >
                                <XIcon className="size-4" />
                            </span>
                        </div>
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center">
                            <div className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background">
                                <ImageIcon />
                            </div>
                            {placeholder}
                        </div>
                    )}
                </Button>
            </>
        )
    }
)

export default ImageField
