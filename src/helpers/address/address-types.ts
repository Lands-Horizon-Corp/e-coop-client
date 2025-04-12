export type TBarangayList = string[]

export interface IMunicipalityData {
    barangay_list: TBarangayList
}

export interface IProvinceData {
    municipality_list: {
        [municipalityName: string]: IMunicipalityData
    }
}

export interface IRegionData {
    region_name: string
    province_list: {
        [provinceName: string]: IProvinceData
    }
}

export interface ILocationJSON {
    [regionCode: string]: IRegionData
}
