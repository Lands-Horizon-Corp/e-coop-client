import { useState } from 'react'

import { cn } from '@/helpers/tw-utils'
import { IUserBase } from '@/modules/user/user.types'

import { CameraFillIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import ActionTooltip from '@/components/tooltips/action-tooltip'
import { Button } from '@/components/ui/button'
import SingleImageUploaderModal from '@/components/uploaders/single-image-uploader/single-image-uploader-modal'

import { IClassProps } from '@/types'

import { useUpdateUserProfilePhoto } from '../user-profile.service'

interface Props extends IClassProps {
    user: IUserBase
    onUploadSuccess?: (newUserData: IUserBase) => void
}

const AccountProfilePicture = ({ user, className, onUploadSuccess }: Props) => {
    const [modal, toggleModal] = useState(false)

    const {
        mutate: updateUserProfilePicture,
        isPending: isUpdatingUserProfilePicture,
    } = useUpdateUserProfilePhoto({
        options: {
            onSuccess: onUploadSuccess,
        },
    })

    return (
        <div className={cn('relative size-24', className)}>
            <SingleImageUploaderModal
                onOpenChange={toggleModal}
                open={modal}
                singleImageUploadProps={{
                    defaultFileName: `user-${user.id}`,
                    onUploadComplete: (newMediaResource) => {
                        updateUserProfilePicture({
                            media_id: newMediaResource.id,
                        })
                        toggleModal(false)
                    },
                }}
                title="Update Profile Image"
            />
            <ImageDisplay
                className="size-full border-4 border-popover shadow-sm"
                fallback={user.user_name.charAt(0) ?? '-'}
                src={user.media?.download_url}
            />
            <ActionTooltip align="center" side="right" tooltipContent="Change">
                <Button
                    className="absolute bottom-2 right-2 size-fit rounded-full border border-transparent p-1 hover:border-foreground/20"
                    disabled={isUpdatingUserProfilePicture}
                    onClick={() => toggleModal((prev) => !prev)}
                    variant="secondary"
                >
                    {isUpdatingUserProfilePicture ? (
                        <LoadingSpinner />
                    ) : (
                        <CameraFillIcon className="size-4 opacity-50 duration-300 ease-in-out group-hover:opacity-80" />
                    )}
                </Button>
            </ActionTooltip>
        </div>
    )
}

export default AccountProfilePicture
