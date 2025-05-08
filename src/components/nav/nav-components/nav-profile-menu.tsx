import { toast } from 'sonner'
import { useRouter } from '@tanstack/react-router'

import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import UserAvatar from '@/components/user-avatar'
import { LogoutIcon, UserIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'

import { useSignOut } from '@/hooks/api-hooks/use-auth'
import { useAuthStore } from '@/store/user-auth-store'
import useConfirmModalStore from '@/store/confirm-modal-store'

const NavProfileMenu = () => {
    const router = useRouter()
    const { onOpen } = useConfirmModalStore()
    const {
        currentAuth: { user },
        authStatus,
        resetAuth,
    } = useAuthStore()

    const { mutate: handleSignout, isPending } = useSignOut({
        onSuccess: () => {
            router.navigate({ to: '/auth/sign-in' as string })

            resetAuth()
            toast.success('Signed out')
        },
    })

    if (!user || authStatus !== 'authorized') return null

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full p-0.5"
                >
                    {isPending ? (
                        <LoadingSpinner />
                    ) : (
                        <UserAvatar
                            className="size-full"
                            fallbackClassName="bg-transparent"
                            src={user.media?.download_url ?? ''}
                            fallback={user.user_name.charAt(0) ?? '-'}
                        />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>{user.user_name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => {
                        router.navigate({
                            to: '/account' as string,
                        })
                    }}
                >
                    <UserIcon className="mr-2 size-4 duration-150 ease-in-out" />
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() =>
                        onOpen({
                            title: 'Sign Out',
                            description: 'Are you sure you want to sign out?',
                            onConfirm: () => handleSignout(),
                        })
                    }
                >
                    <LogoutIcon className="mr-2 size-4 duration-150 ease-in-out" />
                    <span>Sign Out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default NavProfileMenu
