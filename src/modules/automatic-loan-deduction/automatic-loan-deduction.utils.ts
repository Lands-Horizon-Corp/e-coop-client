import type {
    AutomaticLoanDeductionEntry,
    LoanTransaction,
} from './automatic-loan-deduction.types'

export function computation(
    {
        charges_percentage_1,
        charges_percentage_2,
        charges_amount,

        min_amount,
        max_amount,
    }: AutomaticLoanDeductionEntry,
    { applied_1, is_add_on }: LoanTransaction
): number {
    let result = applied_1

    // --- Min/Max check ---
    if (min_amount > 0 && result < min_amount) return 0
    if (max_amount > 0 && result > max_amount) return 0

    // PERC
    if (charges_percentage_1 > 0 && charges_percentage_2 > 0) {
        if (is_add_on) {
            result = result * (charges_percentage_2 / 100)
        } else {
            result = result * (charges_percentage_1 / 100)
        }
    } else if (charges_percentage_1 > 0) {
        result = result * (charges_percentage_1 / 100)
    } else if (charges_percentage_2 > 0) {
        result = result * (charges_percentage_2 / 100)
    }

    return result === applied_1 ? charges_amount : result
}

// for loan the amount generated can be overridable, lets provide a recompute
// button instead to re-spread auto deductions once
