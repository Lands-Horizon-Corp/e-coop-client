import { useQuery } from '@tanstack/react-query'

import { TimezoneData } from './time-zone-type'
import TimeZoneData from './timeZones.json'

export const useGetTimeZones = () => {
    return useQuery<Record<string, TimezoneData>>({
        queryKey: ['timezones'],
        queryFn: async () => {
            return TimeZoneData as unknown as Record<string, TimezoneData>
        },
        staleTime: Infinity,
    })
}
