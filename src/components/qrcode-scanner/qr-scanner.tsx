'use client'

import { useState } from 'react'

import { cn } from '@/helpers/tw-utils'
import { Scanner, outline, useDevices } from '@yudiel/react-qr-scanner'

import { CameraIcon } from '../icons'
import { Button } from '../ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { IQrScannerProps } from './types'

const QrScanner = (props: IQrScannerProps) => {
    const [deviceId, setDeviceId] = useState<string | undefined>(undefined)

    const devices = useDevices()

    return (
        <div className={cn('relative', props.classNames?.container)}>
            <Scanner
                {...props}
                components={{
                    tracker: outline,
                }}
                constraints={{
                    deviceId,
                }}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        className="absolute bottom-2 right-2 z-10 size-fit bg-secondary/80 p-1"
                        size="icon"
                        variant="outline"
                    >
                        <CameraIcon className="size-4 stroke-1" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Choose Camera Devices</DropdownMenuLabel>
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
