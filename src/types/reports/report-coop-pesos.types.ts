export interface IReportCOOPPesos {
    header_title: string
    header_address: string
    tax_number: string

    report_title: string
    end_date: string

    porfolio_quality_entries: [
        {
            title: string
            description: string
            standard: string
            hi_score: number
            values_amount: number
            values_total: number
            result_percentage: number
            points: number
        },
    ]
    efficiency_entries: [
        {
            title: string
            description: string
            standard: string
            hi_score: number
            values_amount: number
            values_total: number
            result_percentage: number
            points: number
        },
    ]
}
