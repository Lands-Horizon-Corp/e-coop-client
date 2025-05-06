import { toast } from 'sonner'
import { useRouter } from '@tanstack/react-router'

import {
    DevIcon,
    SunIcon,
    MoonIcon,
    LogoutIcon,
    SunMoonIcon,
    QuestionIcon,
    ChevronsUpDownIcon,
} from '../icons'
import {
    DropdownMenu,
    DropdownMenuSub,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from '../ui/dropdown-menu'
import UserAvatar from '../user-avatar'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'

import { useAuthUser } from '@/store/user-auth-store'
import { useTheme } from '@/providers/theme-provider'
import { useSignOut } from '@/hooks/api-hooks/use-auth'
import useConfirmModalStore from '@/store/confirm-modal-store'

const AppSidebarUser = () => {
    const router = useRouter()

    const { onOpen } = useConfirmModalStore()
    const { setTheme, resolvedTheme } = useTheme()
    const {
        currentAuth: { user },
        resetAuth,
    } = useAuthUser()

    const { mutate: handleSignout } = useSignOut({
        onSuccess: () => {
            resetAuth()
            router.navigate({ to: '/auth/sign-in' as string })
            toast.success('Signed Out')
        },
    })

    if (!user) return null

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton className="size-fit p-4">
                            <UserAvatar
                                src={user.media?.download_url ?? ''}
                                fallback={user.user_name?.charAt(0) ?? '-'}
                                className="size-9 rounded-[4rem] duration-150 ease-in-out"
                            />
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {`${user.first_name} ${user.middle_name} ${user.last_name}`}
                                </span>
                                <span className="truncate text-xs">
                                    {user.email}
                                </span>
                            </div>
                            <ChevronsUpDownIcon className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="end">
                        <DropdownMenuItem>
                            <QuestionIcon className="mr-2 size-4 duration-150 ease-in-out" />
                            <span>Help</span>
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                {resolvedTheme === 'light' && (
                                    <SunIcon className="mr-2 size-4" />
                                )}
                                {resolvedTheme === 'dark' && (
                                    <MoonIcon className="mr-2 size-4" />
                                )}
                                <span>Theme</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem
                                        onClick={() => setTheme('light')}
                                    >
                                        <SunIcon className="mr-2 size-4" />
                                        <span>Light</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setTheme('dark')}
                                    >
                                        <MoonIcon className="mr-2 size-4" />
                                        <span>Dark</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setTheme('system')}
                                    >
                                        <SunMoonIcon className="mr-2 size-4" />
                                        <span>System</span>
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuItem>
                            <DevIcon className="mr-2 size-4 duration-150 ease-in-out" />
                            <span>Dev Mode</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() =>
                                onOpen({
                                    title: 'Sign Out',
                                    description:
                                        'Are you sure you want to sign out?',
                                    onConfirm: () => handleSignout(),
                                })
                            }
                        >
                            <LogoutIcon className="mr-2 size-4 duration-150 ease-in-out" />
                            <span>Sign Out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

export default AppSidebarUser
