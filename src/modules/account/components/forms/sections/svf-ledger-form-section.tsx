import { Path, UseFormReturn } from 'react-hook-form'

import { MoneyBagIcon } from '@/components/icons'
import { FormControl } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from '@/components/ui/input-group'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select'

import { COMPUTATION_TYPE } from '../../../account.constants'
import { TAccountFormValues } from '../../../account.validation'

type SVFLedgerFormSectionProps = {
    form: UseFormReturn<TAccountFormValues>
    isDisabled: (fieldName: Path<TAccountFormValues>) => boolean
    isLoading?: boolean
}

export const SVFLedgerFormSection = ({
    form,
    isDisabled,
    isLoading,
}: SVFLedgerFormSectionProps) => {
    if (form.watch('type') !== 'SVF-Ledger') return null
    return (
        <div className="flex flex-col gap-y-2 p-5">
            <h1 className="text-primary text-md font-bold">
                <MoneyBagIcon className="inline-block mr-2 mb-1" />
                SVF (Service Fee) Configuration
            </h1>
            {/* Max Amount, Min Amount, Computation Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormFieldWrapper
                    control={form.control}
                    disabled={isLoading}
                    label="Max Amount"
                    name="max_amount"
                    render={({ field }) => (
                        <div className="flex grow flex-col gap-y-2">
                            <Input
                                {...field}
                                disabled={isDisabled(field.name) || isLoading}
                                onChange={(e) =>
                                    field.onChange(
                                        e.target.value === ''
                                            ? undefined
                                            : parseFloat(e.target.value)
                                    )
                                }
                                placeholder="Max Amount"
                                value={field.value ?? ''}
                            />
                        </div>
                    )}
                />
                <FormFieldWrapper
                    control={form.control}
                    disabled={isLoading}
                    label="Min Amount"
                    name="min_amount"
                    render={({ field }) => (
                        <div className="flex grow flex-col gap-y-2">
                            <Input
                                {...field}
                                disabled={isDisabled(field.name) || isLoading}
                                onChange={(e) =>
                                    field.onChange(
                                        e.target.value === ''
                                            ? undefined
                                            : parseFloat(e.target.value)
                                    )
                                }
                                placeholder="Min Amount"
                                value={field.value ?? ''}
                            />
                        </div>
                    )}
                />
                <FormFieldWrapper
                    control={form.control}
                    label="Computation Type"
                    name="computation_type"
                    render={({ field }) => (
                        <FormControl>
                            <Select
                                defaultValue={field.value}
                                disabled={isDisabled(field.name) || isLoading}
                                onValueChange={(selectedValue) => {
                                    field.onChange(selectedValue)
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    {field.value || 'Select Computation Type'}
                                </SelectTrigger>
                                <SelectContent>
                                    {COMPUTATION_TYPE.map((compType) => {
                                        return (
                                            <SelectItem
                                                key={compType}
                                                value={compType}
                                            >
                                                {compType}
                                            </SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                        </FormControl>
                    )}
                />
                <FormFieldWrapper
                    control={form.control}
                    disabled={isLoading}
                    label="Interest Standard (%)"
                    name="interest_standard"
                    render={({ field }) => (
                        <InputGroup>
                            <InputGroupInput
                                {...field}
                                disabled={isDisabled(field.name) || isLoading}
                                onChange={(e) =>
                                    field.onChange(
                                        e.target.value === ''
                                            ? undefined
                                            : parseFloat(e.target.value)
                                    )
                                }
                                placeholder="Interest Standard"
                                value={field.value ?? ''}
                            />
                            <InputGroupAddon align="inline-end">
                                <InputGroupText>%</InputGroupText>
                            </InputGroupAddon>
                        </InputGroup>
                    )}
                />
            </div>
        </div>
    )
}
