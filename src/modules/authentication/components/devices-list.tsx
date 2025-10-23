'use client'

import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

import useActionSecurityStore from '@/store/action-security-store'

import {
    DevicesIcon,
    FingerprintOffIcon,
    GlobeIcon,
    LanguageIcon,
    LocationPinIcon,
    MonitorIcon,
    NavigationIcon,
    RefreshIcon,
    SmartphoneIcon,
    UserIcon,
} from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'

import {
    useCurrentLoggedInUser,
    useCurrentLoggedInUserLogout,
} from '../authentication.service'
import type { ILoggedInUser } from '../authentication.types'
import { useAuthUser } from '../authgentication.store'

interface Props {
    defaultDevices?: ILoggedInUser[]
}

const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
        case 'mobile':
            return <SmartphoneIcon className="h-4 w-4" />
        case 'tablet':
            return <SmartphoneIcon className="h-4 w-4" />
        default:
            return <MonitorIcon className="h-4 w-4" />
    }
}

const getDeviceVariant = (
    deviceType: string
): 'default' | 'secondary' | 'outline' => {
    switch (deviceType.toLowerCase()) {
        case 'mobile':
            return 'default'
        case 'tablet':
            return 'secondary'
        default:
            return 'outline'
    }
}

const DevicesList = ({ defaultDevices }: Props) => {
    const router = useRouter()
    const { resetAuth } = useAuthUser()

    const {
        data: devices = [],
        refetch,
        isRefetching,
        isPending,
    } = useCurrentLoggedInUser({ options: { initialData: defaultDevices } })

    const { onOpenSecurityAction } = useActionSecurityStore()
    const { mutate: handleSignout } = useCurrentLoggedInUserLogout({
        options: {
            onSuccess: () => {
                resetAuth()
                router.navigate({ to: '/auth/sign-in' as string })
                toast.success('Signed Out')
            },
        },
    })

    const signOut = () => {
        onOpenSecurityAction({
            title: 'Protected Action',
            description:
                'This action carries significant impact and requires your password for verification.',
            onSuccess: () => handleSignout(),
        })
    }

    // if (devices.length <= 0) {
    //     return <></>
    // }

    return (
        <div className="container mx-auto space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <UserIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Active Sessions
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {devices.length} device
                            {devices.length !== 1 ? 's' : ''} currently logged
                            in
                        </p>
                    </div>
                </div>
                <Button
                    className="flex items-center cursor-pointer gap-2"
                    onClick={() => signOut()}
                    size="sm"
                    variant="destructive"
                >
                    <FingerprintOffIcon className="h-4 w-4" />
                    Sign out all devices
                </Button>
            </div>
            {isPending && <LoadingSpinner className="mx-auto" />}
            {devices.length === 0 && !isPending && (
                <Empty className="from-muted/50 mx-auto to-background h-full bg-gradient-to-b from-30%">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <DevicesIcon />
                        </EmptyMedia>
                        <EmptyTitle>No Notifications</EmptyTitle>
                        <EmptyDescription>
                            You&apos;re all caught up. New notifications will
                            appear here.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button
                            disabled={isPending || isRefetching}
                            onClick={() => refetch()}
                            size="sm"
                            variant="outline"
                        >
                            {isRefetching || isPending ? (
                                <LoadingSpinner />
                            ) : (
                                <RefreshIcon />
                            )}
                            Refresh
                        </Button>
                    </EmptyContent>
                </Empty>
            )}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {devices.map((user, index) => (
                    <Card
                        className="group transition-all duration-200 hover:shadow-md hover:shadow-primary/5 hover:border-primary/20"
                        key={index}
                    >
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center justify-between text-base">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <span className="font-medium">
                                        Session {index + 1}
                                    </span>
                                </div>
                                <Badge
                                    className="flex items-center gap-1.5"
                                    variant={getDeviceVariant(user.device_type)}
                                >
                                    {getDeviceIcon(user.device_type)}
                                    <span className="capitalize">
                                        {user.device_type}
                                    </span>
                                </Badge>
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="grid gap-3">
                                <div className="flex items-start gap-3">
                                    <LocationPinIcon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-foreground">
                                            Location
                                        </p>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {user.location}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <LanguageIcon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-foreground">
                                            Language
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {user.language}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <GlobeIcon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                    <div className="min-w-0 ">
                                        <p className="text-sm font-medium text-foreground">
                                            IP Address
                                        </p>
                                        <p className="text-sm font-mono text-muted-foreground truncate w-40">
                                            {user.ip_address}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <NavigationIcon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-foreground">
                                            Coordinates
                                        </p>
                                        <p className="text-sm font-mono text-muted-foreground">
                                            {user.latitude.toFixed(4)},{' '}
                                            {user.longitude.toFixed(4)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 border-t pt-4">
                                <div>
                                    <p className="text-xs font-medium text-foreground mb-2">
                                        Accept Language
                                    </p>
                                    <div className="rounded-md bg-muted/50 p-2 border">
                                        <p className="text-xs font-mono text-muted-foreground break-all">
                                            {user.accept_language}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-foreground mb-2">
                                        User Agent
                                    </p>
                                    <div className="rounded-md bg-muted/50 p-2 border">
                                        <p className="text-xs font-mono text-muted-foreground break-all">
                                            {user.user_agent.length > 80
                                                ? `${user.user_agent.substring(0, 80)}...`
                                                : user.user_agent}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default DevicesList
