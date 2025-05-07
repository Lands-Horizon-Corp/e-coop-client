import React from 'react'
import { VariantProps } from 'class-variance-authority'
import { useLocation, useRouter } from '@tanstack/react-router'

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '../ui/collapsible'
import {
    SidebarMenuSub,
    SidebarMenuItem,
    SidebarMenuButton,
    sidebarMenuButtonVariants,
} from '../ui/sidebar'
import { ChevronRightIcon } from '../icons'
import { TooltipContent } from '../ui/tooltip'
import { sidebarRouteMatcher } from './app-sidebar-utils'

import { cn } from '@/lib'
import { INavItem } from './types'

interface Props {
    navItem: INavItem
}

const AppSidebarButton = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<'button'> & {
        asChild?: boolean
        isActive?: boolean
        tooltip?: string | React.ComponentProps<typeof TooltipContent>
    } & VariantProps<typeof sidebarMenuButtonVariants> & {
            item: INavItem
        }
>(({ className, item, onClick, ...other }, ref) => {
    const router = useRouter()
    const pathname = useLocation({
        select: (location) => location.pathname,
    })

    const isRouteMatched = sidebarRouteMatcher(item.url, pathname)

    return (
        <SidebarMenuButton
            ref={ref}
            {...other}
            tooltip={item.title}
            className={cn(
                'max-full group/navself rounde-lg relative justify-between overflow-visible truncate text-ellipsis !font-light text-foreground/80 data-[active=true]:font-normal',
                className
            )}
            onClick={(some) => {
                if (item.type === 'item') {
                    router.navigate({ to: item.url })
                }
                onClick?.(some)
            }}
            isActive={isRouteMatched && item.type !== 'dropdown'}
        >
            <div
                className={cn(
                    'absolute -left-2 h-1/2 w-1.5 rounded-full bg-transparent delay-100 duration-300 ease-out group-hover/navself:bg-primary',
                    isRouteMatched && 'size-1.5 bg-primary',
                    item.isSub && '-left-3'
                )}
            />
            <span className="truncate">
                {(item.depth === 1 || item.type === 'dropdown') &&
                    item.icon && (
                        <item.icon
                            className={cn(
                                'mr-2 inline size-[18px] text-muted-foreground/80 duration-500 group-hover/navself:text-foreground',
                                isRouteMatched && 'text-foreground'
                            )}
                        />
                    )}
                {item.title}
            </span>
            {item.type === 'dropdown' && (
                <ChevronRightIcon className="transition-transform" />
            )}
        </SidebarMenuButton>
    )
})

const AppSidebarItem = ({ navItem }: Props) => {
    if (navItem.type === 'item') return <AppSidebarButton item={navItem} />

    if (navItem.type === 'dropdown')
        return (
            <SidebarMenuItem className="my-0">
                <Collapsible className="group/collapsible [&[data-state=open]>button>svg:last-child]:rotate-90">
                    <CollapsibleTrigger asChild>
                        <AppSidebarButton item={{ ...navItem }} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-1.5">
                        <SidebarMenuSub className="mx-0 ml-3 gap-y-2 px-0 pl-2">
                            {navItem.items.map((subItem, index) => (
                                <AppSidebarItem
                                    key={index}
                                    navItem={
                                        {
                                            ...subItem,
                                            isSub: true,
                                            url: `${navItem.url}${subItem.url}`,
                                        } as INavItem
                                    }
                                />
                            ))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </Collapsible>
            </SidebarMenuItem>
        )
}

export default AppSidebarItem
