'use client'

import { useRouter } from '@tanstack/react-router'
import { useLocation } from '@tanstack/react-router'

import { cn } from '@/helpers/tw-utils'

import { ArrowUpRightIcon, GearIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { ContactInfo } from './contact-info'

interface NavigationItem {
    name: string
    path: string
}

interface ExternalLink {
    title: string
    path: string
}

interface MobileDropdownProps {
    settingsNavItems: NavigationItem[]
    externalLinks: ExternalLink[]
}

export const MobileDropdown = ({
    settingsNavItems,
    externalLinks,
}: MobileDropdownProps) => {
    const router = useRouter()
    const { pathname } = useLocation()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    className="group absolute right-5 top-8 rounded-full hover:text-foreground"
                >
                    <GearIcon className="size-6 transition-transform duration-300 ease-out group-hover:rotate-45" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="max-h-[500px] w-80 overflow-y-auto">
                <DropdownMenuLabel>Account Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {settingsNavItems.map((item) => (
                    <DropdownMenuItem
                        key={item.path}
                        className={cn(
                            'text-muted-foreground cursor-pointer',
                            pathname === item.path &&
                                'text-foreground bg-accent'
                        )}
                        onClick={() =>
                            router.navigate({ to: item.path as string })
                        }
                    >
                        {item.name}
                    </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />

                {externalLinks.map((item) => (
                    <DropdownMenuItem
                        key={item.path}
                        className="text-muted-foreground cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation()
                            window.open(item.path, '_blank')
                        }}
                    >
                        <div className="flex items-start gap-2 w-full">
                            <ArrowUpRightIcon className="size-4 mt-0.5 shrink-0" />
                            <span className="text-wrap">{item.title}</span>
                        </div>
                    </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />

                <div className="p-2">
                    <ContactInfo />
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
