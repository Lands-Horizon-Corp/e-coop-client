import { WarningFillIcon } from '@/components/icons'

import { TLoanType } from '../../loan-transaction.types'

interface Props {
    loanType: TLoanType
}

const StandardDisplay = () => (
    <div className="space-y-4">
        <h3 className="font-semibold">
            <span className="p-1.5 bg-warning/20 mr-1 inline-flex w-fit items-center justify-center rounded-full">
                <WarningFillIcon className="inline size-3 text-amber-400" />
            </span>{' '}
            Standard
        </h3>
        <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Resets the given entries.</li>
            <li>• Removes any edited or computed schema.</li>
            <li>• Resets the computation scheme.</li>
            <li>
                • Changing this will reset the loan computation but retain the
                amount.
            </li>
        </ul>
        <div className="text-sm">
            <p>
                <strong>Entries:</strong> (not required)
            </p>
            <p>
                <strong>Previous Loan ID:</strong> (optional)
            </p>
        </div>
    </div>
)

const RestructuredDisplay = () => (
    <div className="space-y-4">
        <h3 className="font-semibold">
            <span className="p-1.5 bg-warning/20 mr-1 inline-flex w-fit items-center justify-center rounded-full">
                <WarningFillIcon className="inline size-3 text-amber-400" />
            </span>{' '}
            Restructured
        </h3>
        <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Removes the computed schema and does not apply it.</li>
            <li>• Adds a "Restructured" label to the entry.</li>
            <li>
                • Changing this will reset the loan computation but retain the
                amount.
            </li>
        </ul>
        <div className="text-sm">
            <p>
                <strong>Entries:</strong> (not required)
            </p>
            <p>
                <strong>Previous Loan ID:</strong> (optional)
            </p>
        </div>
    </div>
)

const StandardPreviousDisplay = () => (
    <div className="space-y-4">
        <h3 className="font-semibold">
            <span className="p-1.5 bg-warning/20 mr-1 inline-flex w-fit items-center justify-center rounded-full">
                <WarningFillIcon className="inline size-3 text-amber-400" />
            </span>{' '}
            Standard (Previous)
        </h3>
        <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Does not apply the computation scheme.</li>
            <li>
                • Changing this will reset the loan computation but retain the
                amount.
            </li>
        </ul>
        <div className="text-sm">
            <p>
                <strong>Entries:</strong> (not required)
            </p>
            <p>
                <strong>Previous Loan ID:</strong> (optional)
            </p>
        </div>
    </div>
)

const RenewalDisplay = () => (
    <div className="space-y-4">
        <h3 className="font-semibold">
            <span className="p-1.5 bg-warning/20 mr-1 inline-flex w-fit items-center justify-center rounded-full">
                <WarningFillIcon className="inline size-3 text-amber-400" />
            </span>{' '}
            Renewal (with Automatic Loan Deductions)
        </h3>
        <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Adds "Current" on the account.</li>
            <li>• Requires a previous loan.</li>
            <li>• Includes automatic loan deduction entries.</li>
            <li>
                • Changing this will reset the loan computation but retain the
                amount.
            </li>
        </ul>
        <div className="text-sm">
            <p>
                <strong>Entries:</strong> includes automatic loan deductions.
            </p>
            <p>
                <strong>Previous Loan ID:</strong> required
            </p>
        </div>
    </div>
)

const RenewalWithoutDeductionDisplay = () => (
    <div className="space-y-4">
        <h3 className="font-semibold">
            <span className="p-1.5 bg-warning/20 mr-1 inline-flex w-fit items-center justify-center rounded-full">
                <WarningFillIcon className="inline size-3 text-amber-400" />
            </span>{' '}
            Renewal (without Automatic Loan Deductions)
        </h3>
        <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Adds "Current" on the account.</li>
            <li>• Requires a previous loan.</li>
            <li>• Does not include automatic loan deduction entries.</li>
            <li>
                • Changing this will reset the loan computation but retain the
                amount.
            </li>
        </ul>
        <div className="text-sm">
            <p>
                <strong>Entries:</strong> excludes automatic loan deductions.
            </p>
            <p>
                <strong>Previous Loan ID:</strong> required
            </p>
        </div>
    </div>
)

const LoanTypeConfirmDisplay = ({ loanType }: Props) => {
    switch (loanType) {
        case 'standard':
            return <StandardDisplay />
        case 'restructured':
            return <RestructuredDisplay />
        case 'standard previous':
            return <StandardPreviousDisplay />
        case 'renewal':
            return <RenewalDisplay />
        case 'renewal without deduction':
            return <RenewalWithoutDeductionDisplay />
        default:
            return null
    }
}

export default LoanTypeConfirmDisplay
