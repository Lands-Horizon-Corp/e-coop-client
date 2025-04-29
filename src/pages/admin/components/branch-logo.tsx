import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { CameraFillIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import ActionTooltip from '@/components/action-tooltip'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import SingleImageUploaderModal from '@/components/single-image-uploader/single-image-uploader-modal'

import { IClassProps } from '@/types'
import { IBranchResource } from '@/types/coop-types'
import { useUpdateBranchProfilePicture } from '@/hooks/api-hooks/use-branch'

interface Props extends IClassProps {
    branch: IBranchResource
}

const BranchLogo = ({ branch }: Props) => {
    const [modal, toggleModal] = useState(false)

    const {
        mutate: updateBranchProfile,
        isPending: isUpdatingBranchProfilePicture,
    } = useUpdateBranchProfilePicture({})

    return (
        <div className="absolute -top-28 left-4 z-20 size-fit">
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
                className="size-36 border-4 border-popover shadow-sm"
                src={branch.media?.downloadURL}
            />
            <ActionTooltip tooltipContent="Change" align="center" side="right">
                <Button
                    variant="secondary"
                    disabled={isUpdatingBranchProfilePicture}
                    onClick={() => toggleModal((prev) => !prev)}
                    className="absolute bottom-2 right-2 size-fit rounded-full border border-transparent p-1 hover:border-foreground/20"
                >
                    {isUpdatingBranchProfilePicture ? (
                        <LoadingSpinner />
                    ) : (
                        <CameraFillIcon className="size-4 opacity-50 duration-300 ease-in-out group-hover:opacity-80" />
                    )}
                </Button>
            </ActionTooltip>
        </div>
    )
}

export default BranchLogo
