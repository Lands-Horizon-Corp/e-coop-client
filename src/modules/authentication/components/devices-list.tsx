import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

import useActionSecurityStore from '@/store/action-security-store'

import {
    GlobeIcon,
    LanguageIcon,
    LocationPinIcon,
    LogoutIcon,
    MonitorIcon,
    NavigationIcon,
    SmartphoneIcon,
    UserIcon,
} from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useCurrentLoggedInUserLogout } from '../authentication.service'
import { ILoggedInUser } from '../authentication.types'
import { useAuthUser } from '../authgentication.store'

interface Props {
    devices: ILoggedInUser[]
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

const getDeviceColor = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
        case 'mobile':
            return 'bg-primary/10 text-primary/70'
        case 'tablet':
            return 'bg-blue-100 text-blue-800'
        default:
            return 'bg-purple-100 text-purple-800'
    }
}

const DevicesList = ({ devices }: Props) => {
    const router = useRouter()
    const { resetAuth } = useAuthUser()

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
    if (devices.length <= 0) {
        return <></>
    }
    return (
        <div className="container mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <UserIcon className="h-6 w-6" />
                    <h1 className="text-2xl font-bold">Logged In Users</h1>
                </div>
                <Button
                    onClick={() => signOut()}
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    <LogoutIcon className="h-4 w-4" />
                    Logout from all devices, including this one.
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
                {devices.map((user, index) => (
                    <Card
                        key={index}
                        className="transition-shadow hover:shadow-lg"
                    >
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between text-lg">
                                <span className="flex items-center gap-2">
                                    <UserIcon className="h-5 w-5" />
                                    User {index + 1}
                                </span>
                                <Badge
                                    className={`flex items-center gap-1 ${getDeviceColor(user.device_type)}`}
                                >
                                    {getDeviceIcon(user.device_type)}
                                    {user.device_type}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <LocationPinIcon className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">
                                        Location:
                                    </span>
                                    <span>{user.location}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <LanguageIcon className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">
                                        Language:
                                    </span>
                                    <span>{user.language}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <GlobeIcon className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">
                                        IP Address:
                                    </span>
                                    <span className="font-mono text-xs">
                                        {user.ip_address}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <NavigationIcon className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">
                                        Coordinates:
                                    </span>
                                    <span className="font-mono text-xs">
                                        {user.latitude.toFixed(4)},{' '}
                                        {user.longitude.toFixed(4)}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t pt-2">
                                <div className="text-xs text-muted-foreground">
                                    <div className="mb-1">
                                        <span className="font-medium">
                                            Accept Language:
                                        </span>
                                    </div>
                                    <div className="break-all rounded bg-muted p-2 font-mono text-xs">
                                        {user.accept_language}
                                    </div>
                                </div>

                                <div className="mt-2 text-xs text-muted-foreground">
                                    <div className="mb-1">
                                        <span className="font-medium">
                                            User Agent:
                                        </span>
                                    </div>
                                    <div className="break-all rounded bg-muted p-2 font-mono text-xs">
                                        {user.user_agent.length > 60
                                            ? `${user.user_agent.substring(0, 60)}...`
                                            : user.user_agent}
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
