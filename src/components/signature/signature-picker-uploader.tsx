import { useMemo, useState } from 'react'

import { calculateUploadProgress } from '@/helpers/axios-helpers/axios-progress-helper'
import { IMedia, useUploadMedia } from '@/modules/media'

import Signature from '.'
import ImageDisplay from '../image-display'
import Modal, { IModalProps } from '../modals/modal'
import LoadingSpinner from '../spinners/loading-spinner'
import { Button } from '../ui/button'
import FileItem from '../uploaders/file-item'

interface Props {
    onSignatureUpload: (signatureMedia: IMedia) => void
}

const SignaturePickerUploader = ({ onSignatureUpload }: Props) => {
    const [eta, setEta] = useState('')
    const [progress, setProgress] = useState(0)
    const [file, setFile] = useState<File | undefined>(undefined)

    const objectUrl = useMemo(
        () => (file ? URL.createObjectURL(file) : undefined),
        [file]
    )

    const { isPending: isUploading, mutate: uploadSignature } = useUploadMedia({
        options: {
            onSuccess: (media) => {
                onSignatureUpload?.(media)
            },
        },
        onProgress: (progressEvent) => {
            const calculated = calculateUploadProgress(progressEvent)
            if (!calculated) return

            setProgress(calculated.progress)
            setEta(calculated.etaFormatted)
        },
    })

    return (
        <div className="space-y-2">
            {file ? (
                <>
                    <ImageDisplay
                        fallbackClassName="rounded-none"
                        imageClassName="object-contain rounded-none"
                        className="min-h-60 w-full rounded-lg border !bg-white"
                        src={objectUrl}
                    />
                    <FileItem
                        file={file}
                        onRemoveFile={() => setFile(undefined)}
                        uploadDetails={{ eta, progress, isUploading }}
                    />
                    <Button
                        type="button"
                        disabled={isUploading}
                        onClick={() => uploadSignature({ file })}
                        className="w-full"
                    >
                        {isUploading ? <LoadingSpinner /> : 'Upload Signature'}
                    </Button>
                </>
            ) : (
                <>
                    <Signature
                        hideDownload
                        className=" border-0 bg-transparent p-0"
                        onSignatureChange={(signature) => setFile(signature)}
                    />
                </>
            )}
        </div>
    )
}

export const SignaturePickerUploaderModal = ({
    signatureUploadProps,
    ...other
}: IModalProps & { signatureUploadProps: Props }) => {
    return (
        <Modal {...other}>
            <SignaturePickerUploader {...signatureUploadProps} />
        </Modal>
    )
}

export default SignaturePickerUploader
