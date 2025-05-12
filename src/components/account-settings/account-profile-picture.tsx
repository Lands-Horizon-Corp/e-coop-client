import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { CameraFillIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import ActionTooltip from '@/components/action-tooltip'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import SingleImageUploaderModal from '@/components/single-image-uploader/single-image-uploader-modal'

import { cn } from '@/lib'
import { useUpdateUserSettingsPhoto } from '@/hooks/api-hooks/use-user-settings'

import { IClassProps, IUserBase } from '@/types'

interface Props extends IClassProps {
    user: IUserBase
    onUploadSuccess?: (newUserData: IUserBase) => void
}

const AccountProfilePicture = ({ user, className, onUploadSuccess }: Props) => {
    const [modal, toggleModal] = useState(false)

    const {
        mutate: updateUserProfilePicture,
        isPending: isUpdatingUserProfilePicture,
    } = useUpdateUserSettingsPhoto({
        onSuccess: onUploadSuccess,
    })

    return (
        <div className={cn('relative size-24', className)}>
            <SingleImageUploaderModal
                open={modal}
                onOpenChange={toggleModal}
                title="Update Profile Image"
                singleImageUploadProps={{
                    defaultFileName: `user-${user.id}`,
                    onUploadComplete: (newMediaResource) => {
                        updateUserProfilePicture(newMediaResource)
                        toggleModal(false)
                    },
                }}
            />
            <ImageDisplay
                className="size-full border-4 border-popover shadow-sm"
                src={user.media?.download_url}
                fallback={user.user_name.charAt(0) ?? '-'}
            />
            <ActionTooltip tooltipContent="Change" align="center" side="right">
                <Button
                    variant="secondary"
                    disabled={isUpdatingUserProfilePicture}
                    onClick={() => toggleModal((prev) => !prev)}
                    className="absolute bottom-2 right-2 size-fit rounded-full border border-transparent p-1 hover:border-foreground/20"
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
