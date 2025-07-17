import { cn } from '@/lib'
import { Link } from '@tanstack/react-router'
import { useRouter } from '@tanstack/react-router'
import { useLocation } from '@tanstack/react-router'

import { useIsMobile } from '@/hooks/use-mobile'

import { IBaseProps } from '@/types'

import { ArrowRightIcon, GearIcon } from '../icons'
import { Button } from '../ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Separator } from '../ui/separator'

interface Props extends IBaseProps {}

const settingsNavItems = [
    { name: 'General', path: '/account' },
    { name: 'Profile', path: '/account/profile' },
    { name: 'Security', path: '/account/security' },
    { name: 'Verify Email', path: '/account/verify/email' },
    { name: 'Verify Contact', path: '/account/verify/contact' },
    { name: 'Account QR', path: '/account/qr' },
]

const AccountSettingsSidebar = (prop: Props) => {
    const router = useRouter()
    const { pathname } = useLocation()

    const isMobile = useIsMobile()

    if (isMobile)
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="group absolute right-5 top-8 rounded-full text-muted-foreground hover:text-foreground"
                    >
                        <GearIcon className="size-8 delay-150 duration-300 ease-out group-hover:rotate-45" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Account Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {settingsNavItems.map((item) => (
                        <DropdownMenuItem
                            key={item.path}
                            className={cn(
                                'text-muted-foreground',
                                pathname == item.path && 'text-foreground'
                            )}
                            onClick={() =>
                                router.navigate({ to: item.path as string })
                            }
                        >
                            {item.name}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        )

    return (
        <div className={cn('space-y-3 px-4 text-base', prop.className)}>
            {settingsNavItems.map((item) => (
                <Link
                    className={cn(
                        'block text-muted-foreground duration-300 ease-out hover:text-foreground',
                        pathname == item.path && 'text-foreground'
                    )}
                    key={item.path}
                    to={item.path as string}
                >
                    {item.name}
                </Link>
            ))}
            <Separator />
            <p className="cursor-pointer text-rose-600 duration-200 ease-in hover:text-rose-500 hover:underline">
                Delete Account
            </p>
            <p className="!mt-4 text-xs font-medium text-muted-foreground">
                Quick Links
            </p>
            <p className="cursor-pointer text-sm text-muted-foreground duration-200 ease-in hover:text-foreground">
                <Link to={'/onboarding' as string}>Onboarding</Link>{' '}
                <ArrowRightIcon className="inline" />
            </p>
            <p
                onClick={() => router.history.back()}
                className="cursor-pointer text-sm text-muted-foreground duration-200 ease-in hover:text-foreground"
            >
                Back
                <ArrowRightIcon className="inline" />
            </p>
        </div>
    )
}

export default AccountSettingsSidebar
