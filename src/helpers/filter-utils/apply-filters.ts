// import { TFilterPayload, TFinalFilter } from '@/contexts/filter-context'

// /**
//  * Apply filter payload to client-side data
//  * This demonstrates how to use the filter payload with your data
//  */
// export function applyFilters<T extends Record<string, any>>(
//     data: T[],
//     payload: TFilterPayload
// ): T[] {
//     if (!payload.filters.length) return data

//     return data.filter((item) => {
//         const results = payload.filters.map((filter) =>
//             matchesFilter(item, filter)
//         )

//         // Apply AND/OR logic
//         return payload.logic === 'AND'
//             ? results.every((r) => r)
//             : results.some((r) => r)
//     })
// }

// function matchesFilter<T extends Record<string, any>>(
//     item: T,
//     filter: TFinalFilter
// ): boolean {
//     const value = item[filter.field]

//     switch (filter.mode) {
//         case 'equal':
//             return value === filter.value
//         case 'nequal':
//             return value !== filter.value
//         case 'contains':
//             return String(value)
//                 .toLowerCase()
//                 .includes(String(filter.value).toLowerCase())
//         case 'ncontains':
//             return !String(value)
//                 .toLowerCase()
//                 .includes(String(filter.value).toLowerCase())
//         case 'startswith':
//             return String(value)
//                 .toLowerCase()
//                 .startsWith(String(filter.value).toLowerCase())
//         case 'endswith':
//             return String(value)
//                 .toLowerCase()
//                 .endsWith(String(filter.value).toLowerCase())
//         case 'isempty':
//             return !value || value === ''
//         case 'isnotempty':
//             return value && value !== ''
//         case 'gt':
//             return Number(value) > Number(filter.value)
//         case 'gte':
//             return Number(value) >= Number(filter.value)
//         case 'lt':
//             return Number(value) < Number(filter.value)
//         case 'lte':
//             return Number(value) <= Number(filter.value)
//         case 'range':
//             const rangeValue = filter.value as any
//             return (
//                 Number(value) >= Number(rangeValue.from) &&
//                 Number(value) <= Number(rangeValue.to)
//             )
//         case 'before':
//             return new Date(value) < new Date(filter.value as string)
//         case 'after':
//             return new Date(value) > new Date(filter.value as string)
//         default:
//             return true
//     }
// }
