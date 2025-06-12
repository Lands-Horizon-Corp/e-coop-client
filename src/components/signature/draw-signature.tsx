import { cn } from '@/lib'
import { useTheme } from '@/providers/theme-provider'
import { useRef, useState, useEffect, MutableRefObject } from 'react'
import ReactSignatureCanvas from 'react-signature-canvas'

interface DrawSignatureProps {
    signatureRef: MutableRefObject<ReactSignatureCanvas | null>
    isFullScreenMode: boolean
}

const DrawSignature = ({
    signatureRef,
    isFullScreenMode,
}: DrawSignatureProps) => {
    const { resolvedTheme: theme } = useTheme()
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

    const penColor = theme === 'dark' ? 'white' : 'black'

    return (
        <div
            ref={SignaturePadParent}
            className={cn('w-full', isFullScreenMode ? 'h-full' : 'h-[300px]')}
        >
            <ReactSignatureCanvas
                penColor={penColor}
                ref={signatureRef}
                clearOnResize={true}
                velocityFilterWeight={isFullScreenMode ? 0 : 0.9}
                canvasProps={{
                    className:
                        'sigCanvas w-full h-full rounded-lg border dark:bg-secondary',
                    width: dimensions.width,
                    height: dimensions.height,
                }}
            />
        </div>
    )
}

export default DrawSignature
