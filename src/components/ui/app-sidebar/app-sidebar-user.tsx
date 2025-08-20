import { useParams, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

import { useSignOut } from '@/modules/authentication'
import { useAuthUser } from '@/modules/authentication/authgentication.store'
import { APIKeyGenModal } from '@/modules/developer/components/api-key-gen'
import UserAvatar from '@/modules/user/components/user-avatar'
import { useTheme } from '@/providers/theme-provider'
import useConfirmModalStore from '@/store/confirm-modal-store'

import {
    BookOpenIcon,
    ChevronsUpDownIcon,
    CurlyBracketIcon,
    DevIcon,
    KeySharpIcon,
    LogoutIcon,
    MoonIcon,
    QuestionCircleIcon,
    SunIcon,
    SunMoonIcon,
} from '@/components/icons'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'

import { useModalState } from '@/hooks/use-modal-state'

const AppSidebarUser = () => {
    const router = useRouter()
    const apiKeyGenModal = useModalState()
    const { onOpen } = useConfirmModalStore()
    const { setTheme, resolvedTheme } = useTheme()

    const {
        currentAuth: { user },
        resetAuth,
    } = useAuthUser()

    const { orgname, branchname } = useParams({
        strict: false,
    }) as { orgname: string; branchname: string }

    const { mutate: handleSignout } = useSignOut({
        options: {
            onSuccess: () => {
                resetAuth()
                router.navigate({ to: '/auth/sign-in' as string })
                toast.success('Signed Out')
            },
        },
    })

    if (!user) return null

    return (
        <>
            <APIKeyGenModal
                titleClassName="hidden"
                descriptionClassName="hidden"
                {...apiKeyGenModal}
            />
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
                                <QuestionCircleIcon className="mr-2 size-4 duration-150 ease-in-out" />
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
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <DevIcon className="mr-2 size-4 duration-150 ease-in-out" />
                                    <span>For Developer</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                apiKeyGenModal.onOpenChange(
                                                    true
                                                )
                                            }
                                        >
                                            <KeySharpIcon className="mr-2 size-4" />
                                            <span>API Key</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                window.open(
                                                    '/developers',
                                                    '_blank'
                                                )
                                            }
                                        >
                                            <CurlyBracketIcon className="mr-2 size-4" />
                                            <span>Developer Policy</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                router.navigate({
                                                    to: `/org/${orgname}/branch/${branchname}/dev/documentation` as string,
                                                })
                                            }
                                        >
                                            <BookOpenIcon className="mr-2 size-4" />
                                            <span>Documentation</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
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
        </>
    )
}

export default AppSidebarUser
