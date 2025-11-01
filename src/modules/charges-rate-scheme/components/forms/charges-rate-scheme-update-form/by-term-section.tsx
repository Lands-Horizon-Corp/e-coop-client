import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { toast } from 'sonner'

import { cn } from '@/helpers/tw-utils'
import { TChargesRateSchemeSchema } from '@/modules/charges-rate-scheme/charges-rate-scheme.validation'
import LoanModeOfPaymentCombobox from '@/modules/loan-transaction/components/loan-mode-of-payment-combobox'
import { LOAN_MODE_OF_PAYMENT } from '@/modules/loan-transaction/loan.constants'
import useConfirmModalStore from '@/store/confirm-modal-store'

import { PlusIcon, TrashIcon } from '@/components/icons'
import ActionTooltip from '@/components/tooltips/action-tooltip'
import { Button } from '@/components/ui/button'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from '@/components/ui/input-group'

import { IClassProps } from '@/types'

interface IByTermProps extends IClassProps {
    form: UseFormReturn<TChargesRateSchemeSchema>
    disabled?: boolean
}

const ByTermSection = ({ form, disabled, className }: IByTermProps) => {
    const { onOpen } = useConfirmModalStore()

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'charges_rate_by_terms',
    })

    const { append: addDeletedId } = useFieldArray({
        control: form.control,
        name: 'charges_rate_by_terms_deleted',
    })

    const usedModeOfPayments = fields.map((field) => field.mode_of_payment)
    const availableModeOfPayments = LOAN_MODE_OF_PAYMENT.filter(
        (mode) => !usedModeOfPayments.includes(mode)
    )

    const handleAddTerm = () => {
        if (availableModeOfPayments.length === 0) {
            toast.error('All mode of payments have been added')
            return
        }

        const firstUnusedMode = availableModeOfPayments[0]

        if (!firstUnusedMode) {
            toast.error('No available mode of payment found')
            return
        }

        append({
            mode_of_payment: firstUnusedMode,
        })
    }

    const handleRemoveTerm = (index: number) => {
        const field = form.getValues(`charges_rate_by_terms.${index}`)

        if (field.id === undefined || field.id === null) return remove(index)

        onOpen({
            title: 'Remove Term',
            description: 'Are you sure you want to remove this term?',
            onConfirm: () => {
                if (field.id) addDeletedId(field.id)

                remove(index)
                toast.success('Term removed')
            },
        })
    }

    return (
        <div
            className={cn(
                'space-y-4 bg-card max-w-full min-w-0 p-4 rounded-xl',
                className
            )}
        >
            <div className="flex items-center gap-x-4 justify-between">
                <div className="text-base">
                    Charge Terms
                    <p className="text-sm text-muted-foreground">
                        This charge scheme applies rates (%) based on payment
                        terms. Each mode of payment has different rate values
                        for each term period.
                    </p>
                </div>
                {availableModeOfPayments.length > 0 && (
                    <Button
                        disabled={disabled}
                        hoverVariant="primary"
                        onClick={handleAddTerm}
                        size="sm"
                        type="button"
                        variant="outline"
                    >
                        <PlusIcon className="size-4" />
                        Add Term
                    </Button>
                )}
            </div>

            {fields.length > 0 && (
                <div className="w-fit max-w-full relative space-y-1 ecoop-scroll overflow-auto">
                    <div className="space-y-2 p-1 sticky top-0">
                        <div className="grid items-end grid-cols-[250px_repeat(22,6rem)] w-fit gap-2">
                            <span className="p-1.5 sticky left-0 bg-accent text-accent-foreground z-50 h-fit rounded-md text-center">
                                Mode of Payment
                            </span>
                            <FormFieldWrapper
                                control={form.control}
                                label="#1"
                                name="by_term_header_1"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="#1"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="#2"
                                name="by_term_header_2"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="#2"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="#3"
                                name="by_term_header_3"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="#3"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="#4"
                                name="by_term_header_4"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="#4"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="#5"
                                name="by_term_header_5"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="#5"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="#6"
                                name="by_term_header_6"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="#6"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="#7"
                                name="by_term_header_7"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="#7"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="#8"
                                name="by_term_header_8"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="#8"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="#9"
                                name="by_term_header_9"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="#9"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="#10"
                                name="by_term_header_10"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="#10"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="#11"
                                name="by_term_header_11"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="#11"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="#12"
                                name="by_term_header_12"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="#12"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="#13"
                                name="by_term_header_13"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="#13"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="#14"
                                name="by_term_header_14"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="#14"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="#15"
                                name="by_term_header_15"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="#15"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="#16"
                                name="by_term_header_16"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="#16"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="#17"
                                name="by_term_header_17"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="#17"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="#18"
                                name="by_term_header_18"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="#18"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="#19"
                                name="by_term_header_19"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="#19"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="#20"
                                name="by_term_header_20"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="#20"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="#21"
                                name="by_term_header_21"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="#21"
                                        />
                                    </InputGroup>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="#22"
                                name="by_term_header_22"
                                render={({ field }) => (
                                    <InputGroup>
                                        <InputGroupInput
                                            {...field}
                                            disabled={disabled}
                                            placeholder="#22"
                                        />
                                    </InputGroup>
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-2 pb-4 w-full rounded-2xl">
                        {fields.map((field, index) => {
                            return (
                                <div
                                    className="p-1 grid grid-cols-[250px_repeat(22,6rem)_auto] gap-2 rounded-lg bg-secondary/70 w-fit duration-200"
                                    key={field.id}
                                >
                                    <FormFieldWrapper
                                        className="sticky left-0 z-50 bg-secondary/70 backdrop-blur-sm rounded-xl"
                                        control={form.control}
                                        name={`charges_rate_by_terms.${index}.mode_of_payment`}
                                        render={({ field }) => (
                                            <LoanModeOfPaymentCombobox
                                                {...field}
                                                disabled={disabled}
                                                onChange={(selectedMode) => {
                                                    if (
                                                        !availableModeOfPayments.includes(
                                                            selectedMode
                                                        )
                                                    )
                                                        return toast.warning(
                                                            'This mode of payment has already been added.'
                                                        )
                                                    field.onChange(selectedMode)
                                                }}
                                            />
                                        )}
                                    />

                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_by_terms.${index}.rate_1`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>
                                                        %
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_by_terms.${index}.rate_2`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>
                                                        %
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_by_terms.${index}.rate_3`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>
                                                        %
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_by_terms.${index}.rate_4`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>
                                                        %
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_by_terms.${index}.rate_5`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>
                                                        %
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_by_terms.${index}.rate_6`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>
                                                        %
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_by_terms.${index}.rate_7`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>
                                                        %
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_by_terms.${index}.rate_8`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>
                                                        %
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_by_terms.${index}.rate_9`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>
                                                        %
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_by_terms.${index}.rate_10`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>
                                                        %
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_by_terms.${index}.rate_11`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>
                                                        %
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_by_terms.${index}.rate_12`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>
                                                        %
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_by_terms.${index}.rate_13`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>
                                                        %
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_by_terms.${index}.rate_14`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>
                                                        %
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_by_terms.${index}.rate_15`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
                                                    placeholder="%"
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>
                                                        %
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_by_terms.${index}.rate_16`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
                                                    placeholder="%"
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>
                                                        %
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_by_terms.${index}.rate_17`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>
                                                        %
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_by_terms.${index}.rate_18`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>
                                                        %
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_by_terms.${index}.rate_19`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>
                                                        %
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_by_terms.${index}.rate_20`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>
                                                        %
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_by_terms.${index}.rate_21`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>
                                                        %
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={`charges_rate_by_terms.${index}.rate_22`}
                                        render={({ field }) => (
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    disabled={disabled}
                                                />
                                                <InputGroupAddon align="inline-end">
                                                    <InputGroupText>
                                                        %
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                        )}
                                    />

                                    <ActionTooltip
                                        side="left"
                                        tooltipContent="Remove Term"
                                    >
                                        <Button
                                            className="size-9 shrink-0 ml-auto"
                                            disabled={disabled}
                                            hoverVariant="destructive"
                                            onClick={() =>
                                                handleRemoveTerm(index)
                                            }
                                            size="icon"
                                            type="button"
                                            variant="destructive"
                                        >
                                            <TrashIcon className="size-4" />
                                        </Button>
                                    </ActionTooltip>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {fields.length === 0 && (
                <Empty className="from-muted/50 w-full to-background bg-gradient-to-b from-30% rounded-2xl border p-8">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <PlusIcon />
                        </EmptyMedia>
                        <EmptyTitle>No Charge Terms</EmptyTitle>
                        <EmptyDescription>
                            Add charge terms to define how charges are
                            calculated based on payment terms.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button
                            onClick={handleAddTerm}
                            size="sm"
                            type="button"
                            variant="outline"
                        >
                            <PlusIcon className="size-4" />
                            Add First Term
                        </Button>
                    </EmptyContent>
                </Empty>
            )}
        </div>
    )
}

export default ByTermSection
