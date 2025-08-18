import { forwardRef, useCallback, useState } from 'react'
import { toast } from 'sonner'

import { cn } from '@/helpers/tw-utils'
import Webcam from 'react-webcam'

import ActionTooltip from '@/components/action-tooltip'
import {
    CameraFlipIcon,
    CameraOffIcon,
    CameraSelectIcon,
} from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'

import { IClassProps } from '@/types'

import CameraDevicePicker from './camera-device-picker'

interface Props extends IClassProps {}

const WebCam = forwardRef<Webcam, Props>(({ className }: Props, ref) => {
    const [camActive, setCamActive] = useState(false)
    const [camId, setCamId] = useState<string | undefined>(undefined)
    const [error, setError] = useState<string | DOMException | null>(null)
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')

    const handleOnStream = useCallback(() => {
        setError(null)
        setCamActive(true)
    }, [])

    return (
        <div
            className={cn(
                'relative mx-4 flex min-h-64 min-w-64 items-center justify-center bg-secondary dark:bg-background',
                className
            )}
        >
            {(error || !camActive) && (
                <span
                    className={cn(
                        'pointer-events-none absolute left-1/2 z-30 -translate-x-1/2 opacity-0 duration-300',
                        !camActive && 'opacity-100'
                    )}
                >
                    {!error ? (
                        <LoadingSpinner />
                    ) : (
                        <CameraOffIcon
                            className="size-24 text-secondary-foreground/30 dark:text-secondary"
                            strokeWidth={1}
                        />
                    )}
                </span>
            )}
            <div
                className={cn(
                    'relative max-h-none w-full max-w-full opacity-0 duration-200 ease-in-out',
                    camActive && 'opacity-100'
                )}
            >
                <div className="overflow-hidden rounded-xl">
                    <Webcam
                        ref={ref}
                        id={camId}
                        audio={false}
                        disablePictureInPicture
                        screenshotFormat="image/jpeg"
                        videoConstraints={{
                            facingMode,
                            deviceId: camId,
                        }}
                        onUserMediaError={(e) => {
                            setError(e)
                            setCamActive(false)
                            toast.error(
                                (e instanceof DOMException ? e.message : e) +
                                    '. Try reopening camera'
                            )
                        }}
                        onUserMedia={handleOnStream}
                    />
                </div>
            </div>
            <div className="absolute bottom-2 right-2 flex items-center gap-x-2">
                <ActionTooltip
                    side="left"
                    tooltipContent={`switch to ${facingMode === 'user' ? 'back camera' : 'front camera'}`}
                >
                    <Button
                        disabled={!camActive}
                        onClick={() => {
                            setFacingMode((prev) =>
                                prev === 'user' ? 'environment' : 'user'
                            )
                            setCamActive(false)
                        }}
                        variant="secondary"
                        className="size-fit rounded-full p-2"
                    >
                        <CameraFlipIcon className="size-4" />
                    </Button>
                </ActionTooltip>
                <CameraDevicePicker
                    currentCamId={camId}
                    onPick={(pickedId) => {
                        setError(null)
                        setCamActive(false)
                        setCamId(pickedId)
                    }}
                >
                    <ActionTooltip side="left" tooltipContent="Change Camera">
                        <Button
                            variant="secondary"
                            className={cn('size-fit rounded-full p-2')}
                        >
                            <CameraSelectIcon className="size-4" />
                        </Button>
                    </ActionTooltip>
                </CameraDevicePicker>
            </div>
        </div>
    )
})

export default WebCam
