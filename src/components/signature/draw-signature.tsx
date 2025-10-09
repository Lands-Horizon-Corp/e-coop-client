import { MutableRefObject, useEffect, useRef, useState } from 'react'

import { cn } from '@/helpers/tw-utils'
import ReactSignatureCanvas from 'react-signature-canvas'

interface DrawSignatureProps {
    signatureRef: MutableRefObject<ReactSignatureCanvas | null>
    isFullScreenMode: boolean
}

const DrawSignature = ({
    signatureRef,
    isFullScreenMode,
}: DrawSignatureProps) => {
    const SignaturePadParent = useRef<HTMLDivElement | null>(null)
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

    useEffect(() => {
        const updateDimensions = () => {
            if (SignaturePadParent.current) {
                const { width, height } =
                    SignaturePadParent.current.getBoundingClientRect()
                setDimensions({ width, height })
            }
        }

        updateDimensions()
        window.addEventListener('resize', updateDimensions)

        return () => window.removeEventListener('resize', updateDimensions)
    }, [isFullScreenMode])

    return (
        <div
            className={cn('w-full', isFullScreenMode ? 'h-full' : 'h-[300px]')}
            ref={SignaturePadParent}
        >
            <ReactSignatureCanvas
                canvasProps={{
                    className:
                        'sigCanvas w-full h-full rounded-lg border dark:bg-secondary',
                    width: dimensions.width,
                    height: dimensions.height,
                }}
                clearOnResize={true}
                ref={signatureRef}
                velocityFilterWeight={isFullScreenMode ? 0 : 0.9}
            />
        </div>
    )
}

export default DrawSignature
