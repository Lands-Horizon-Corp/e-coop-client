'use client'

import * as React from 'react'
import {
    Arrow,
    HoverCard as HoverCardPrimitive,
    HoverCardTrigger as HoverCardTrigerPrimitive,
    HoverCardContent as HoverCardContentPrimitive,
} from '@radix-ui/react-hover-card'

import { cn } from '@/lib'

function HoverCard({
    ...props
}: React.ComponentProps<typeof HoverCardPrimitive>) {
    return <HoverCardPrimitive data-slot="hover-card" {...props} />
}

function HoverCardTrigger({
    ...props
}: React.ComponentProps<typeof HoverCardTrigerPrimitive>) {
    return (
        <HoverCardTrigerPrimitive data-slot="hover-card-trigger" {...props} />
    )
}

function HoverCardContent({
    className,
    align = 'center',
    sideOffset = 4,
    showArrow = false,
    ...props
}: React.ComponentProps<typeof HoverCardContentPrimitive> & {
    showArrow?: boolean
}) {
    return (
        <HoverCardContentPrimitive
            data-slot="hover-card-content"
            align={align}
            sideOffset={sideOffset}
            className={cn(
                'outline-hidden z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                className
            )}
            {...props}
        >
            {props.children}
            {showArrow && (
                <Arrow className="-my-px fill-popover drop-shadow-[0_1px_0_var(--border)]" />
            )}
        </HoverCardContentPrimitive>
    )
}

export { HoverCard, HoverCardContent, HoverCardTrigger }
