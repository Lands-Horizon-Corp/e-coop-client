import { cn } from '@/helpers/tw-utils'

import FileUploader from '../ui/file-uploader'

interface UploadSignatureProps {
    onFileChange: (files: File[]) => void
    isFullScreenMode: boolean
}

const UploadSignature = ({
    onFileChange,
    isFullScreenMode,
}: UploadSignatureProps) => {
    return (
        <FileUploader
            accept={{
                'image/png': ['.png'],
                'image/jpeg': ['.jpg', '.jpeg'],
            }}
            className={cn(
                '!mx-0 w-full',
                isFullScreenMode ? 'h-full' : 'h-fit'
            )}
            maxFiles={1}
            onFileChange={onFileChange}
        />
    )
}

export default UploadSignature
