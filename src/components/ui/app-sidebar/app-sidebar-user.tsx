import { Link, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

import { useSignOut } from '@/modules/authentication'
import { useAuthUser } from '@/modules/authentication/authgentication.store'
import { APIKeyGenModal } from '@/modules/developer/components/api-key-gen'
import useConfirmModalStore from '@/store/confirm-modal-store'

import {
    ChevronsUpDownIcon,
    LogoutIcon,
    SettingsIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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

    const {
        currentAuth: { user },
        resetAuth,
    } = useAuthUser()

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
                descriptionClassName="hidden"
                titleClassName="hidden"
                {...apiKeyGenModal}
            />
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton className="!py-6">
                                <ImageDisplay
                                    className="size-5 rounded-[4rem] duration-150 ease-in-out"
                                    src={user.media?.download_url ?? ''}
                                />
                                <div className="grid [[data-side=left][data-state=collapsed]_&]:hidden flex-1 text-left text-sm leading-tight">
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
                        <DropdownMenuContent align="end" side="right">
                            <DropdownMenuItem>
                                <Link to="/account-profile">
                                    <SettingsIcon className="inline mr-2 size-4 duration-150 ease-in-out" />
                                    <span>Manage Profile</span>
                                </Link>
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
        </>
    )
}

export default AppSidebarUser
