import { useCallback, useRef } from 'react'

import { toast } from 'sonner'

import Webcam from 'react-webcam'

import { CameraFillIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import WebCam from '@/components/webcam'

import PictureDrop from './picture-drop'

interface Props {
    onPhotoChoose: (imageBase64: string) => void
}

const SingleImageUploadOption = ({ onPhotoChoose }: Props) => {
    const webcamRef = useRef<Webcam>(null)

    const onFileSelect = (files: FileList) => {
        if (files && files.length > 0) {
            const reader = new FileReader()
            reader.addEventListener('load', () => {
                const newImgUrl = reader.result?.toString() ?? ''
                onPhotoChoose(newImgUrl)
            })
            reader.readAsDataURL(files?.[0])
        }
    }

    const handleCameraCapture = useCallback(() => {
        if (!webcamRef || !webcamRef.current) return
        const imageSrc = webcamRef.current.getScreenshot()

        if (!imageSrc) {
            toast.error('Sorry, Failed to capture image.')
            return
        }

        onPhotoChoose(imageSrc)
    }, [webcamRef, onPhotoChoose])

    return (
        <Tabs
            defaultValue="file-choose"
            className="flex flex-col justify-center"
        >
            <TabsList className="w-fit bg-transparent">
                <TabsTrigger value="file-choose">Choose File</TabsTrigger>
                <TabsTrigger value="camera-capture">Camera</TabsTrigger>
            </TabsList>
            <TabsContent value="file-choose">
                <PictureDrop onFileSelect={onFileSelect} />
            </TabsContent>
            <TabsContent
                value="camera-capture"
                className="flex flex-col justify-center gap-y-4 p-0"
            >
                <WebCam ref={webcamRef} className="rounded-2xl" />
                <Button
                    size="icon"
                    onClick={handleCameraCapture}
                    className="mx-auto size-fit rounded-full p-2"
                >
                    <CameraFillIcon className="size-5" />
                </Button>
            </TabsContent>
        </Tabs>
    )
}

export default SingleImageUploadOption
