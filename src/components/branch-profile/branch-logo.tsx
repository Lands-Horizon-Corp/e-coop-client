import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { CameraFillIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import ActionTooltip from '@/components/action-tooltip'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import SingleImageUploaderModal from '@/components/single-image-uploader/single-image-uploader-modal'

import { cn } from '@/lib'
import { IClassProps } from '@/types'
import { IBranch } from '@/types'
import { useUpdateBranchProfilePicture } from '@/hooks/api-hooks/use-branch'

interface Props extends IClassProps {
    branch: IBranch
    imageDisplayClassName?: string
    disableUploadButton?: boolean
    uploadButtonClassName?: string
}

const BranchLogo = ({
    branch,
    className,
    disableUploadButton,
    uploadButtonClassName,
    imageDisplayClassName,
}: Props) => {
    const [modal, toggleModal] = useState(false)

    const {
        mutate: updateBranchProfile,
        isPending: isUpdatingBranchProfilePicture,
    } = useUpdateBranchProfilePicture({})

    return (
        <div className={cn('relative size-36', className)}>
            <SingleImageUploaderModal
                open={modal}
                onOpenChange={toggleModal}
                title="Update Branch Image"
                singleImageUploadProps={{
                    defaultFileName: `branch-${branch.id}`,
                    onUploadComplete: (newMediaResource) => {
                        updateBranchProfile({
                            branchId: branch.id,
                            mediaResource: newMediaResource,
                        })
                        toggleModal(false)
                    },
                }}
            />
            <ImageDisplay
                className={cn(
                    'size-full border-4 border-popover shadow-sm',
                    imageDisplayClassName
                )}
                src={branch.media?.downloadURL}
            />
            {!disableUploadButton && (
                <ActionTooltip
                    tooltipContent="Change"
                    align="center"
                    side="right"
                >
                    <Button
                        variant="secondary"
                        disabled={isUpdatingBranchProfilePicture}
                        onClick={() => toggleModal((prev) => !prev)}
                        className={cn(
                            'absolute bottom-[2%] right-[2%] size-[30%] rounded-full border border-transparent p-1 hover:border-foreground/20',
                            uploadButtonClassName
                        )}
                    >
                        {isUpdatingBranchProfilePicture ? (
                            <LoadingSpinner />
                        ) : (
                            <CameraFillIcon className="size-[70%] opacity-50 duration-300 ease-in-out group-hover:opacity-80" />
                        )}
                    </Button>
                </ActionTooltip>
            )}
        </div>
    )
}

export default BranchLogo
