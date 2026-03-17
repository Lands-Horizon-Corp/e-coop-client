import { useEffect, useRef, useState } from 'react'

import { toast } from 'sonner'

import { BrowserMultiFormatReader } from '@zxing/browser'
import { AnimatePresence, motion } from 'framer-motion'
import {
    AlertCircle,
    Barcode,
    Camera,
    CheckCircle2,
    Loader2,
    RefreshCw,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

import { ScannedItem } from '../inventory.types'

type ScanStatus = 'idle' | 'scanning' | 'success' | 'error'

const MOCK_ITEM: ScannedItem = {
    sku: 'SKU-99284-BX',
    name: 'Industrial Steel Bearing',
    currentStock: 1240,
    unit: 'stone',
    barcodeType: 'Code128',
}

export const InventoryScannerSidebar = () => {
    const [status, setStatus] = useState<ScanStatus>('idle')
    const [scannedItem, setScannedItem] = useState<ScannedItem | null>(null)

    const videoRef = useRef<HTMLVideoElement | null>(null)
    const codeReader = useRef<BrowserMultiFormatReader | null>(null)

    useEffect(() => {
        codeReader.current = new BrowserMultiFormatReader()
        return () => {
            codeReader.current = null
        }
    }, [])

    const startScanner = async () => {
        if (!videoRef.current || !codeReader.current) return

        setStatus('scanning')

        try {
            await codeReader.current.decodeFromVideoDevice(
                undefined,
                videoRef.current,
                (result, error) => {
                    if (result) {
                        const text = result.getText()

                        // 🔥 simulate DB lookup (replace later)
                        setScannedItem({
                            ...MOCK_ITEM,
                            sku: text,
                        })

                        setStatus('success')
                        toast.success('Success')
                        codeReader.current = null
                    }
                    if (error) {
                        // ignore continuous decode errors
                    }
                }
            )
        } catch (err) {
            toast.error(`${err}`)
            setStatus('error')
        }
    }

    const handleReset = () => {
        // codeReader.current?.reset()
        setStatus('idle')
        setScannedItem(null)
    }

    return (
        <div className="shrink-0 flex flex-col">
            {/* Header */}
            <div className="p-4 pb-2 bg-secondary/50">
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Scanner
                </h2>
            </div>

            {/* 🎥 CAMERA VIEW */}
            <div className="relative aspect-4/3 bg-scanner m-3 rounded-xl overflow-hidden border-4 border-foreground/10 shadow-inner">
                {/* 🔥 VIDEO FEED */}
                <video
                    className="absolute inset-0 w-full h-full object-cover"
                    ref={videoRef}
                />

                {/* Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-32 h-32 border-2 border-scanner-scan/50 rounded-lg relative overflow-hidden flex items-center justify-center">
                        {status === 'scanning' && (
                            <div className="w-full h-[2px] bg-scanner-scan/80 animate-scan-line" />
                        )}

                        {status === 'idle' && (
                            <Camera className="h-6 w-6 text-white/50" />
                        )}

                        {status === 'success' && (
                            <CheckCircle2 className="h-6 w-6 text-green-400" />
                        )}

                        {status === 'error' && (
                            <AlertCircle className="h-6 w-6 text-red-400" />
                        )}
                    </div>
                </div>

                {/* Controls */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                    <Button
                        className="rounded-full h-7 w-7 bg-black/40 backdrop-blur"
                        onClick={handleReset}
                        size="icon"
                        variant="secondary"
                    >
                        <RefreshCw className="h-3 w-3 text-white" />
                    </Button>
                </div>
            </div>

            {/* 🔘 SCAN BUTTON */}
            <div className="px-3 pb-2">
                <Button
                    className="w-full h-9 text-xs"
                    disabled={status === 'scanning'}
                    onClick={startScanner}
                >
                    {status === 'scanning' ? (
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    ) : (
                        <Barcode className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    {status === 'scanning' ? 'Scanning...' : 'Start Scan'}
                </Button>
            </div>

            {/* RESULT UI (unchanged) */}
            <div className="px-3 pb-3">
                <AnimatePresence mode="wait">
                    {status === 'success' && scannedItem && (
                        <motion.div
                            animate={{ opacity: 1, y: 0 }}
                            className="p-3 rounded-lg border border-success/20 bg-success/5"
                            exit={{ opacity: 0, y: -4 }}
                            initial={{ opacity: 0, y: 4 }}
                            key="success"
                        >
                            <p className="font-mono text-xs">
                                {scannedItem.sku}
                            </p>
                            <p className="text-xs">{scannedItem.name}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
