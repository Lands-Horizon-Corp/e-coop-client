import { cn } from '@/lib'
import { useEffect } from 'react'
import { IconType } from 'react-icons/lib'
import { useRouter, useRouterState } from '@tanstack/react-router'

import {
    ShieldIcon,
    PaymentsIcon,
    AccountSettingIcon,
    TransactionListIcon,
} from '@/components/icons'
import { TAccountType, IUserData } from '@/server/types'

const PATHS: {
    hash: string
    name: string
    Icon: IconType
    visibleOn: TAccountType[] | 'all'
}[] = [
    {
        hash: 'account-settings',
        name: 'Account Settings',
        Icon: AccountSettingIcon,
        visibleOn: 'all',
    },
    { hash: 'security', name: 'Security', Icon: ShieldIcon, visibleOn: 'all' },
    {
        hash: 'mode-of-payments',
        name: 'Mode of Payments',
        Icon: PaymentsIcon,
        visibleOn: ['Member'],
    },
    {
        hash: 'transactions',
        name: 'Transactions',
        Icon: TransactionListIcon,
        visibleOn: ['Member'],
    },
]

const AccountProfileNavigation = ({
    currentUser,
}: {
    currentUser: IUserData
}) => {
    const router = useRouter()

    const routeHash = useRouterState({
        select: (state) => state.location.hash,
    })

    useEffect(() => {
        if (!router.history.location.hash)
            router.navigate({
                hash: PATHS[0].hash,
            })
    }, [router])

    return (
        <div className="ecoop-scroll mx-auto flex w-fit max-w-full justify-center gap-x-1 overflow-x-scroll rounded-xl bg-secondary p-1 text-sm sm:mx-0 sm:w-full sm:justify-start [&::-webkit-scrollbar]:h-[2px]">
            {PATHS.filter((hashPath) => {
                if (hashPath.visibleOn === 'all') return true
                return hashPath.visibleOn.includes(currentUser.accountType)
            }).map((hashPath) => (
                <button
                    key={hashPath.hash}
                    className={cn(
                        'flex w-fit cursor-pointer items-center gap-x-1 whitespace-nowrap rounded-lg p-2 text-secondary-foreground/70 duration-300 ease-in-out hover:text-secondary-foreground',
                        routeHash === hashPath.hash && 'bg-background'
                    )}
                    onClick={() => router.navigate({ hash: hashPath.hash })}
                >
                    <hashPath.Icon className="size-6 sm:size-4" />
                    <span className="hidden sm:block">{hashPath.name}</span>
                </button>
            ))}
        </div>
    )
}

export default AccountProfileNavigation
