import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'

import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { CameraIcon, RefreshIcon } from '@/components/icons'

import { cn } from '@/lib/utils'
import { withCatchAsync } from '@/utils'
import { IBaseProps } from '@/types/components'
import LoadingSpinner from '@/components/spinners/loading-spinner'

interface Props extends IBaseProps {
    currentCamId: string | undefined
    onPick: (camId: string) => void
}

interface MediaDeviceInfo {
    kind: string
    label?: string
    deviceId: string
}

const fetchVideoInputDevices = async (): Promise<MediaDeviceInfo[]> => {
    const mediaDevices = await navigator.mediaDevices.enumerateDevices()
    return mediaDevices.filter(
        (device) => device.kind === 'videoinput' && device.deviceId
    )
}

const CameraDevicePicker = ({ onPick, currentCamId, children }: Props) => {
    const {
        data: devices,
        refetch,
        isRefetching,
    } = useQuery<MediaDeviceInfo[]>({
        queryKey: ['videoInputDevices'],
        queryFn: async () => {
            const [err, devices] = await withCatchAsync(
                fetchVideoInputDevices()
            )

            if (err) {
                throw err
            }

            const deviceCount = devices.length

            if (deviceCount === 0) throw 'No camera found'

            if (deviceCount > 0)
                toast.success(
                    `Found ${deviceCount} camera${deviceCount > 0 ? 's' : ''}`
                )

            return devices
        },
        retry: true,
        retryOnMount: true,
        initialData: [],
        retryDelay: 1000,
    })

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <span>{children}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
                <DropdownMenuLabel>Camera</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {devices.map((camDevice, id) => (
                    <DropdownMenuItem
                        key={id}
                        onClick={() => onPick(camDevice.deviceId)}
                        className={cn(
                            '',
                            currentCamId &&
                                currentCamId === camDevice.deviceId &&
                                'bg-primary'
                        )}
                    >
                        <CameraIcon className="mr-2 size-4" />
                        {camDevice.label
                            ? camDevice.label.split(' (')[0]
                            : `Camera ${id + 1}`}
                    </DropdownMenuItem>
                ))}
                {devices.length === 0 && (
                    <DropdownMenuLabel className="pointer-events-none font-normal text-foreground/70">
                        no camera available
                    </DropdownMenuLabel>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={(e) => {
                        e.preventDefault()
                        refetch()
                    }}
                >
                    {!isRefetching ? (
                        <RefreshIcon
                            className={cn(
                                'mr-2 size-4',
                                isRefetching && 'animate-spin'
                            )}
                        />
                    ) : (
                        <LoadingSpinner className="mr-2 size-4 [animation-duration:1.5s]" />
                    )}
                    Refresh Camera List
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default CameraDevicePicker
