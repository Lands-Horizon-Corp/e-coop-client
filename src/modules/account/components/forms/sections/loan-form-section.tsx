import { Path, UseFormReturn } from 'react-hook-form'

import ComputationSheetCombobox from '@/modules/computation-sheet/components/computation-sheet-combobox'

import { GradientBackground } from '@/components/gradient-background/gradient-background'
import { ReceiveMoneyIcon } from '@/components/icons'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import {
    COMPUTATION_TYPE,
    COMPUTATION_TYPE_DESCRIPTIONS,
    LOAN_SAVING_TYPE,
    OTHER_DEDUCTION_ENTRY,
} from '../../../account.constants'
import { TAccountFormValues } from '../../../account.validation'

type LoanFormSectionProps = {
    form: UseFormReturn<TAccountFormValues>
    isDisabled: (fieldName: Path<TAccountFormValues>) => boolean
    isLoading?: boolean
}

export const LoanFormSection = ({
    form,
    isDisabled,
    isLoading,
}: LoanFormSectionProps) => {
    if (form.watch('type') !== 'Loan') return null
    return (
        <div className="p-5 space-y-4">
            <h1 className="text-primary text-md font-bold">
                <ReceiveMoneyIcon className="inline-block mr-2 mb-1" />
                Loan
            </h1>

            <div className="grid grid-cols-1 gap-x-2">
                {/* Computation Type */}
                <FormFieldWrapper
                    className="bg-card/50 p-3 pb-3 rounded-xl"
                    control={form.control}
                    label="Computation Type"
                    name="computation_type"
                    render={({ field }) => (
                        <RadioGroup
                            className="grid grid-cols-3 gap-2"
                            disabled={isDisabled(field.name) || isLoading}
                            onValueChange={field.onChange}
                            value={field.value}
                        >
                            {COMPUTATION_TYPE.map((type) => (
                                <GradientBackground gradientOnly key={type}>
                                    <div className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-3 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                        <RadioGroupItem
                                            className="order-1 after:absolute after:inset-0"
                                            id={`computation-type-${type}`}
                                            value={type}
                                        />
                                        <div className="flex grow items-center gap-3">
                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor={`computation-type-${type}`}
                                                >
                                                    {type}
                                                </Label>
                                                <p
                                                    className="text-xs text-muted-foreground"
                                                    id={`computation-type-${type}-description`}
                                                >
                                                    {
                                                        COMPUTATION_TYPE_DESCRIPTIONS[
                                                            type
                                                        ]
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </GradientBackground>
                            ))}
                        </RadioGroup>
                    )}
                />

                {/* Computation Sheet */}
                <FormFieldWrapper
                    control={form.control}
                    disabled={isLoading}
                    label="Computation Sheet/Scheme"
                    name="computation_sheet_id"
                    render={({ field }) => (
                        <ComputationSheetCombobox
                            {...field}
                            onChange={(computationSheet) =>
                                field.onChange(computationSheet.id)
                            }
                        />
                    )}
                />
            </div>

            {/* Loan Saving Type */}
            <FormFieldWrapper
                control={form.control}
                label="Loan Saving Type"
                name="loan_saving_type"
                render={({ field }) => (
                    <GradientBackground className="p-2" gradientOnly>
                        <RadioGroup
                            className="grid grid-cols-1 gap-4 sm:grid-cols-3"
                            disabled={isDisabled(field.name) || isLoading}
                            onValueChange={field.onChange}
                            value={field.value}
                        >
                            {LOAN_SAVING_TYPE.map((type) => (
                                <div
                                    className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
                                    key={type}
                                >
                                    <RadioGroupItem
                                        className="order-1 after:absolute after:inset-0"
                                        id={`loan-saving-${type}`}
                                        value={type}
                                    />
                                    <div className="flex grow items-center gap-3">
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor={`loan-saving-${type}`}
                                            >
                                                {type}
                                            </Label>
                                            <p
                                                className="text-xs"
                                                id={`loan-saving-${type}-description`}
                                            >
                                                {type === 'Separate' &&
                                                    'Loans and savings are managed in separate ledgers.'}
                                                {type === 'Single Ledger' &&
                                                    'Loans and savings are managed in a single combined ledger.'}
                                                {type ===
                                                    'Single Ledger if Not Zero' &&
                                                    'Loans and savings are managed in a single ledger with semi-monthly (15/30) entries.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </RadioGroup>
                    </GradientBackground>
                )}
            />

            {/* Other Deduction Entry */}
            <FormFieldWrapper
                control={form.control}
                label="Other Deduction Entry"
                name="other_deduction_entry"
                render={({ field }) => (
                    <GradientBackground className="p-2" gradientOnly>
                        <RadioGroup
                            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                            disabled={isDisabled(field.name) || isLoading}
                            onValueChange={field.onChange}
                            value={field.value}
                        >
                            {OTHER_DEDUCTION_ENTRY.map((type) => (
                                <div
                                    className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
                                    key={type}
                                >
                                    <RadioGroupItem
                                        className="order-1 after:absolute after:inset-0"
                                        id={`loan-other-deduction-${type}`}
                                        value={type}
                                    />
                                    <div className="flex grow items-center gap-3">
                                        <div className="grid gap-2">
                                            <Label
                                                htmlFor={`loan-other-deduction-${type}`}
                                            >
                                                {type}
                                            </Label>
                                            <p
                                                className="text-xs"
                                                id={`loan-other-deduction-${type}-description`}
                                            >
                                                {type === 'None' &&
                                                    'No additional deductions will be applied.'}
                                                {type === 'Health Care' &&
                                                    'Health care deductions will be applied.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </RadioGroup>
                    </GradientBackground>
                )}
            />
        </div>
    )
}
