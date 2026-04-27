import { CSSProperties } from 'react'

import { Column } from '@tanstack/react-table'

export const getPinningStyles = <T>(column: Column<T>): CSSProperties => {
    const isPinned = column.getIsPinned()
    const isLastLeftPinnedColumn =
        isPinned === 'left' && column.getIsLastColumn('left')
    const isFirstRightPinnedColumn =
        isPinned === 'right' && column.getIsFirstColumn('right')

    return {
        left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
        right:
            isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
        position: isPinned ? 'sticky' : 'relative',
        width: column.getSize(),
        minWidth: column.getSize(),
        maxWidth: column.getSize(),
        zIndex: isPinned ? 3 : 1,
        boxShadow: isLastLeftPinnedColumn
            ? '2px 0 0 0 hsl(var(--border)) inset'
            : isFirstRightPinnedColumn
              ? '-2px 0 0 0 hsl(var(--border)) inset'
              : undefined,
    }
}
