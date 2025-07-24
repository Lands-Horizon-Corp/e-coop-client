import { cn } from '@/lib'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { useAuthUser } from '@/store/user-auth-store'
import { Link } from '@tanstack/react-router'
import { useRouter } from '@tanstack/react-router'
import { useLocation } from '@tanstack/react-router'

import { useSignOut } from '@/hooks/api-hooks/use-auth'
import { useIsMobile } from '@/hooks/use-mobile'

import { IBaseProps } from '@/types'

import CopyWrapper from '../elements/copy-wrapper'
import {
    ArrowRightIcon,
    ArrowUpRightIcon,
    ChatBubbleIcon,
    DoorExitIcon,
    EmailIcon,
    GearIcon,
    LocationPinIcon,
    TelephoneIcon,
} from '../icons'
import LoadingSpinner from '../spinners/loading-spinner'
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

const OTHER_LINKS = [
    {
        title: 'Home',
        path: '/',
    },
    {
        title: 'Terms and Conditions',
        path: '/policy/terms-and-condition',
    },
    {
        title: 'Privacy Policy',
        path: '/policy/privacy-policy',
    },
    {
        title: 'Terms of Use',
        path: '/policy/terms-of-use',
    },
    {
        title: 'Cookie Policy',
        path: '/policy/cookie-policy',
    },
    {
        title: 'Data Protection Policy',
        path: '/policy/data-protection-policy',
    },
    {
        title: 'Risk Management Policy',
        path: '/policy/risk-management-policy',
    },
    {
        title: 'Anti-Money Laundering (AML) & Counter-Terrorism Financing (CTF) Policy',
        path: '/policy/aml-ctf-policy',
    },
    {
        title: 'Know Your Customer (KYC)',
        path: '/policy/kyc-policy/',
    },
    {
        title: 'Complaint Handling and Dispute Resolution Policy',
        path: '/policy/complaint-handling-and-dispute-policy/',
    },
    {
        title: 'Fee and Charges Policy',
        path: '/policy/fee-and-charges-policy/',
    },
    {
        title: 'Security Policy',
        path: '/policy/security-policy/',
    },
]

const AccountSettingsSidebar = (prop: Props) => {
    const router = useRouter()
    const { pathname } = useLocation()

    const isMobile = useIsMobile()

    const { resetAuth } = useAuthUser()
    const { onOpen } = useConfirmModalStore()

    const { mutate: handleSignout, isPending: isSigningOut } = useSignOut({
        onSuccess: () => {
            resetAuth()
            router.navigate({ to: '/auth/sign-in' as string })
        },
    })

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
                <DropdownMenuContent className="max-h-[500px] overflow-y-auto ecoop-scroll">
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
                    <DropdownMenuSeparator />
                    {OTHER_LINKS.map((item) => (
                        <DropdownMenuItem
                            key={item.path}
                            className={cn(
                                'text-muted-foreground',
                                pathname == item.path && 'text-foreground'
                            )}
                            onClick={(e) => {
                                e.stopPropagation()
                                window.open(item.path, '_blank')
                            }}
                        >
                            <p className="text-wrap max-w-[80vw]">
                                {item.title}{' '}
                            </p>
                            <ArrowUpRightIcon className="ml-2 inline" />
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />

                    <div className="grid gap-y-1">
                        <Link
                            to={'/contact' as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative hover:underline hover:underline-offset-4 flex items-center ease-in-out duration-300 hover:text-teal-400 gap-x-2 text-xs text-wrap text-muted-foreground"
                        >
                            <ChatBubbleIcon className="inline" />
                            Contact
                        </Link>
                        <CopyWrapper iconClassName="size-3">
                            <p className="inline-flex items-center text-xs text-teal-600">
                                <EmailIcon className="inline mr-1" />
                                <span className="text-wrap">
                                    lands.horizon.corp@gmail.com
                                </span>
                            </p>
                        </CopyWrapper>
                        <CopyWrapper className="block" iconClassName="size-3">
                            <p className="inline-flex items-center text-xs text-teal-600">
                                <TelephoneIcon className="inline mr-1" />
                                <span className="text-wrap">
                                    +63 991 617 1081
                                </span>
                            </p>
                        </CopyWrapper>
                        <CopyWrapper className="block" iconClassName="size-3">
                            <p className="inline-flex items-start text-xs max-w-[200px] text-teal-600">
                                <LocationPinIcon className="inline mr-1 shrink-0" />
                                <span className="text-wrap">
                                    BLK 5 LOT 49, MAKADIYOS STREET VILLA MUZON
                                    SUBD, MUZON EAST CITY OF SAN JOSE DEL MONTE
                                    BULACAN, REGION III (CENTRAL LUZON), 3023,
                                    PHILIPPINES
                                </span>
                            </p>
                        </CopyWrapper>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        )

    return (
        <div className={cn('space-y-3 px-4 text-base', prop.className)}>
            {settingsNavItems.map((item) => (
                <Link
                    className={cn(
                        'block text-sm text-muted-foreground duration-300 ease-out hover:text-foreground',
                        pathname == item.path && 'text-foreground'
                    )}
                    key={item.path}
                    to={item.path as string}
                >
                    {item.name}
                </Link>
            ))}
            <Separator />
            <div className="space-y-3">
                <p className="!mt-4 text-xs font-medium text-muted-foreground">
                    Quick Links
                </p>
                <p className="cursor-pointer text-sm text-muted-foreground duration-200 ease-in hover:text-foreground">
                    <Link to={'/onboarding' as string}>Onboarding</Link>{' '}
                    <ArrowRightIcon className="inline" />
                </p>
                <p
                    onClick={() => {
                        if (isSigningOut) return

                        onOpen({
                            title: 'Sign Out',
                            description: 'Are you sure you want to sign out?',
                            onConfirm: () => handleSignout(),
                        })
                    }}
                    className="cursor-pointer text-sm text-destructive duration-200 ease-in hover:text-foreground"
                >
                    <span>Sign Out</span>
                    {isSigningOut ? (
                        <LoadingSpinner className="inline ml-2" />
                    ) : (
                        <DoorExitIcon className="inline ml-2" />
                    )}
                </p>
                <p
                    onClick={() => router.history.back()}
                    className="cursor-pointer text-sm text-muted-foreground duration-200 ease-in hover:text-foreground"
                >
                    Back
                    <ArrowRightIcon className="inline ml-2" />
                </p>
            </div>
            <Separator />

            <div className="space-y-4 max-w-[200px]">
                <p className="!mt-4 mb-5 text-xs font-medium text-muted-foreground">
                    Quick Links
                </p>
                {OTHER_LINKS.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-4 flex items-center gap-x-2 text-xs text-wrap ease-in-out duration-300 hover:text-teal-800 dark:hover:text-teal-400 text-teal-600"
                    >
                        <ArrowUpRightIcon className="shrink-0" />
                        {link.title}
                    </Link>
                ))}
            </div>
            <Separator />
            <div className="grid gap-y-1">
                <Link
                    to={'/contact' as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative hover:underline hover:underline-offset-4 flex items-center ease-in-out duration-300 hover:text-teal-400 gap-x-2 text-xs text-wrap text-muted-foreground"
                >
                    <ChatBubbleIcon className="inline" />
                    Contact
                </Link>
                <CopyWrapper iconClassName="size-3">
                    <p className="inline-flex items-center text-xs text-teal-600">
                        <EmailIcon className="inline mr-1" />
                        <span className="text-wrap">
                            lands.horizon.corp@gmail.com
                        </span>
                    </p>
                </CopyWrapper>
                <CopyWrapper className="block" iconClassName="size-3">
                    <p className="inline-flex items-center text-xs text-teal-600">
                        <TelephoneIcon className="inline mr-1" />
                        <span className="text-wrap">+63 991 617 1081</span>
                    </p>
                </CopyWrapper>
                <CopyWrapper className="block" iconClassName="size-3">
                    <p className="inline-flex items-start text-xs max-w-[200px] text-teal-600">
                        <LocationPinIcon className="inline mr-1 shrink-0" />
                        <span className="text-wrap">
                            BLK 5 LOT 49, MAKADIYOS STREET VILLA MUZON SUBD,
                            MUZON EAST CITY OF SAN JOSE DEL MONTE BULACAN,
                            REGION III (CENTRAL LUZON), 3023, PHILIPPINES
                        </span>
                    </p>
                </CopyWrapper>
            </div>
        </div>
    )
}

export default AccountSettingsSidebar
