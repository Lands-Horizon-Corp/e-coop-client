export interface IReportCOOPPesos {
    header_title: string
    header_address: string
    tax_number: string
    report_title: string
    end_date: string

    portfolio_quality: {
        portfolio_at_risk?: {
            title: string
            description: string
            standard: string
            hi_score: string
            values: {
                balance_of_loan_with_one_day_missed_payment?: string
                total_loans_outstanding?: string
            }
            result_percentage?: string
            points?: string
        }
        allowance_for_probable_losses?: {
            title: string
            entries: Array<{
                description: string
                standard?: string
                hi_score?: string
                values?: string
            }>
            sub_total?: string
        }
    }

    efficiency: {
        asset_yield?: {
            title: string
            entries: Array<{
                description: string
                standard?: string
                hi_score?: string
                values?: string
            }>
        }
        operational_self_sufficiency?: {
            title: string
            income_entries: Array<{
                description: string
                standard?: string
                hi_score?: string
            }>
            cost_entries: Array<{
                description: string
            }>
        }
        rate_of_return_on_members_share?: {
            title: string
            entries: Array<{
                description: string
                standard?: string
                hi_score?: string
                values?: string
            }>
        }
        loan_portfolio_profitability?: {
            title: string
            entries: Array<{
                description: string
                standard?: string
                hi_score?: string
                values?: {
                    previous_year?: string
                    current_month?: string
                    total?: string
                }
                result?: string
            }>
        }
        cost_per_peso_loan?: {
            title: string
            entries: Array<{
                description: string
                standard?: string
                hi_score?: string
                values?: {
                    previous_year?: string
                    current_month?: string
                    total?: string
                }
                result?: string
            }>
        }
        administrative_efficiency?: {
            title: string
            entries: Array<{
                description: string
                standard?: string
                hi_score?: string
                values?: {
                    previous_year?: string
                    current_month?: string
                    total?: string
                }
                result?: string
            }>
        }
        sub_total?: string
    }

    stability: {
        solvency?: {
            title: string
            entries: Array<{
                description: string
                standard?: string
                hi_score?: string
                values?: string
            }>
        }
        liquidity?: {
            title: string
            entries: Array<{
                description: string
                standard?: string
                hi_score?: string
                values?: string
            }>
        }
        net_institutional_capital?: {
            title: string
            entries: Array<{
                description: string
                standard?: string
                hi_score?: string
                values?: string
                result?: string
            }>
        }
        sub_total?: string
    }

    operations: {
        performance_of_membership_growth?: {
            title: string
            entries: Array<{
                description: string
                standard?: string
            }>
        }
        trend_in_external_borrowings?: {
            title: string
            entries: Array<{
                description: string
                standard?: string
            }>
        }
        sub_total?: string
    }

    structure_of_assets: {
        asset_quality?: {
            title: string
            entries: Array<{
                description: string
                standard?: string
                hi_score?: string
                values?: string
                result?: string
                points?: string
            }>
        }
        asset_structure?: {
            title: string
            entries: Array<{
                description: string
                standard?: string
                hi_score?: string
                values?: string
                result?: string
                points?: string
            }>
        }
        sub_total?: string
    }

    grand_total?: string
    grand_total_points?: string

    prepared_by?: string
    approved_by?: string

    user_id?: string
    report_date?: string
    time?: string
    page_number?: number
}
