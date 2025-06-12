import { useEffect, useMemo, useState } from 'react'
import { countries } from 'country-data-list'
import { TimezoneData, timezones } from '@/lib/time-zones'
import { Country } from 'react-phone-number-input'

export interface CountryOptionsProps {
    alpha2: string
    alpha3: string
    countryCallingCodes: string[]
    currencies: string[]
    emoji?: string
    ioc: string
    languages: string[]
    name: string
    status: string
}

const getCountryAlpha2Code = (
    options: CountryOptionsProps[],
    countryNameOrAlpha2?: Country
): Country | null => {
    if (!countryNameOrAlpha2) {
        return null
    }
    const foundCountry = options.find(
        (country) =>
            country.name.toLowerCase() === countryNameOrAlpha2.toLowerCase() ||
            country.alpha2.toLowerCase() === countryNameOrAlpha2.toLowerCase()
    )
    return (foundCountry?.alpha2 as Country) ?? null
}

export const useLocationInfo = () => {
    const [countryName, setCountryName] = useState<string | null>(null)
    const [stateName, setStateName] = useState<string | null>(null)
    const [countryAlpha2Code, setCountryAlpha2Code] = useState<
        Country | undefined
    >()

    const availableCountryOptions = useMemo(() => {
        return countries.all.filter(
            (country: CountryOptionsProps) =>
                country.emoji &&
                country.status !== 'deleted' &&
                country.ioc !== 'PRK'
        )
    }, [])

    useEffect(() => {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

        if (!timezone) {
            console.warn('Timezone could not be determined by browser.')
            setCountryName(null)
            setStateName(null)
            setCountryAlpha2Code(undefined)
            return
        }

        let detectedAlpha2: Country | undefined = undefined
        const timezoneData: TimezoneData | undefined = timezones[timezone]

        if (
            timezoneData &&
            Array.isArray(timezoneData.c) &&
            timezoneData.c.length > 0
        ) {
            const primaryCountryAlpha2FromTimezone = timezoneData.c[0]
            const selectedCountry = availableCountryOptions.find(
                (item) => item.alpha2 === primaryCountryAlpha2FromTimezone
            )

            if (selectedCountry) {
                setCountryName(selectedCountry.name)
                detectedAlpha2 = selectedCountry.alpha2 as Country
            } else {
                console.warn(
                    `Country (alpha2: ${primaryCountryAlpha2FromTimezone}) found in timezone data but not in available country options.`
                )
                setCountryName(null)
            }
        } else {
            console.warn(
                `No valid country data found for timezone: ${timezone}`
            )
            setCountryName(null)
        }

        const getCountryCode =
            getCountryAlpha2Code(availableCountryOptions, detectedAlpha2) ??
            undefined

        setCountryAlpha2Code(getCountryCode)

        const parts = timezone.split('/')
        if (parts.length > 1) {
            const rawStatePart = parts[parts.length - 1]
            const formattedStateName = rawStatePart.replace(/_/g, ' ')
            setStateName(formattedStateName)
        } else {
            setStateName(null)
        }
    }, [availableCountryOptions])

    return {
        country: countryName,
        state: stateName,
        countryCode: countryAlpha2Code,
    }
}
