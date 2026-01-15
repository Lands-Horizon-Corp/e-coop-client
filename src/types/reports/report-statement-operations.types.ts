export interface IReportStatementOperations {
    report_type:
        | 'STANDARD'
        | 'COMPARATIVE_MONTHLY'
        | 'COMPARATIVE_YEARLY'
        | 'BUDGET_FORECASTING'

    header_title: string
    header_address: string
    tax_number: string

    report_title: string
    as_of_date: string

    revenue_amount?: string
    total_revenue_amount?: string
    total_revenue_budget?: string
    total_revenue_actual?: string
    total_revenue_variance?: string
    total_revenue_percentage?: string
    total_revenue_inc_or_dec?: string
    total_revenue_previous?: string
    total_revenue_previous_year?: string

    financial_cost: {
        total_financial_cost_amount?: string
        total_financial_cost_inc_or_dec?: string
        total_financial_cost_variance?: string
        total_financial_cost_budget?: string
        total_financial_cost_actual?: string
        total_financial_cost_previous?: string
        total_financial_cost_previous_year?: string
        total_financial_cost_percentage?: string
    }
    administrative_cost: {
        total_administrative_cost_amount?: string
        total_administrative_cost_inc_or_dec?: string
        total_administrative_cost_variance?: string
        total_administrative_cost_budget?: string
        total_administrative_cost_actual?: string
        total_administrative_cost_previous?: string
        total_administrative_cost_previous_year?: string
        total_administrative_cost_percentage?: string
    }
    total_expenses_amount?: string
    total_expenses_budget?: string
    total_expenses_actual?: string
    total_expenses_variance?: string
    total_expenses_percentage?: string
    total_expenses_inc_or_dec?: string
    total_expenses_previous?: string
    total_expenses_previous_year?: string

    net_surplus_budget?: string
    net_surplus_actual?: string
    net_surplus_variance?: string
    net_surplus_percentage?: string
    net_surplus_inc_or_dec?: string
    net_surplus_previous?: string
    net_surplus_previous_year?: string

    net_surplus_amount?: string

    page_number?: number
    user_id?: string
    report_date?: string
    time?: string
}
