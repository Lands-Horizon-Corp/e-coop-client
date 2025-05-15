import { toast } from 'sonner'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import ImageDisplay from '@/components/image-display'
import { SignaturePickerUploaderModal } from '@/components/signature/signature-picker-uploader'
import SingleImageUploaderModal from '@/components/single-image-uploader/single-image-uploader-modal'
import { useUpdateMemberProfilePhotoSignature } from '@/hooks/api-hooks/member/use-member-profile-settings'

import { IMemberProfile } from '@/types'

type Props = {
    memberProfile: IMemberProfile
    onUpdate?: (newMemberProfile: IMemberProfile) => void
}

const MemberPictureSignature = ({
    memberProfile: { id, signature_media, media },
    onUpdate,
}: Props) => {
    const [open, setOpen] = useState(false)
    const [openSignature, setOpenSignature] = useState(false)

    const { mutate } = useUpdateMemberProfilePhotoSignature({
        onSuccess: onUpdate,
    })

    return (
        <div className="flex gap-4">
            <div className="space-y-2">
                <p>Photo</p>
                <div>
                    <SingleImageUploaderModal
                        open={open}
                        title="Upload photo"
                        onOpenChange={setOpen}
                        singleImageUploadProps={{
                            defaultImage: media?.download_url,
                            onUploadComplete: (media) =>
                                mutate({
                                    memberId: id,
                                    data: { media_id: media.id },
                                }),
                        }}
                    />
                    <ImageDisplay
                        src={media?.download_url}
                        className="size-28 rounded-md"
                    />
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setOpen(true)}
                    >
                        {media?.download_url ? 'Change' : 'Upload'}
                    </Button>
                </div>
            </div>
            <div className="space-y-2">
                <p>Signature</p>
                <div>
                    <SignaturePickerUploaderModal
                        title="Upload Signature"
                        description="Create, Capture or Upload your signature."
                        open={openSignature}
                        onOpenChange={setOpenSignature}
                        signatureUploadProps={{
                            onSignatureUpload: (media) => {
                                toast.success(
                                    `Signature Uploaded ${media.file_name} with ID: ${media.id}`
                                )
                                mutate(
                                    {
                                        memberId: id,
                                        data: { signature_media_id: media.id },
                                    },
                                    {
                                        onSuccess: () =>
                                            setOpenSignature(false),
                                    }
                                )
                            },
                        }}
                        className="min-w-fit bg-popover p-8"
                    />
                    <ImageDisplay
                        src={signature_media?.download_url}
                        className="size-28 rounded-md"
                    />
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setOpenSignature(true)}
                    >
                        {media?.download_url ? 'Change' : 'Upload'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default MemberPictureSignature
