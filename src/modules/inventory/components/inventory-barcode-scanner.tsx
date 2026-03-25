import { useRef, useState } from 'react'

import { toast } from 'sonner'

import { cn } from '@/helpers/tw-utils'
import { Scanner, outline, useDevices } from '@yudiel/react-qr-scanner'
import { useHotkeys } from 'react-hotkeys-hook'

import { BarcodeScanIcon, CameraIcon, XIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { IBaseProps } from '@/types'

const ALLOWED_FORMATS = new Set([
    'code_39',
    'ean_8',
    'ean_13',
    'upc_a',
    'upc_e',
    'code_128',
    'itf_14',
    'pdf_417',
    'aztec',
    'data_matrix',
    'gs1_data_bar_expanded',
    'gs1_data_matrix',
    // include QR only if needed
    // 'qr_code',
])
interface ScannerProps extends IBaseProps {
    onScan: (value: string) => void
    autoStart?: boolean
    showControls?: boolean
}

const UnifiedScanner = ({
    className,
    onScan,
    autoStart = false,
    showControls = false,
}: ScannerProps) => {
    const [deviceId, setDeviceId] = useState<string | undefined>()
    const [active, setActive] = useState(autoStart)

    const devices = useDevices()

    const lastScanRef = useRef<string | null>(null)

    /** 🔥 HANDLE SCAN */
    const handleScan = (result: any) => {
        const first = result?.[0]

        const text = first?.rawValue || first?.text
        const format = first?.format

        if (!text || !format) return

        // 🔥 normalize format (important!)
        const normalizedFormat = format.toLowerCase()

        // ❌ reject unwanted formats
        if (!ALLOWED_FORMATS.has(normalizedFormat)) {
            toast.error(`Unsupported format: ${normalizedFormat}`)
            return
        }

        // ✅ prevent duplicate spam
        if (lastScanRef.current === text) return
        lastScanRef.current = text

        onScan(text)
        toast.success(`Scanned (${normalizedFormat})`)
    }

    /** 🔁 RESET DUPLICATE LOCK */
    const resetScan = () => {
        lastScanRef.current = null
    }

    /** ⌨️ HOTKEY */
    useHotkeys(
        'b',
        (e) => {
            e.preventDefault()
            setActive((prev) => !prev)
        },
        { enableOnFormTags: true },
        []
    )

    return (
        <div className={cn('space-y-4', className)}>
            {/* CAMERA */}
            <div className="relative aspect-4/3 rounded-xl overflow-hidden border bg-black">
                {active ? (
                    <Scanner
                        components={{ tracker: outline }}
                        constraints={{ deviceId }}
                        onScan={handleScan}
                    />
                ) : (
                    <div className="flex size-full items-center justify-center bg-muted">
                        <div className="text-center">
                            <BarcodeScanIcon className="mx-auto h-12 w-12 text-muted-foreground/70" />
                            <p className="text-xs text-muted-foreground/70">
                                Press "B" or Start Scan
                            </p>
                        </div>
                    </div>
                )}

                {/* CAMERA SWITCH */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            className="absolute bottom-2 right-2 z-10 bg-secondary/80 p-1"
                            size="icon"
                            type="button"
                            variant="outline"
                        >
                            <CameraIcon className="size-4 stroke-1" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Camera Devices</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuRadioGroup
                            onValueChange={setDeviceId}
                            value={deviceId}
                        >
                            {devices.map((dev) => (
                                <DropdownMenuRadioItem
                                    key={dev.deviceId}
                                    value={dev.deviceId}
                                >
                                    {dev.label || 'Camera'}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {showControls && (
                <div className="flex gap-2">
                    {/* STOP */}
                    <Button
                        onClick={() => setActive(false)}
                        type="button"
                        variant="secondary"
                    >
                        <XIcon />
                    </Button>

                    {/* START */}
                    {!active && (
                        <Button
                            className="flex-1"
                            onClick={() => {
                                resetScan()
                                setActive(true)
                            }}
                            type="button"
                        >
                            Start Scan
                        </Button>
                    )}
                    {/* ACTIVE */}
                    {active && (
                        <Button
                            className="flex-1"
                            disabled
                            type="button"
                            variant="secondary"
                        >
                            Scanning...
                        </Button>
                    )}
                    {/* RESET */}
                    <Button
                        onClick={resetScan}
                        type="button"
                        variant="secondary"
                    >
                        Reset
                    </Button>
                </div>
            )}
        </div>
    )
}

export default UnifiedScanner
