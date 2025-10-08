import React from 'react'

import { useLocation, useRouter } from '@tanstack/react-router'

import { cn } from '@/helpers/tw-utils'
import { VariantProps } from 'class-variance-authority'

import { ChevronRightIcon } from '@/components/icons'

import { useModalState } from '@/hooks/use-modal-state'

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '../collapsible'
import { Popover, PopoverContent, PopoverTrigger } from '../popover'
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    sidebarMenuButtonVariants,
    useSidebar,
} from '../sidebar'
import { TooltipContent } from '../tooltip'
import { sidebarRouteMatcher } from './app-sidebar-utils'
import { INavItem } from './types'

// adjust import path as needed

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
            className={cn(
                'max-full group/navself rounde-lg relative justify-between overflow-visible truncate text-ellipsis !font-light text-foreground/80 data-[active=true]:font-normal',
                className
            )}
            isActive={isRouteMatched && item.type !== 'dropdown'}
            onClick={(some) => {
                if (item.type === 'item') {
                    router.navigate({ to: item.url })
                }
                onClick?.(some)
            }}
            tooltip={item.title}
        >
            <div
                className={cn(
                    'absolute -left-2 h-1/2 w-1.5 rounded-full bg-transparent delay-100 duration-300 ease-out group-hover/navself:bg-primary',
                    isRouteMatched && 'size-1.5 bg-primary',
                    item.isSub && '-left-3'
                )}
            />
            <span className="data-[state=collapsed]:hidden">
                {
                    // SINCE OUR SIDEBAR IS ICON MODE NOW WHEN COLLAPSED, NEED TO SHOW ICON ON POPEVER VERSION
                    /*(item.depth === 1 || item.type === 'dropdown') && */
                    item.icon && (
                        <item.icon
                            className={cn(
                                ' [[data-state=collapsed]_&]:mr-0 mr-2 inline size-[18px] text-muted-foreground/80 duration-500 group-hover/navself:text-foreground',
                                isRouteMatched && 'text-foreground',
                                !item?.depth && 'text-muted-foreground/40'
                            )}
                        />
                    )
                }
                <span className="[[data-state=collapsed]_&]:hidden">
                    {item.title}
                </span>
            </span>
            {item.type === 'dropdown' && (
                <ChevronRightIcon className="transition-transform [[data-state=collapsed]_&]:hidden" />
            )}
        </SidebarMenuButton>
    )
})

const AppSidebarItem = ({ navItem }: Props) => {
    const { open } = useSidebar()
    const popoverState = useModalState(false)

    if (navItem.type === 'item') return <AppSidebarButton item={navItem} />

    if (navItem.type === 'dropdown' && open)
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

    if (navItem.type === 'dropdown' && !open)
        return (
            <SidebarMenuItem className="my-0">
                <Popover
                    onOpenChange={popoverState.onOpenChange}
                    open={popoverState.open}
                >
                    <PopoverTrigger asChild>
                        <AppSidebarButton
                            item={{ ...navItem }}
                            onClick={() => popoverState.onOpenChange(true)}
                        />
                    </PopoverTrigger>
                    <PopoverContent
                        align="start"
                        className="px-0 shadow-lg bg-popover/90 backdrop-blur-xs"
                        data-popovered="yes"
                        onClick={() => popoverState.onOpenChange(false)}
                    >
                        <p className="px-4 pb-2">
                            {' '}
                            {navItem?.icon && (
                                <navItem.icon className="inline [[data-state=collapsed]_&]:mr-0" />
                            )}{' '}
                            {navItem.title}
                        </p>
                        <SidebarMenuSub className="gap-y-2 px-4 mx-5">
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
                    </PopoverContent>
                </Popover>
            </SidebarMenuItem>
        )
}

export default AppSidebarItem
