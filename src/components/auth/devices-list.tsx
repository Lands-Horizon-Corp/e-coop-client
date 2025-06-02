import { ILoggedInUser } from "@/types";
import { toast } from 'sonner'
import {
    SmartphoneIcon,
    MonitorIcon, UserIcon,
    LogoutIcon, GlobeIcon,
    LanguageIcon,
    LocationPinIcon,
    NavigationIcon,
} from "../icons";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { useCurrentLoggedInUserLogout } from "@/hooks/api-hooks/use-auth";
import { useAuthUser } from "@/store/user-auth-store";
import { useRouter } from "@tanstack/react-router";
import useActionSecurityStore from "@/store/action-security-store";
interface Props {
    devices: ILoggedInUser[]
}



const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
        case "mobile":
            return <SmartphoneIcon className="h-4 w-4" />
        case "tablet":
            return <SmartphoneIcon className="h-4 w-4" />
        default:
            return <MonitorIcon className="h-4 w-4" />
    }
}


const getDeviceColor = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
        case "mobile":
            return "bg-green-100 text-green-800"
        case "tablet":
            return "bg-blue-100 text-blue-800"
        default:
            return "bg-purple-100 text-purple-800"
    }
}


const DevicesList = ({ devices }: Props) => {
    const router = useRouter()
    const {
        resetAuth,
    } = useAuthUser()

    const { onOpenSecurityAction } = useActionSecurityStore()
    const { mutate: handleSignout } = useCurrentLoggedInUserLogout({
        onSuccess: () => {
            resetAuth()
            router.navigate({ to: '/auth/sign-in' as string })
            toast.success('Signed Out')
        },
    })
    const signOut = ()=>{
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
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <UserIcon className="h-6 w-6" />
                    <h1 className="text-2xl font-bold">Logged In Users</h1>
                </div>
                <Button onClick={() => signOut()} variant="outline" className="flex items-center gap-2">
                    <LogoutIcon className="h-4 w-4" />
                    Logout from all devices, including this one.
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {devices.map((user, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between text-lg">
                                <span className="flex items-center gap-2">
                                    <UserIcon className="h-5 w-5" />
                                    User {index + 1}
                                </span>
                                <Badge className={`flex items-center gap-1 ${getDeviceColor(user.device_type)}`}>
                                    {getDeviceIcon(user.device_type)}
                                    {user.device_type}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <LocationPinIcon className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Location:</span>
                                    <span>{user.location}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <LanguageIcon className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Language:</span>
                                    <span>{user.language}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <GlobeIcon className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">IP Address:</span>
                                    <span className="font-mono text-xs">{user.ip_address}</span>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <NavigationIcon className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">Coordinates:</span>
                                    <span className="font-mono text-xs">
                                        {user.latitude.toFixed(4)}, {user.longitude.toFixed(4)}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-2 border-t">
                                <div className="text-xs text-muted-foreground">
                                    <div className="mb-1">
                                        <span className="font-medium">Accept Language:</span>
                                    </div>
                                    <div className="font-mono bg-muted p-2 rounded text-xs break-all">{user.accept_language}</div>
                                </div>

                                <div className="text-xs text-muted-foreground mt-2">
                                    <div className="mb-1">
                                        <span className="font-medium">User Agent:</span>
                                    </div>
                                    <div className="font-mono bg-muted p-2 rounded text-xs break-all">
                                        {user.user_agent.length > 60 ? `${user.user_agent.substring(0, 60)}...` : user.user_agent}
                                    </div>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default DevicesList;