import { useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { toast } from 'sonner'

import { withCatchAsync } from '@/helpers/function-utils'
import { getCroppedImg } from '@/helpers/picture-crop-helper'
import { cn } from '@/helpers/tw-utils'

import {
    FlipHorizontalIcon,
    FlipHorizontalLineIcon,
    FlipVerticalIcon,
    FlipVerticalLineIcon,
    Rotate90DegreeLeftIcon,
    Rotate90DegreeRightIcon,
    RotateBoxLeftIcon,
    RotateBoxRightIcon,
    ZoomInIcon,
    ZoomOutIcon,
} from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import ActionTooltip from '@/components/tooltips/action-tooltip'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

import { IClassProps } from '@/types'

interface Props extends IClassProps {
    image: string
    onCancel: () => void
    onCrop: (cropResult: string) => void
}

const PictureCrop = ({ image, onCancel, onCrop }: Props) => {
    const [zoom, setZoom] = useState(1)
    const [rotation, setRotation] = useState(0)
    const [loading, setLoading] = useState(false)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [cropArea, setCropArea] = useState<Area | null>(null)

    const [flipVertical, setFlipVertical] = useState(false)
    const [flipHorizontal, setFlipHorizontal] = useState(false)

    const reset = () => {
        setZoom(1)
        setRotation(0)
        setCrop({ x: 0, y: 0 })
        setCropArea(null)
    }

    const handleCrop = async () => {
        if (!cropArea) return

        setLoading(true)

        const [error, croppedImageResult] = await withCatchAsync(
            getCroppedImg(image, cropArea, rotation, {
                horizontal: flipHorizontal,
                vertical: flipVertical,
            })
        )

        setLoading(false)

        if (error) {
            toast.error(error.message)
            return
        }

        onCrop(croppedImageResult)
    }

    return (
        <div className="flex flex-col gap-y-2">
            <div className="relative h-[50vh] w-full overflow-clip rounded-2xl bg-background">
                <Cropper
                    crop={crop}
                    zoom={zoom}
                    image={image}
                    zoomWithScroll
                    aspect={1 / 1}
                    zoomSpeed={0.3}
                    showGrid={false}
                    cropShape="rect"
                    rotation={rotation}
                    onZoomChange={setZoom}
                    onCropChange={setCrop}
                    onCropComplete={(_, cropAreaPixel) =>
                        setCropArea(cropAreaPixel)
                    }
                    onRotationChange={setRotation}
                    transform={[
                        `translate(${crop.x}px, ${crop.y}px)`,
                        `rotateZ(${rotation}deg)`,
                        `rotateY(${flipHorizontal ? 180 : 0}deg)`,
                        `rotateX(${flipVertical ? 180 : 0}deg)`,
                        `scale(${zoom})`,
                    ].join(' ')}
                />
                <p className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-md bg-popover/50 p-1 text-xs text-popover-foreground backdrop-blur">
                    {`${cropArea?.width.toLocaleString(undefined, { maximumFractionDigits: 1 }) ?? 0} x ${cropArea?.height.toLocaleString(undefined, { maximumFractionDigits: 1 }) ?? 0} rotate: ${rotation}°`}
                </p>
            </div>
            <fieldset
                disabled={loading}
                className={cn(
                    'space-y-2 rounded-2xl bg-background p-4 text-foreground/60',
                    loading && 'cursor-not-allowed'
                )}
            >
                <div className="flex items-center justify-between">
                    <p className="text-sm">Adjustment</p>
                    <Button variant="ghost" size="sm" onClick={() => reset()}>
                        Reset
                    </Button>
                </div>
                <div className="flex items-center justify-center gap-x-2">
                    <ActionTooltip tooltipContent="Flip Horizontal">
                        <Button
                            onClick={() => setFlipHorizontal((val) => !val)}
                            size="icon"
                            variant="ghost"
                        >
                            {flipHorizontal ? (
                                <FlipHorizontalIcon />
                            ) : (
                                <FlipHorizontalLineIcon />
                            )}
                        </Button>
                    </ActionTooltip>
                    <ActionTooltip tooltipContent="Flip Vertical">
                        <Button
                            onClick={() => setFlipVertical((val) => !val)}
                            size="icon"
                            variant="ghost"
                        >
                            {flipVertical ? (
                                <FlipVerticalIcon />
                            ) : (
                                <FlipVerticalLineIcon />
                            )}
                        </Button>
                    </ActionTooltip>
                    <ActionTooltip tooltipContent="Rotate 90° Left">
                        <Button
                            onClick={() =>
                                setRotation((prev) => {
                                    if (prev - 90 < -360) return 0
                                    return prev - 90
                                })
                            }
                            size="icon"
                            variant="ghost"
                        >
                            <Rotate90DegreeLeftIcon />
                        </Button>
                    </ActionTooltip>
                    <ActionTooltip tooltipContent="Rotate 90° Right">
                        <Button
                            onClick={() =>
                                setRotation((prev) => {
                                    if (prev + 90 > 360) return 0
                                    return prev + 90
                                })
                            }
                            size="icon"
                            variant="ghost"
                        >
                            <Rotate90DegreeRightIcon />
                        </Button>
                    </ActionTooltip>
                </div>
                <div className="group flex items-center gap-x-2">
                    <ZoomOutIcon className="size-4 duration-200 ease-in-out group-hover:text-foreground" />
                    <Slider
                        min={1}
                        max={3}
                        step={0.08}
                        value={[zoom]}
                        disabled={loading}
                        defaultValue={[1]}
                        className="group my-4"
                        trackClassName="h-1"
                        rangeClassName="duration-400 ease-in-out transition-colors bg-primary/50 group-hover:bg-primary/80"
                        thumbClassName="size-4 duration-200 border-primary/50 bg-background shadow"
                        onValueChange={(val) => setZoom(val[0])}
                    />
                    <ZoomInIcon className="size-4 duration-200 ease-in-out group-hover:text-foreground" />
                </div>
                <div className="group flex items-center gap-x-2">
                    <RotateBoxLeftIcon className="size-4 duration-200 ease-in-out group-hover:text-foreground" />
                    <Slider
                        step={1}
                        max={360}
                        min={-360}
                        disabled={loading}
                        value={[rotation]}
                        trackClassName="h-1"
                        className="group my-4"
                        rangeClassName="duration-400 ease-in-out transition-colors bg-primary/50 group-hover:bg-primary/80"
                        thumbClassName="size-4 duration-200 border-primary/50 bg-background"
                        onValueChange={(val) => setRotation(val[0])}
                    />
                    <RotateBoxRightIcon className="size-4 duration-200 ease-in-out group-hover:text-foreground" />
                </div>
            </fieldset>
            <fieldset
                disabled={loading}
                className="flex items-center justify-center gap-x-2"
            >
                <Button
                    variant="ghost"
                    onClick={onCancel}
                    className="rounded-full"
                >
                    Cancel
                </Button>
                <Button onClick={handleCrop} className="rounded-full">
                    {loading ? <LoadingSpinner /> : 'Crop'}
                </Button>
            </fieldset>
        </div>
    )
}

export default PictureCrop
