import { useCallback, useEffect, useRef, useState } from 'react'

import { toast } from 'sonner'

import { dataUrlToFile } from '@/helpers/common-helper'
import { cn } from '@/helpers/tw-utils'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { useSignature } from '@/store/signature-store'
import { format } from 'date-fns'
import { FileWithPath } from 'react-dropzone'
import SignaturePad from 'react-signature-canvas'
import Webcam from 'react-webcam'

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'

import {
    CameraIcon,
    DownloadIcon,
    DrawIcon,
    FullscreenExitIcon,
    FullscreenIcon,
    HardDriveUploadIcon,
    SmallBrushIcon,
} from '../icons'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import CaptureSignature from './capture-signature'
import DrawSignature from './draw-signature'
import UploadSignature from './upload-signature'

export interface ISignatureProps {
    className?: string
    hideDownload?: boolean
    disableFullScreen?: boolean
    onSignatureChange?: (signature: File | undefined) => void
}

enum SignatureModes {
    DRAW = 'draw',
    CAPTURE = 'capture',
    UPLOAD = 'upload',
}

type SignatureModeType = SignatureModes

const Signature = ({
    className,
    hideDownload = false,
    disableFullScreen = false,
    onSignatureChange,
}: ISignatureProps) => {
    const [currentMode, setCurrentMode] = useState<SignatureModeType | null>(
        SignatureModes.DRAW
    )
    const signatureRef = useRef<SignaturePad | null>(null)
    const [, setCurrentFile] = useState<FileWithPath | null>()
    const [trimmedData, setTrimmedData] = useState<string | null>('')
    const [isFullScreenMode, setIsFullScreenMode] = useState(false)
    const [isSignaturePadisEmpty, setSignatureIsEmpty] = useState(true)
    const imageRef = useRef<HTMLImageElement | null>(null)
    const camRef = useRef<Webcam>(null)

    const { setFile } = useSignature()
    const { onOpen } = useConfirmModalStore()

    const handleSignaturePicking = (mode: SignatureModeType) => {
        setCurrentMode(mode)
        handleClear()
    }

    const handleOnUploadSignatureFileChange = (file: FileWithPath[]) => {
        setCurrentFile(file[0])
        setFile(file[0])
        onSignatureChange?.(file[0])
    }

    const handleClear = () => {
        setCurrentFile(null)
        setTrimmedData(null)
        handleClearCanvas()
        setSignatureIsEmpty(true)
        onSignatureChange?.(undefined)
    }

    const handleClearCanvas = () => {
        if (signatureRef.current) {
            signatureRef.current.clear()
        }
    }

    const handleGetSignatureTrimmedData = () => {
        if (signatureRef.current) {
            if (signatureRef.current.isEmpty()) {
                toast.warning(
                    'Drawing required: Please create a drawing before rendering.'
                )
                return
            }
            const trimmedData = signatureRef.current
                .getTrimmedCanvas()
                .toDataURL('image/png')

            const convertedData = dataUrlToFile(
                trimmedData,
                `SIGNATURE_PAD_SIGN_${format(new Date(), 'yyyyMMdd_HHmmss')}`
            )
            setSignatureIsEmpty(false)
            setTrimmedData(trimmedData)
            setFile(convertedData)
            onSignatureChange?.(convertedData)
        }
    }

    const captureImage = useCallback(() => {
        if (!camRef.current) return null
        const imageSrc = camRef.current.getScreenshot()
        return imageSrc
    }, [camRef])

    const handleCaptureImage = () => {
        const imageSrc: string | null = captureImage() ?? ''
        setTrimmedData(imageSrc)
        const convertedImageToData = dataUrlToFile(
            imageSrc,
            `SIGNATURE_CAPTURE_${format(new Date(), 'yyyyMMdd_HHmmss')}`
        )
        setFile(convertedImageToData)
        onSignatureChange?.(convertedImageToData)
        if (imageSrc) {
            toast.success('Capture Image')
        }
    }

    const handleDownloadDrawSignature = () => {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        const downloadImage = imageRef?.current

        if (!context) return
        if (!downloadImage) return

        canvas.width = downloadImage.naturalWidth
        canvas.height = downloadImage.naturalHeight

        context.drawImage(downloadImage, 0, 0)

        canvas.toBlob((blob) => {
            if (blob) {
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = 'signature'

                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(url)
            }
        }, 'png')
    }

    const handleIsFullScreenMode = () => {
        if (!isFullScreenMode) {
            document.body.setAttribute('data-scroll-locked', '1')
        } else {
            document.body.removeAttribute('data-scroll-locked')
        }
        setIsFullScreenMode((prev) => !prev)
    }

    const applyScrollLock = (body: HTMLElement) => {
        body.classList.add(
            'with-scroll-bars-hidden',
            'right-scroll-bar-position',
            'width-before-scroll-bar'
        )
        body.setAttribute('data-scroll-locked', '')
    }

    const removeScrollLock = (body: HTMLElement) => {
        body.classList.remove(
            'with-scroll-bars-hidden',
            'right-scroll-bar-position',
            'width-before-scroll-bar'
        )
        body.removeAttribute('data-scroll-locked')
    }

    const onKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            setIsFullScreenMode(false)
        }
    }

    useEffect(() => {
        const body = document.body
        if (isFullScreenMode) {
            applyScrollLock(body)
        } else {
            removeScrollLock(body)
        }
        document.addEventListener('keydown', onKeyPress)
        return () => {
            removeScrollLock(body)
            document.removeEventListener('keydown', onKeyPress)
        }
    }, [isFullScreenMode])

    const isCurrentMode = (mode: SignatureModeType) => {
        return mode === currentMode ? 'bg-secondary' : ''
    }

    return (
        <div
            className={cn(
                'h-fit max-w-xl rounded-lg border bg-background/90 p-4 text-xs backdrop-blur-sm',
                isFullScreenMode
                    ? 'fixed inset-0 left-0 top-0 z-[9999] h-screen w-screen max-w-none bg-background/90 backdrop-blur-sm'
                    : '',
                className
            )}
        >
            <div className={cn('flex h-14 min-h-[50px] w-[183.5px]')}>
                <div
                    className={cn(
                        'flex  w-full justify-between items-center',
                        isFullScreenMode ? 'space-x-2' : 'space-x-1'
                    )}
                >
                    <Button
                        variant={'outline'}
                        className={cn(
                            'text-xs w-full',
                            isCurrentMode(SignatureModes.DRAW)
                        )}
                        onClick={() =>
                            handleSignaturePicking(SignatureModes.DRAW)
                        }
                    >
                        <DrawIcon className="size-4 lg:mr-2" />
                        <span className="hidden lg:block">Draw Signature</span>
                    </Button>
                    <Button
                        variant={'outline'}
                        className={cn(
                            'text-xs w-full',
                            isCurrentMode(SignatureModes.CAPTURE)
                        )}
                        onClick={() =>
                            handleSignaturePicking(SignatureModes.CAPTURE)
                        }
                    >
                        <CameraIcon className="size-4 lg:mr-2" />
                        <span className="hidden lg:block">
                            Capture Signature
                        </span>
                    </Button>
                    <Button
                        variant={'outline'}
                        className={cn(
                            'text-xs w-full',
                            isCurrentMode(SignatureModes.UPLOAD)
                        )}
                        onClick={() =>
                            handleSignaturePicking(SignatureModes.UPLOAD)
                        }
                    >
                        <HardDriveUploadIcon className="size-4 lg:mr-2" />
                        <span className="hidden lg:block">
                            Upload Signature
                        </span>
                    </Button>
                </div>
                <div className="flex w-fit items-center justify-center">
                    {disableFullScreen && (
                        <>
                            {isFullScreenMode ? (
                                <>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    onClick={
                                                        handleIsFullScreenMode
                                                    }
                                                    size={'sm'}
                                                    variant={'ghost'}
                                                >
                                                    <FullscreenIcon
                                                        size={24}
                                                        className="ease-in-out hover:scale-105 hover:cursor-pointer"
                                                    />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="text-xs">
                                                    Exit Full Screen Mode
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </>
                            ) : (
                                <>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    onClick={
                                                        handleIsFullScreenMode
                                                    }
                                                    variant={'ghost'}
                                                >
                                                    <FullscreenExitIcon
                                                        size={24}
                                                        className="ease-in-out hover:scale-105 hover:cursor-pointer"
                                                    />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="text-xs">
                                                    Enter fullscreen mode
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
            <div
                className={cn(
                    'mb-4 flex justify-center',
                    isFullScreenMode ? 'h-[70%]' : 'h-fit'
                )}
            >
                {currentMode === SignatureModes.DRAW && (
                    <DrawSignature
                        isFullScreenMode={isFullScreenMode}
                        signatureRef={signatureRef}
                    />
                )}
                {currentMode === SignatureModes.UPLOAD && (
                    <UploadSignature
                        isFullScreenMode={isFullScreenMode}
                        onFileChange={handleOnUploadSignatureFileChange}
                    />
                )}
                {currentMode === SignatureModes.CAPTURE && (
                    <CaptureSignature camRef={camRef} />
                )}
            </div>
            <Separator className="" />
            {trimmedData && (
                <div className="my-2 w-fit rounded-lg border-[3px] border-primary p-2">
                    <img
                        ref={imageRef}
                        src={trimmedData ?? ''}
                        alt="signature"
                        className="h-auto w-16"
                    ></img>
                </div>
            )}
            <div className="flex space-x-2 py-2">
                {currentMode !== SignatureModes.UPLOAD && (
                    <Button
                        variant={'outline'}
                        className="text-xs"
                        size={'sm'}
                        onClick={handleClear}
                    >
                        <SmallBrushIcon className="mr-2 size-4" />
                        Clear
                    </Button>
                )}
                {currentMode === SignatureModes.DRAW &&
                    isSignaturePadisEmpty && (
                        <>
                            <Button
                                className="text-xs"
                                size={'sm'}
                                onClick={handleGetSignatureTrimmedData}
                            >
                                render
                            </Button>
                        </>
                    )}
                {currentMode === SignatureModes.CAPTURE && (
                    <Button
                        className="text-xs"
                        size={'sm'}
                        onClick={() => {
                            if (trimmedData) {
                                onOpen({
                                    title: 'Replace Captured Image',
                                    description:
                                        'Do you want to replace the current captured image with the new one?',
                                    onConfirm: () => handleCaptureImage(),
                                })
                                return
                            } else {
                                handleCaptureImage()
                            }
                        }}
                    >
                        capture
                    </Button>
                )}
                {currentMode !== SignatureModes.UPLOAD && !hideDownload && (
                    <Button
                        className={cn('text-xs', trimmedData ? '' : 'hidden')}
                        size={'sm'}
                        onClick={handleDownloadDrawSignature}
                    >
                        <DownloadIcon className="mr-2 size-4" />
                        download
                    </Button>
                )}
            </div>
        </div>
    )
}

export default Signature
