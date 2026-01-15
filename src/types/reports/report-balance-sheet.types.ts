export interface IReportBalanceSheet {
    header_title: string
    header_address: string
    tax_number: string

    report_title: string
    as_of_date: string

    report_type: string
    asset_entries: Array<{
        account_title: string
        account_entries: Array<{
            description: string
            budget_amount?: number
            actual_amount?: number
            current_amount?: number
            variance_amount?: number
            previous_amount?: number
            percentage?: number
            inc_or_dec_amount?: string
            previous_year_amount?: number
        }>
        total_cash_in_bank: number
        petty_cash_fund: number
    }>

    total_property_and_equipment_budget?: number
    total_property_and_equipment_actual?: number
    total_property_and_equipment_current?: number
    total_property_and_equipment_variance?: number
    total_property_and_equipment_previous?: number
    total_property_and_equipment_percentage?: number
    total_property_and_equipment_inc_or_dec?: string
    total_property_and_equipment_previous_year?: number

    total_assets_budget?: number
    total_assets_actual?: number
    total_assets_current?: number
    total_assets_variance?: number
    total_assets_previous?: number
    total_assets_percentage?: number
    total_assets_inc_or_dec?: string
    total_assets_previous_year?: number

    user_id: string
    report_date: string
    time: string
    page_number: number
}
