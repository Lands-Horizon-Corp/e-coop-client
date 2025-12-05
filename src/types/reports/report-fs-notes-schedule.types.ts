export interface IReportFSNotesSchedule {
    header_title: string
    header_address: string
    tax_number: string

    report_type:
        | 'STANDARD'
        | 'COMPARATIVE_MONTHLY'
        | 'COMPARATIVE_YEARLY'
        | 'CLOSED_BOOK'
        | 'BUDGET_FORECASTING'
    as_of_date: string
    date_from?: string
    date_to?: string
    current_assets: {
        account_title: string
        assets: Array<{
            account_title: string
            current_amount?: string
            previous_amount?: string
            previous_year_amount?: string
            actual_amount?: string
            budget_amount?: string
            variance_amount?: string
            inc_or_dec?: string
            percentage?: string
        }>
        total_loans_receivables_current?: string
        total_loans_receivables_previous?: string
        total_loans_receivables_previous_year?: string
        total_loans_receivables_actual?: string
        total_loans_receivables_budget?: string
        total_loans_receivables_variance?: string
        total_loans_receivables_inc_or_dec?: string
        total_loans_receivables_percentage?: string
    }

    total_current_assets_current?: string
    total_current_assets_previous?: string
    total_current_assets_previous_year?: string
    total_current_assets_actual?: string
    total_current_assets_budget?: string
    total_current_assets_variance?: string
    total_current_assets_inc_or_dec?: string
    total_current_assets_percentage?: string

    long_term_investment_current?: string
    long_term_investment_previous?: string
    long_term_investment_previous_year?: string
    long_term_investment_actual?: string
    long_term_investment_budget?: string
    long_term_investment_variance?: string
    long_term_investment_inc_or_dec?: string
    long_term_investment_percentage?: string

    total_long_term_investment_current?: string
    total_long_term_investment_previous?: string
    total_long_term_investment_previous_year?: string
    total_long_term_investment_actual?: string
    total_long_term_investment_budget?: string
    total_long_term_investment_variance?: string
    total_long_term_investment_inc_or_dec?: string
    total_long_term_investment_percentage?: string

    property_and_equipment_current?: string
    property_and_equipment_previous?: string
    property_and_equipment_previous_year?: string
    property_and_equipment_actual?: string
    property_and_equipment_budget?: string
    property_and_equipment_variance?: string
    property_and_equipment_inc_or_dec?: string
    property_and_equipment_percentage?: string

    total_assets_current?: string
    total_assets_previous?: string
    total_assets_previous_year?: string
    total_assets_actual?: string
    total_assets_budget?: string
    total_assets_variance?: string
    total_assets_inc_or_dec?: string
    total_assets_percentage?: string

    page_number: number
    user_id: string
    report_date: string
    time: string
}
