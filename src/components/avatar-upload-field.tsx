import { toast } from 'sonner'
import { useState, forwardRef } from 'react'

import { Button } from '@/components/ui/button'
import { CameraFillIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import ActionTooltip from '@/components/action-tooltip'
import SingleImageUploaderModal from '@/components/single-image-uploader/single-image-uploader-modal'

import { IMedia, TEntityId } from '@/types'

export interface AvatarUploadFieldProps {
    id?: string
    name?: string
    value?: TEntityId
    placeholder?: string
    description?: string
    mediaImage?: IMedia | undefined
    onChange?: (media: IMedia | undefined) => void
}

export const AvatarUploadField = forwardRef<
    HTMLButtonElement,
    AvatarUploadFieldProps
>(({ mediaImage, description, onChange }, ref) => {
    const [uploaderModal, setUploaderModal] = useState(false)

    return (
        <div className="mx-auto flex justify-start">
            <SingleImageUploaderModal
                title="Upload Avatar"
                description={
                    description ??
                    'Choose/Upload an avatar image. You may also capture using camera.'
                }
                open={uploaderModal}
                onOpenChange={setUploaderModal}
                singleImageUploadProps={{
                    onUploadComplete: (media: IMedia) => {
                        toast.success(
                            `Avatar Uploaded ${media.file_name} with ID: ${media.id}`
                        )
                        onChange?.({
                            ...media,
                            id: '550e8400-e29b-41d4-a716-446655440000',
                        })
                        setUploaderModal(false)
                    },
                    defaultImage: mediaImage?.download_url,
                }}
                className="max-w-xl bg-popover p-8"
            />
            <div className="relative flex size-fit items-center">
                <ImageDisplay
                    className="size-20 rounded-lg border-4 border-popover shadow-sm"
                    src={mediaImage?.download_url}
                />
                <ActionTooltip
                    tooltipContent="Change"
                    align="center"
                    side="right"
                >
                    <Button
                        ref={ref}
                        variant="secondary"
                        onClick={() => setUploaderModal((val) => !val)}
                        className="absolute bottom-2 right-2 size-fit rounded-full border border-transparent p-1 hover:border-foreground/20"
                    >
                        <CameraFillIcon className="size-4 opacity-50 duration-300 ease-in-out group-hover:opacity-80" />
                    </Button>
                </ActionTooltip>
            </div>
        </div>
    )
})

AvatarUploadField.displayName = 'AvatarUploadField'
