export interface IReportIncomeStatement {
    header_title: string
    header_address: string
    tax_number: string

    report_title: string
    ended_date: string

    report_type:
        | 'STANDARD'
        | 'COMPARATIVE_MONTHLY'
        | 'COMPARATIVE_YEARLY'
        | 'CLOSED_BOOK'
        | 'BUDGET_FORECASTING'

    income_entries: Array<{
        account_title: string
        account_entries: Array<{
            description: string
            current_amount?: string
            previous_amount?: string
            previous_year_amount?: string
            inc_or_dec_amount?: string
            percentage?: string
            actual_amount?: string
            budget_amount?: string
            variance_amount?: string
        }>
        total_revenue_amount?: string
    }>

    expense_entries: Array<{
        account_title: string
        account_entries: Array<{
            description: string
            current_amount?: string
            previous_amount?: string
            previous_year_amount?: string
            inc_or_dec_amount?: string
            percentage?: string
            actual_amount?: string
            budget_amount?: string
            variance_amount?: string
        }>
        total_int_expenses_on_deposits?: string
    }>

    total_financial_cost_current?: string
    total_financial_cost_previous?: string
    total_financial_cost_previous_year?: string
    total_financial_cost_inc_or_dec?: string
    total_financial_cost_actual?: string
    total_financial_cost_budget?: string
    total_financial_cost_variance?: string
    total_financial_cost_percentage?: string

    personnel_cost_current?: string
    personnel_cost_previous?: string
    personnel_cost_previous_year?: string
    personnel_cost_inc_or_dec?: string
    personnel_cost_percentage?: string
    personnel_cost_actual?: string
    personnel_cost_budget?: string
    personnel_cost_variance?: string

    total_personnel_cost_current?: string
    total_personnel_cost_previous?: string
    total_personnel_cost_previous_year?: string
    total_personnel_cost_inc_or_dec?: string
    total_personnel_cost_percentage?: string
    total_personnel_cost_actual?: string
    total_personnel_cost_budget?: string
    total_personnel_cost_variance?: string

    administrative_cost_current?: string
    administrative_cost_previous?: string
    administrative_cost_previous_year?: string
    administrative_cost_inc_or_dec?: string
    administrative_cost_percentage?: string
    administrative_cost_actual?: string
    administrative_cost_budget?: string
    administrative_cost_variance?: string

    total_administrative_cost_current?: string
    total_administrative_cost_previous?: string
    total_administrative_cost_previous_year?: string
    total_administrative_cost_inc_or_dec?: string
    total_administrative_cost_percentage?: string
    total_administrative_cost_actual?: string
    total_administrative_cost_budget?: string
    total_administrative_cost_variance?: string

    total_expense_current?: string
    total_expense_previous?: string
    total_expense_previous_year?: string
    total_expense_inc_or_dec?: string
    total_expense_percentage?: string
    total_expense_actual?: string
    total_expense_budget?: string
    total_expense_variance?: string

    net_surplus_current?: string
    net_surplus_previous?: string
    net_surplus_previous_year?: string
    net_surplus_inc_or_dec?: string
    net_surplus_percentage?: string
    net_surplus_actual?: string
    net_surplus_budget?: string
    net_surplus_variance?: string

    net_surplus_entries_for_allocation?: Array<{
        net_surplus_account_titles: string
        amount: string
    }>
    total_net_surplus_allocated?: string

    prepared_by: string
    check_by: string
    approved_by: string

    page_number?: number
    user_id: string
    report_date: string
    time: string
}
