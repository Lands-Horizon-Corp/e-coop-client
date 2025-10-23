import React from 'react'

import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type ScrollableSectionProps<T> = {
    group: {
        title: string
        items: T[]
        icon: React.ReactNode
    }
    sectionIndex: number
    renderItem: (item: T, index: number) => React.ReactNode
    itemClassName?: string
    showArrows?: boolean
    arrowThreshold?: number
    scrollAmount?: number
    containerClassName?: string
    headerClassName?: string
}

const ScrollableSection = <T extends { id: string | number }>({
    group,
    sectionIndex,
    renderItem,
    itemClassName = 'min-w-[280px] max-w-[280px]',
    showArrows = true,
    arrowThreshold = 4,
    scrollAmount = 300,
    containerClassName = '',
    headerClassName = '',
}: ScrollableSectionProps<T>) => {
    // Add safety checks for group and items
    if (!group) {
        console.warn('ScrollableSection: group is undefined')
        return null
    }

    const { title = 'Untitled Section', items = [], icon = null } = group

    // Additional safety check for items array
    if (!Array.isArray(items)) {
        console.warn('ScrollableSection: items is not an array', {
            items,
            group,
        })
        return null
    }

    // Return null if no items to display
    if (items.length === 0) {
        return null
    }

    const scroll = (direction: 'left' | 'right') => {
        const container = document.getElementById(`scroll-${sectionIndex}`)
        if (container) {
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            })
        }
    }

    const shouldShowArrows = showArrows && items.length > arrowThreshold

    return (
        <div className={`space-y-4 ${containerClassName}`}>
            {/* Header */}
            <div className={`flex items-center gap-2 ${headerClassName}`}>
                {icon}
                <h2 className="text-xl font-semibold">{title}</h2>
                <Badge className="ml-2" variant="secondary">
                    {items.length}
                </Badge>
            </div>

            {/* Scrollable Container */}
            <div className="relative group">
                {/* Left Arrow */}
                {shouldShowArrows && (
                    <Button
                        aria-label="Scroll left"
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background shadow-md"
                        onClick={() => scroll('left')}
                        size="sm"
                        variant="ghost"
                    >
                        <ChevronLeftIcon className="h-5 w-5" />
                    </Button>
                )}

                {/* Items Container */}
                <div
                    className="flex gap-4 !p-2 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
                    id={`scroll-${sectionIndex}`}
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    {items.map((item, index) => {
                        if (!item || (!item.id && item.id !== 0)) {
                            console.warn(
                                `ScrollableSection: Item at index ${index} is invalid`,
                                item
                            )
                            return null
                        }

                        return (
                            <div className={itemClassName} key={item.id}>
                                {renderItem(item, index)}
                            </div>
                        )
                    })}
                </div>

                {/* Right Arrow */}
                {shouldShowArrows && (
                    <Button
                        aria-label="Scroll right"
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background shadow-md"
                        onClick={() => scroll('right')}
                        size="sm"
                        variant="ghost"
                    >
                        <ChevronRightIcon className="h-5 w-5" />
                    </Button>
                )}
            </div>
        </div>
    )
}

export default ScrollableSection
