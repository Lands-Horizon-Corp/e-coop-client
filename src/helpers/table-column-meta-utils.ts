import { TColumnDataTypes } from '@/contexts/filter-context'
import { ColumnTypeResolver } from '@/helpers/resolver/column-type-resolver'
import { ColumnDef, Table } from '@tanstack/react-table'

export interface IColumnReportFilter {
    field: string
    label: string
    dataType: TColumnDataTypes
    filterable?: boolean
}

/**
 * Extract column metadata from TanStack Table column definitions
 * Now with automatic type inference using ColumnTypeResolver
 */
export function extractColumnMetadata<T>(
    columns: ColumnDef<T, unknown>[],
    table?: Table<T>
): IColumnReportFilter[] {
    // Initialize type resolver if table is provided
    const typeResolver = table ? new ColumnTypeResolver(table) : null

    return columns
        .map((col): IColumnReportFilter | null => {
            // Skip columns without accessorKey
            if (!('accessorKey' in col) || !col.accessorKey) {
                return null
            }

            const field = String(col.accessorKey)

            // Check if column is explicitly marked as non-filterable
            const meta = col.meta as {
                filterable?: boolean
                dataType?: TColumnDataTypes
                filterType?: TColumnDataTypes
                headerLabel?: string
            }
            if (meta?.filterable === false) {
                return null
            }

            // Extract label from header
            let label = field
            if (typeof col.header === 'string') {
                label = col.header
            } else if (meta?.headerLabel) {
                label = meta.headerLabel
            }

            // Determine data type (priority: meta > auto-infer > default)
            let dataType: TColumnDataTypes = 'text'

            if (meta?.dataType) {
                // Explicit dataType in meta takes highest priority
                dataType = meta.dataType
            } else if (meta?.filterType) {
                // Legacy filterType support
                dataType = meta.filterType
            } else if (typeResolver) {
                // Auto-infer from actual data using ColumnTypeResolver
                dataType = typeResolver.getColumnType(field)
            }

            return {
                field,
                label,
                dataType,
                filterable: true,
            }
        })
        .filter((col): col is IColumnReportFilter => col !== null)
}

/**
 * Helper to create column def with filter metadata for future usage
 */
export function createFilterableColumn<T, TValue = any>(
    accessorKey: keyof T & string,
    config: {
        header: string
        dataType: TColumnDataTypes
        cell?: (info: any) => React.ReactNode
        filterable?: boolean
    }
): ColumnDef<T, TValue> {
    return {
        accessorKey,
        header: config.header,
        cell: config.cell,
        meta: {
            dataType: config.dataType,
            headerLabel: config.header,
            filterable: config.filterable ?? true,
        },
    } as ColumnDef<T, TValue>
}
