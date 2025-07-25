import { ReactElement, forwardRef, useState } from 'react'

import { cn } from '@/lib'

import { SignatureLightIcon, XIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { Button, ButtonProps } from '@/components/ui/button'

import { IMedia } from '@/types'

import { SignaturePickerUploaderModal } from '../signature/signature-picker-uploader'

interface SignatureFieldProps extends Omit<ButtonProps, 'onChange'> {
    name?: string
    value?: string
    placeholder?: string
    displayComponent?: (value?: string) => ReactElement
    onChange?: (media: IMedia | undefined) => void
}

const SignatureField = forwardRef<HTMLButtonElement, SignatureFieldProps>(
    ({ value, placeholder, onChange, ...props }, ref) => {
        const [open, setOpen] = useState(false)

        return (
            <>
                <SignaturePickerUploaderModal
                    open={open}
                    title="Upload"
                    onOpenChange={setOpen}
                    signatureUploadProps={{
                        onSignatureUpload: (media) => {
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
                        'has-disabled:pointer-events-none has-disabled:opacity-50 darkx:bg-popover/80x relative flex h-52 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-primary/60 bg-primary/5 p-4 transition-colors hover:border-foreground hover:bg-primary/10 has-[img]:border-none has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 dark:border-input',
                        value &&
                            'ring ring-ring/40 ring-offset-1 dark:ring-muted-foreground/20'
                    )}
                >
                    {value ? (
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute left-0 top-0 size-full cursor-default"
                        >
                            <ImageDisplay
                                src={value}
                                className={cn(
                                    'block size-full rounded-none',
                                    value && 'dark:bg-background/75'
                                )}
                            />
                            <Button
                                size="icon"
                                type="button"
                                variant="secondary"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onChange?.(undefined)
                                }}
                                className="absolute right-2 top-2 size-fit rounded-full p-1.5"
                            >
                                <XIcon className="size-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center">
                            <div className="mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background">
                                <SignatureLightIcon />
                            </div>
                            {placeholder}
                        </div>
                    )}
                </Button>
            </>
        )
    }
)

export default SignatureField
