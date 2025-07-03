import { ILocationJSON } from './address-types'
import ADDRESSES_DATA from './addresses-data-2019.json'

export const getProvinces = (data: ILocationJSON = ADDRESSES_DATA): string[] =>
    Object.values(data).flatMap((region) => Object.keys(region.province_list))

export const getMunicipalities = (
    data: ILocationJSON = ADDRESSES_DATA
): string[] =>
    Object.values(data)
        .flatMap((region) => Object.values(region.province_list))
        .flatMap((province) => Object.keys(province.municipality_list))

export const getMunicipalitiesByProvince = (
    province: string,
    data: ILocationJSON = ADDRESSES_DATA
): string[] =>
    Object.values(data).flatMap((region) =>
        region.province_list[province]?.municipality_list
            ? Object.keys(region.province_list[province].municipality_list)
            : []
    )

export const getBarangays = (data: ILocationJSON = ADDRESSES_DATA): string[] =>
    Object.values(data)
        .flatMap((region) => Object.values(region.province_list))
        .flatMap((province) => Object.values(province.municipality_list))
        .flatMap((municipality) => municipality.barangay_list)

export const getBarangaysByMunicipality = (
    municipality: string,
    data: ILocationJSON = ADDRESSES_DATA
): string[] =>
    Object.values(data)
        .flatMap((region) => Object.values(region.province_list))
        .flatMap(
            (province) =>
                province.municipality_list[municipality]?.barangay_list || []
        )
