import { useLocalStorage } from '@/hooks/use-localstorage'

export const useTableColumnPersist = ({ key }: { key: string }) => {
    const [columnOrder, setColumnOrder] = useLocalStorage<string[]>(
        `data-table-column-order-${key}`,
        []
    )
    const [columnVisibility, setColumnVisibility] = useLocalStorage<{
        [key: string]: boolean
    }>('data-table-column-visibility', {})

    return {
        columnOrder,
        setColumnOrder,
        columnVisibility,
        setColumnVisibility,
    }
}
