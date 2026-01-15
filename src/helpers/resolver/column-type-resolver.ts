import { TColumnDataTypes } from '@/contexts/filter-context'
import { Table } from '@tanstack/react-table'

/**
 * ColumnTypeResolver - Automatically infers column data types from table data
 *
 * This eliminates the need to manually specify dataType in column definitions.
 * It samples actual data from the table and intelligently determines whether
 * a column contains numbers, dates, booleans, or text.
 *
 * Usage:
 * ```ts
 * const resolver = new ColumnTypeResolver(table)
 * const type = resolver.getColumnType('created_at') // returns 'date'
 * ```
 */
export class ColumnTypeResolver<TData = unknown> {
    private typeCache: Map<string, TColumnDataTypes> = new Map()
    private readonly sampleSize: number

    constructor(
        private table: Table<TData>,
        options?: { sampleSize?: number }
    ) {
        this.sampleSize = options?.sampleSize ?? 10
    }

    /**
     * Infer data type from a single value
     */
    static inferType(key: string, sampleValue: unknown): TColumnDataTypes {
        // Handle null/undefined
        if (sampleValue == null) {
            return 'text' // default for empty values
        }

        // Boolean check
        if (typeof sampleValue === 'boolean') {
            return 'boolean'
        }

        // Number check
        if (typeof sampleValue === 'number') {
            return 'number'
        }

        // String-based inference
        if (typeof sampleValue === 'string') {
            const trimmed = sampleValue.trim()

            // Empty string defaults to text
            if (trimmed === '') {
                return 'text'
            }

            // Time pattern (HH:MM:SS or HH:MM)
            if (/^\d{1,2}:\d{2}(:\d{2})?(\s?[AP]M)?$/i.test(trimmed)) {
                return 'time'
            }

            // ISO Date pattern or common date formats
            if (this.isDateString(trimmed)) {
                return 'date'
            }

            // Numeric string (but stored as string)
            if (!isNaN(Number(trimmed)) && trimmed !== '') {
                // Check if it's a timestamp or phone number or ID
                if (
                    key.toLowerCase().includes('id') ||
                    key.toLowerCase().includes('code') ||
                    key.toLowerCase().includes('phone') ||
                    trimmed.length > 15
                ) {
                    return 'text'
                }
                return 'number'
            }

            return 'text'
        }

        // Date object check
        if (sampleValue instanceof Date) {
            return 'date'
        }

        // Default fallback
        return 'text'
    }

    /**
     * Enhanced date string detection
     */
    private static isDateString(value: string): boolean {
        // ISO 8601 formats
        if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
            return !isNaN(Date.parse(value))
        }

        // Common formats: MM/DD/YYYY, DD/MM/YYYY, YYYY/MM/DD
        if (/^\d{1,4}[/-]\d{1,2}[/-]\d{1,4}/.test(value)) {
            return !isNaN(Date.parse(value))
        }

        // Month name formats: Jan 1, 2025 or 1 Jan 2025
        if (/^[A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4}/.test(value)) {
            return !isNaN(Date.parse(value))
        }

        return false
    }

    /**
     * Get the inferred type for a specific column
     * Uses cached result if available, otherwise samples data
     */
    getColumnType(columnId: string): TColumnDataTypes {
        // Return cached type if available
        if (this.typeCache.has(columnId)) {
            return this.typeCache.get(columnId)!
        }

        // Sample data from the table
        const rows = this.table.getRowModel().rows
        const samples: unknown[] = []

        // Collect up to sampleSize non-null values
        for (
            let i = 0;
            i < rows.length && samples.length < this.sampleSize;
            i++
        ) {
            const value = rows[i].getValue(columnId)
            if (value != null) {
                samples.push(value)
            }
        }

        // If no data available, default to text
        if (samples.length === 0) {
            this.typeCache.set(columnId, 'text')
            return 'text'
        }

        // Infer type from samples
        const types = samples.map((sample) =>
            ColumnTypeResolver.inferType(columnId, sample)
        )

        // Determine the most common type (consensus)
        const typeCounts = types.reduce(
            (acc, type) => {
                acc[type] = (acc[type] || 0) + 1
                return acc
            },
            {} as Record<TColumnDataTypes, number>
        )

        // Find the type with the highest count
        let inferredType: TColumnDataTypes = 'text'
        let maxCount = 0
        for (const [type, count] of Object.entries(typeCounts)) {
            if (count > maxCount) {
                maxCount = count
                inferredType = type as TColumnDataTypes
            }
        }

        // Cache and return
        this.typeCache.set(columnId, inferredType)
        return inferredType
    }

    /**
     * Get types for all columns at once
     */
    getAllColumnTypes(): Record<string, TColumnDataTypes> {
        const result: Record<string, TColumnDataTypes> = {}
        const columns = this.table.getAllLeafColumns()

        for (const col of columns) {
            if (col.id !== 'select' && col.getIsVisible()) {
                result[col.id] = this.getColumnType(col.id)
            }
        }

        return result
    }

    /**
     * Clear the type cache (useful when data changes)
     */
    clearCache(): void {
        this.typeCache.clear()
    }

    /**
     * Pre-populate cache with known types (optional override)
     */
    setColumnType(columnId: string, type: TColumnDataTypes): void {
        this.typeCache.set(columnId, type)
    }
}

/**
 * Hook-friendly wrapper for use in React components
 */
export function useColumnTypeResolver<TData>(
    table: Table<TData>,
    options?: { sampleSize?: number }
) {
    const resolver = new ColumnTypeResolver(table, options)
    return resolver
}
