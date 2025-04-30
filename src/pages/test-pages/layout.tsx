import MainMapContainer from '@/components/map'
// import Signature from '@/components/signature'
// import { SignaturePickerUploaderModal } from '@/components/signature/signature-picker-uploader'
import { Button } from '@/components/ui/button'
import FileUploader from '@/components/ui/file-uploader'
import { useImagePreview } from '@/store/image-preview-store'
import { Outlet } from '@tanstack/react-router'
import { LatLngExpression } from 'leaflet'
import { useState } from 'react'
// import { toast } from 'sonner'

const TestLayout = () => {
    const defaultCenter: LatLngExpression = [14.5995, 120.9842]
    const defaultZoom = 13
    const [, setFiles] = useState<File[]>([])

    const handleFileChange = (newFiles: File[]) => {
        setFiles((prevFiles) => [...prevFiles, ...newFiles])
    }
    // if wanted to use current Position or List of Markers
    // const [, setUploaderModal] = useState(false)
    const { onOpen } = useImagePreview()

    return (
        <>
            <Button
                onClick={() =>
                    onOpen({
                        Images: [
                            {
                                id: '550e8400-e29b-41d4-a716-446655440000',
                                fileName: 'test.png',
                                fileType: 'image/png',
                                fileSize: 123456,
                                url: 'https://images.pexels.com/photos/29169818/pexels-photo-29169818/free-photo-of-silhouette-of-man-at-vibrant-beach-sunset.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
                                // url:'https://images.pexels.com/photos/28783283/pexels-photo-28783283/free-photo-of-empty-classroom-with-unique-wooden-desks.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
                                createdAt: new Date() as unknown as string,
                                updatedAt: new Date() as unknown as string,
                                storageKey: 'test.png',
                                bucketName: 'test-bucket',
                                downloadURL:
                                    'https://images.pexels.com/photos/29418161/pexels-photo-29418161/free-photo-of-professional-portrait-of-confident-young-woman.jpeg?auto=compress&cs=tinysrgb&w=1200',
                            },
                            {
                                id: '550e8400-e29b-41d4-a716-446655440001',
                                fileName: 'test.png',
                                fileType: 'image/png',
                                fileSize: 123456,
                                url: 'https://images.pexels.com/photos/31560258/pexels-photo-31560258/free-photo-of-young-man-in-colorful-casual-outfit-with-cap.jpeg?auto=compress&cs=tinysrgb&w=1200',
                                createdAt: new Date() as unknown as string,
                                updatedAt: new Date() as unknown as string,
                                storageKey: 'test.png',
                                bucketName: 'test-bucket',
                                downloadURL:
                                    'https://images.pexels.com/photos/31560258/pexels-photo-31560258/free-photo-of-young-man-in-colorful-casual-outfit-with-cap.jpeg?auto=compress&cs=tinysrgb&w=1200',
                            },
                        ],
                    })
                }
            >
                preview
            </Button>
            {/* <SignaturePickerUploaderModal
                title="Upload Signature"
                description="Create,Capture or Upload your signature."
                open={false}
                onOpenChange={setUploaderModal}
                signatureUploadProps={{
                    onSignatureUpload: (media) => {
                        toast.success(
                            `Signature Uploaded ${media.fileName} with ID: ${media.id}`
                        )
                        //   onChange?.({
                        //     ...media,
                        //   id: '550e8400-e29b-41d4-a716-446655440000',
                        //})
                        setUploaderModal(false)
                    },
                }}
                className="min-w-fit bg-popover p-8"
            /> */}
            <div className="mx-auto hidden h-[100vh] w-[80%] flex-col">
                <FileUploader
                    // maxFiles={1}
                    accept={{
                        'image/png': ['.png'],
                        'image/jpeg': ['.jpg', '.jpeg'],
                    }}
                    onFileChange={handleFileChange}
                />
                <MainMapContainer
                    center={defaultCenter}
                    zoom={defaultZoom}
                    className="flex-grow !p-0"
                    // onMultipleCoordinatesChange={(coor)=> console.log(coor)}
                    // viewOnly
                    hideControls
                    //  multiplePins
                    // viewOnly
                />
                <Outlet />
                {/* <Signature disableFullScreen /> */}
            </div>
        </>
    )
}

export default TestLayout
