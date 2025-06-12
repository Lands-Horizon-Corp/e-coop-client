'use client'
import { useState } from 'react'

import { outline, Scanner, useDevices } from '@yudiel/react-qr-scanner'

import {
    DropdownMenu,
    DropdownMenuLabel,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuRadioGroup,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'

import { cn } from '@/lib/utils'
import { CameraIcon } from '../icons'
import { IQrScannerProps } from './types'

const QrScanner = (props: IQrScannerProps) => {
    const [deviceId, setDeviceId] = useState<string | undefined>(undefined)

    const devices = useDevices()

    return (
        <div className={cn('relative', props.classNames?.container)}>
            <Scanner
                {...props}
                constraints={{
                    deviceId,
                }}
                components={{
                    tracker: outline,
                }}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        size="icon"
                        variant="outline"
                        className="absolute bottom-2 right-2 z-10 size-fit bg-secondary/80 p-1"
                    >
                        <CameraIcon className="size-4 stroke-1" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Choose Camera Devices</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                        value={deviceId}
                        onValueChange={setDeviceId}
                    >
                        {devices.map((dev) => (
                            <DropdownMenuRadioItem
                                key={dev.deviceId}
                                value={dev.deviceId}
                            >
                                {dev.label}
                            </DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default QrScanner
