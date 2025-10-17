import { Outlet, createFileRoute } from '@tanstack/react-router'
import { useRouter } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { logger, useSignOut } from '@/modules/authentication'
import { useAuthUser } from '@/modules/authentication/authgentication.store'
import useConfirmModalStore from '@/store/confirm-modal-store'

import {
    AngryIcon,
    ArrowUpRightIcon,
    CheckFillIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    CookieBiteIcon,
    DatabaseLockIcon,
    EmailCheckIcon,
    FootstepsIcon,
    GearIcon,
    HandDropCoinsIcon,
    HandShakeHeartIcon,
    HomeFillIcon,
    LinkIcon,
    LogoutIcon,
    NotAllowedIcon,
    PaintBrushIcon,
    PhoneIcon,
    PoliceBadgeIcon,
    QrCodeIcon,
    RocketIcon,
    ShieldFillIcon,
    SigiBookIcon,
    UserIcon,
    UserShieldIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import UserProfileNav from '@/components/nav/navs/user-profile-nav'
import {
    Sidebar,
    SidebarContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
} from '@/components/ui/sidebar'
import AuthGuard from '@/components/wrappers/auth-guard'

import { IClassProps } from '@/types'

// ACCOUNT SETTINGS NOT TIED TO COOP
export const Route = createFileRoute('/account-profile')({
    component: RouteComponent,
})

const BackButton = () => {
    const router = useRouter()
    const {
        currentAuth: { user_organization },
    } = useAuthUser()

    const handleBack = () => {
        if (user_organization)
            return router.navigate({
                to: `/org/${user_organization.organization.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(
                        /^-+|-+$/g,
                        ''
                    )}/branch/${user_organization.branch.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')}`,
            })

        router.history.back()
    }

    if (!user_organization) return

    return (
        <SidebarMenuButton
            asChild
            className="last:border-b-0 group/sidebar-item transition-colors ease-in-out duration-75 px-2 py-5 rounded-none border-b-1"
            onClick={handleBack}
        >
            <span className="flex items-center gap-x-2 px-4">
                <ChevronLeftIcon />
                <p>Back</p>
            </span>
        </SidebarMenuButton>
    )
}

function RouteComponent() {
    return (
        <AuthGuard>
            <SidebarProvider>
                <Sidebar>
                    <SidebarHeader>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <UserSidebarItem />
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarHeader>
                    <SidebarContent className="ecoop-scroll pb-4">
                        <div>
                            <SidebarGroupLabel className="mx-1 my-0">
                                Settings
                            </SidebarGroupLabel>
                            <div className="bg-popover rounded-3xl overflow-clip mx-3 border border-border">
                                <SidebarMenuButton
                                    asChild
                                    className="last:border-b-0 group/sidebar-item transition-colors ease-in-out duration-75 px-2 py-5 rounded-none border-b-1"
                                >
                                    <Link
                                        className="flex items-center gap-x-2 px-4"
                                        to="/account-profile"
                                    >
                                        <GearIcon />
                                        <p>General</p>
                                        <ChevronRightIcon className="ml-auto text-sidebar-foreground/40 group-hover/sidebar-item:text-sidebar-accent-foreground" />
                                    </Link>
                                </SidebarMenuButton>
                                <SidebarMenuButton
                                    asChild
                                    className="last:border-b-0 group/sidebar-item transition-colors ease-in-out duration-75 px-2 py-5 rounded-none border-b-1"
                                >
                                    <Link
                                        className="flex items-center gap-x-2 px-4"
                                        to="/account-profile/profile"
                                    >
                                        <UserIcon />
                                        <p>Profile</p>
                                        <ChevronRightIcon className="ml-auto text-sidebar-foreground/40 group-hover/sidebar-item:text-sidebar-accent-foreground" />
                                    </Link>
                                </SidebarMenuButton>
                                <SidebarMenuButton
                                    asChild
                                    className="last:border-b-0 group/sidebar-item transition-colors ease-in-out duration-75 px-2 py-5 rounded-none border-b-1"
                                >
                                    <Link
                                        className="flex items-center gap-x-2 px-4"
                                        to="/account-profile/qr"
                                    >
                                        <QrCodeIcon />
                                        <p>QR</p>
                                        <ChevronRightIcon className="ml-auto text-sidebar-foreground/40 group-hover/sidebar-item:text-sidebar-accent-foreground" />
                                    </Link>
                                </SidebarMenuButton>
                                <SidebarMenuButton
                                    asChild
                                    className="last:border-b-0 group/sidebar-item transition-colors ease-in-out duration-75 px-2 py-5 rounded-none border-b-1"
                                >
                                    <Link
                                        className="flex items-center gap-x-2 px-4"
                                        to="/account-profile/appearance"
                                    >
                                        <PaintBrushIcon />
                                        <p>Appearance</p>
                                        <ChevronRightIcon className="ml-auto text-sidebar-foreground/40 group-hover/sidebar-item:text-sidebar-accent-foreground" />
                                    </Link>
                                </SidebarMenuButton>
                            </div>
                        </div>

                        <div>
                            <SidebarGroupLabel className="mx-1 my-0">
                                Security & Verification
                            </SidebarGroupLabel>
                            <div className="bg-popover rounded-3xl overflow-clip mx-3 border border-border">
                                <SidebarMenuButton
                                    asChild
                                    className="last:border-b-0 group/sidebar-item transition-colors ease-in-out duration-75 px-2 py-5 rounded-none border-b-1"
                                >
                                    <Link
                                        className="flex items-center gap-x-2 px-4"
                                        to="/account-profile/security"
                                    >
                                        <ShieldFillIcon />
                                        <p>Security</p>
                                        <ChevronRightIcon className="ml-auto text-sidebar-foreground/40 group-hover/sidebar-item:text-sidebar-accent-foreground" />
                                    </Link>
                                </SidebarMenuButton>
                                <SidebarMenuButton
                                    asChild
                                    className="last:border-b-0 group/sidebar-item transition-colors ease-in-out duration-75 px-2 py-5 rounded-none border-b-1"
                                >
                                    <Link
                                        className="flex items-center gap-x-2 px-4"
                                        to="/account-profile/verify/email"
                                    >
                                        <EmailCheckIcon />
                                        <p>Verify Email</p>
                                        <ChevronRightIcon className="ml-auto text-sidebar-foreground/40 group-hover/sidebar-item:text-sidebar-accent-foreground" />
                                    </Link>
                                </SidebarMenuButton>
                                <SidebarMenuButton
                                    asChild
                                    className="last:border-b-0 group/sidebar-item transition-colors ease-in-out duration-75 px-2 py-5 rounded-none border-b-1"
                                >
                                    <Link
                                        className="flex items-center gap-x-2 px-4"
                                        to="/account-profile/verify/contact"
                                    >
                                        <PhoneIcon />
                                        <p>Verify Contact</p>
                                        <ChevronRightIcon className="ml-auto text-sidebar-foreground/40 group-hover/sidebar-item:text-sidebar-accent-foreground" />
                                    </Link>
                                </SidebarMenuButton>
                                <SidebarMenuButton
                                    asChild
                                    className="last:border-b-0 group/sidebar-item transition-colors ease-in-out duration-75 px-2 py-5 rounded-none border-b-1"
                                >
                                    <Link
                                        className="flex items-center gap-x-2 px-4"
                                        to="/account-profile/activity-logs"
                                    >
                                        <FootstepsIcon />
                                        <p>Activity Logs</p>
                                        <ChevronRightIcon className="ml-auto text-sidebar-foreground/40 group-hover/sidebar-item:text-sidebar-accent-foreground" />
                                    </Link>
                                </SidebarMenuButton>
                            </div>
                        </div>

                        <div>
                            <SidebarGroupLabel className="mx-1 my-0">
                                Actions
                            </SidebarGroupLabel>
                            <div className="bg-popover rounded-3xl overflow-clip mx-3 border border-border">
                                <SidebarMenuButton
                                    asChild
                                    className="last:border-b-0 group/sidebar-item transition-colors ease-in-out duration-75 px-2 py-5 rounded-none border-b-1"
                                >
                                    <Link
                                        className="flex items-center gap-x-2 px-4"
                                        to="/onboarding"
                                    >
                                        <RocketIcon />
                                        <p>Onboarding</p>
                                        <LinkIcon className="ml-auto text-sidebar-foreground/40 group-hover/sidebar-item:text-sidebar-accent-foreground" />
                                    </Link>
                                </SidebarMenuButton>
                                <BackButton />
                                <SignOutButton />
                            </div>
                        </div>

                        <div>
                            <SidebarGroupLabel className="mx-1 my-0">
                                About & Links
                            </SidebarGroupLabel>
                            <div className="bg-popover rounded-3xl overflow-clip mx-3 border border-border">
                                <SidebarMenuButton
                                    asChild
                                    className="last:border-b-0 group/sidebar-item transition-colors ease-in-out duration-75 px-2 py-5 rounded-none border-b-1"
                                >
                                    <Link
                                        className="flex items-center gap-x-2 px-4"
                                        to="/"
                                    >
                                        <HomeFillIcon />
                                        <p>Home</p>
                                        <ArrowUpRightIcon className="ml-auto text-sidebar-foreground/40 group-hover/sidebar-item:text-sidebar-accent-foreground" />
                                    </Link>
                                </SidebarMenuButton>
                                <SidebarMenuButton
                                    asChild
                                    className="last:border-b-0 group/sidebar-item transition-colors ease-in-out duration-75 px-2 py-5 rounded-none border-b-1"
                                >
                                    <Link
                                        className="flex items-center gap-x-2 px-4"
                                        to="/policy/terms-and-condition"
                                    >
                                        <CheckFillIcon />
                                        <p>Terms and Conditions</p>
                                        <ArrowUpRightIcon className="ml-auto text-sidebar-foreground/40 group-hover/sidebar-item:text-sidebar-accent-foreground" />
                                    </Link>
                                </SidebarMenuButton>
                                <SidebarMenuButton
                                    asChild
                                    className="last:border-b-0 group/sidebar-item transition-colors ease-in-out duration-75 px-2 py-5 rounded-none border-b-1"
                                >
                                    <Link
                                        className="flex items-center gap-x-2 px-4"
                                        to="/policy/privacy-policy"
                                    >
                                        <UserShieldIcon />
                                        <p>Privacy Policy</p>
                                        <ArrowUpRightIcon className="ml-auto text-sidebar-foreground/40 group-hover/sidebar-item:text-sidebar-accent-foreground" />
                                    </Link>
                                </SidebarMenuButton>
                                <SidebarMenuButton
                                    asChild
                                    className="last:border-b-0 group/sidebar-item transition-colors ease-in-out duration-75 px-2 py-5 rounded-none border-b-1"
                                >
                                    <Link
                                        className="flex items-center gap-x-2 px-4"
                                        to="/policy/terms-of-use"
                                    >
                                        <SigiBookIcon />
                                        <p>Terms of Use</p>
                                        <ArrowUpRightIcon className="ml-auto text-sidebar-foreground/40 group-hover/sidebar-item:text-sidebar-accent-foreground" />
                                    </Link>
                                </SidebarMenuButton>
                                <SidebarMenuButton
                                    asChild
                                    className="last:border-b-0 group/sidebar-item transition-colors ease-in-out duration-75 px-2 py-5 rounded-none border-b-1"
                                >
                                    <Link
                                        className="flex items-center gap-x-2 px-4"
                                        to="/policy/cookie-policy"
                                    >
                                        <CookieBiteIcon />
                                        <p>Cookie Policy</p>
                                        <ArrowUpRightIcon className="ml-auto text-sidebar-foreground/40 group-hover/sidebar-item:text-sidebar-accent-foreground" />
                                    </Link>
                                </SidebarMenuButton>
                                <SidebarMenuButton
                                    asChild
                                    className="last:border-b-0 group/sidebar-item transition-colors ease-in-out duration-75 px-2 py-5 rounded-none border-b-1"
                                >
                                    <Link
                                        className="flex items-center gap-x-2 px-4"
                                        to="/policy/data-protection-policy"
                                    >
                                        <DatabaseLockIcon />
                                        <p>Data Protection policy</p>
                                        <ArrowUpRightIcon className="ml-auto text-sidebar-foreground/40 group-hover/sidebar-item:text-sidebar-accent-foreground" />
                                    </Link>
                                </SidebarMenuButton>
                                <SidebarMenuButton
                                    asChild
                                    className="last:border-b-0 group/sidebar-item transition-colors ease-in-out duration-75 px-2 py-5 rounded-none border-b-1"
                                >
                                    <Link
                                        className="flex items-center gap-x-2 px-4"
                                        to="/policy/risk-management-policy"
                                    >
                                        <PoliceBadgeIcon />
                                        <p className="truncate">
                                            Risk Management Policy
                                        </p>
                                        <ArrowUpRightIcon className="ml-auto text-sidebar-foreground/40 group-hover/sidebar-item:text-sidebar-accent-foreground" />
                                    </Link>
                                </SidebarMenuButton>
                                <SidebarMenuButton
                                    asChild
                                    className="last:border-b-0 group/sidebar-item transition-colors ease-in-out duration-75 px-2 py-5 rounded-none border-b-1"
                                >
                                    <Link
                                        className="flex items-center gap-x-2 px-4"
                                        to="/policy/risk-management-policy"
                                    >
                                        <NotAllowedIcon />
                                        <p className="truncate">
                                            Anti-Money Laundering (AML) &
                                            Counter-Terrorism Financing (CTF)
                                            Policy
                                        </p>
                                        <ArrowUpRightIcon className="ml-auto text-sidebar-foreground/40 group-hover/sidebar-item:text-sidebar-accent-foreground" />
                                    </Link>
                                </SidebarMenuButton>
                                <SidebarMenuButton
                                    asChild
                                    className="last:border-b-0 group/sidebar-item transition-colors ease-in-out duration-75 px-2 py-5 rounded-none border-b-1"
                                >
                                    <Link
                                        className="flex items-center gap-x-2 px-4"
                                        to="/policy/kyc-policy"
                                    >
                                        <HandShakeHeartIcon />
                                        <p className="truncate">
                                            Know Your Customer (KYC) Policy
                                        </p>
                                        <ArrowUpRightIcon className="ml-auto text-sidebar-foreground/40 group-hover/sidebar-item:text-sidebar-accent-foreground" />
                                    </Link>
                                </SidebarMenuButton>
                                <SidebarMenuButton
                                    asChild
                                    className="last:border-b-0 group/sidebar-item transition-colors ease-in-out duration-75 px-2 py-5 rounded-none border-b-1"
                                >
                                    <Link
                                        className="flex items-center gap-x-2 px-4"
                                        to="/policy/complaint-handling-and-dispute-policy"
                                    >
                                        <AngryIcon />
                                        <p className="truncate">
                                            Complaint Handling and Dispute
                                            Resolution Policy
                                        </p>
                                        <ArrowUpRightIcon className="ml-auto text-sidebar-foreground/40 group-hover/sidebar-item:text-sidebar-accent-foreground" />
                                    </Link>
                                </SidebarMenuButton>
                                <SidebarMenuButton
                                    asChild
                                    className="last:border-b-0 group/sidebar-item transition-colors ease-in-out duration-75 px-2 py-5 rounded-none border-b-1"
                                >
                                    <Link
                                        className="flex items-center gap-x-2 px-4"
                                        to="/policy/fee-and-charges-policy"
                                    >
                                        <HandDropCoinsIcon />
                                        <p className="truncate">
                                            Fee and Charges Policy
                                        </p>
                                        <ArrowUpRightIcon className="ml-auto text-sidebar-foreground/40 group-hover/sidebar-item:text-sidebar-accent-foreground" />
                                    </Link>
                                </SidebarMenuButton>
                                <SidebarMenuButton
                                    asChild
                                    className="last:border-b-0 group/sidebar-item transition-colors ease-in-out duration-75 px-2 py-5 rounded-none border-b-1"
                                >
                                    <Link
                                        className="flex items-center gap-x-2 px-4"
                                        to="/policy/security-policy"
                                    >
                                        <ShieldFillIcon />
                                        <p className="truncate">
                                            Security Policy
                                        </p>
                                        <ArrowUpRightIcon className="ml-auto text-sidebar-foreground/40 group-hover/sidebar-item:text-sidebar-accent-foreground" />
                                    </Link>
                                </SidebarMenuButton>
                            </div>
                        </div>
                    </SidebarContent>
                    {/* <SidebarFooter>
                        <NavUser user={data.user} />
                    </SidebarFooter> */}
                </Sidebar>
                <SidebarInset className="ecoop-scroll max-h-[98vh] w-full overflow-y-auto">
                    <UserProfileNav className="sticky top-0 z-50 bg-background/90 mx-0 lg:px-5" />
                    <main>
                        <Outlet />
                    </main>
                </SidebarInset>
            </SidebarProvider>
            {/* <div className="flex">
                <main className="flex w-full flex-1 items-center">
                    <div className="ecoop-scroll relative flex h-screen max-h-screen w-full flex-col items-center justify-center overflow-y-auto">
                        <BackButton />
                        <div className="relative mt-24 flex min-h-[80vh] w-full max-w-7xl flex-1 flex-col space-y-4">
                            
                            <div className="flex flex-1 gap-x-8">
                                <AccountSettingsSidebar className="w-full" />
                                <div className="flex min-h-full flex-1 flex-col items-center space-y-4 px-4">
                                    <div className="min-h-full w-full flex-1 space-y-4 px-0 sm:px-4">
                                        <Outlet />
                                        <div className="space-y-4">
                                            <VerifyNotice />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <AuthFooter />
                        </div>
                    </div>
                </main>
            </div> */}
        </AuthGuard>
    )
}

const UserSidebarItem = ({ className }: IClassProps) => {
    const {
        currentAuth: { user },
    } = useAuthUser()
    return (
        <div
            className={cn(
                '!text-lg flex rounded-3xl bg-popover border border-border/70 p-4 items-center gap-x-2',
                className
            )}
        >
            <ImageDisplay
                className="size-12 shrink-0"
                src={user.media?.download_url}
            />
            <div className="text-sm flex-1 min-w-0">
                <p className="truncate text-base">{user.full_name}</p>
                <p className="truncate text-muted-foreground">
                    @{user.user_name}
                </p>
            </div>
        </div>
    )
}

const SignOutButton = () => {
    const router = useRouter()
    const { onOpen } = useConfirmModalStore()

    const { resetAuth } = useAuthUser()

    const { mutate: handleSignout } = useSignOut({
        options: {
            onSuccess: () => {
                resetAuth()
                router.navigate({ to: '/auth/sign-in' as string })
                toast.success('Signed Out')
            },
            onError: (error) => {
                const errorMessage = serverRequestErrExtractor({ error })
                logger.error(errorMessage)
            },
        },
    })

    return (
        <SidebarMenuButton
            asChild
            className="last:border-b-0 group/sidebar-item transition-colors ease-in-out duration-75 px-2 py-5 rounded-none border-b-1"
        >
            <a
                className="flex items-center gap-x-2 px-4"
                onClick={() =>
                    onOpen({
                        title: 'Sign Out',
                        description: 'Are you sure you want to sign out?',
                        onConfirm: () => handleSignout(),
                    })
                }
            >
                <LogoutIcon />
                <p>Sign Out</p>
            </a>
        </SidebarMenuButton>
    )
}
