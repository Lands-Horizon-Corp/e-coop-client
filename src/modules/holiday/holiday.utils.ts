import { TEntityId } from '@/types'

import { THolidayHookMode } from './holiday.types'

export const normalizeHolidayMode = (
    year: number | undefined,
    currencyId: TEntityId | undefined
): THolidayHookMode => {
    if (year && currencyId) {
        return 'year-currency'
    } else if (year && !currencyId) {
        return 'year'
    } else if (!year && currencyId) {
        return 'currency'
    } else {
        return 'all'
    }
}
