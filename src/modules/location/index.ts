import barangays from './data/barangays.json'
import municipalities from './data/cities-municipalities.json'
import { IBarangay } from './location.types'

const barangaysByMunicipalityName = new Map<string, IBarangay[]>()
const municipalityCodeToName = new Map<string, string>()

let initialized = false

export function normalizeLocation(value: string) {
    return value
        .toLowerCase()
        .replace(/\(.*?\)/g, '')
        .replace(/^city of\s+/g, '')
        .replace(/^municipality of\s+/g, '')
        .replace(/\./g, '')
        .replace(/\s+/g, ' ')
        .trim()
}

export const initializeBarangayMapping = () => {
    if (initialized) return

    for (const m of municipalities as any[]) {
        municipalityCodeToName.set(m.code, m.name)
        barangaysByMunicipalityName.set(normalizeLocation(m.name), [])
    }

    for (const brgy of barangays as any[]) {
        const municipalityCode = brgy.municipalityCode || brgy.cityCode

        const municipalityName = municipalityCodeToName.get(municipalityCode)

        if (!municipalityName) continue

        const key = normalizeLocation(municipalityName)

        const formatted: IBarangay = {
            code: brgy.code,
            name: brgy.name,
            nameLower: normalizeLocation(brgy.name),
        }

        barangaysByMunicipalityName.get(key)!.push(formatted)
    }

    for (const [, list] of barangaysByMunicipalityName) {
        list.sort((a, b) => a.name.localeCompare(b.name))
    }

    initialized = true
}

export const getBarangaysByMunicipalityName = (municipalityName: string) => {
    console.log(
        'Finding munic brgy ',
        municipalityName,
        'Normed',
        normalizeLocation(municipalityName),
        'Found',
        barangaysByMunicipalityName.get(normalizeLocation(municipalityName))
    )

    return (
        barangaysByMunicipalityName.get(normalizeLocation(municipalityName)) ??
        []
    )
}

export const searchBarangays = (
    municipalityName: string,
    query: string,
    limit = 20
) => {
    const list =
        barangaysByMunicipalityName.get(normalizeLocation(municipalityName)) ??
        []

    if (!query) return list.slice(0, limit)

    const q = normalizeLocation(query)

    return list.filter((b) => b.nameLower.includes(q)).slice(0, limit)
}
