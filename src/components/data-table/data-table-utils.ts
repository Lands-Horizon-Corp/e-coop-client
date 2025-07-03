import { CSSProperties } from 'react'

import { Column } from '@tanstack/react-table'

export const getPinningStyles = <T>(column: Column<T>): CSSProperties => {
    const isPinned = column.getIsPinned()
    return {
        left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
        right:
            isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
        position: isPinned ? 'sticky' : 'relative',
        width: column.getSize(),
        zIndex: isPinned ? 1 : 0,
    }
}
