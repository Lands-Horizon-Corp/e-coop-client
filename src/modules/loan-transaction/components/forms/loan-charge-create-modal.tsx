import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'
import { entityIdSchema } from '@/validation'

import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps } from '@/types'

const ChargeSchema = z.object({
    account_id: entityIdSchema,
    account: z.any(),
    amount: z.coerce.number().min(0, 'Amount must be positive'),
    description: z.coerce.string().optional(),
    editable: z.boolean().default(false),
    is_add_on: z.boolean().default(false),
})

type TChargeFormValues = z.infer<typeof ChargeSchema>

export interface IChargeFormProps extends IClassProps {
    onSuccess?: (charge: TChargeFormValues) => void
    onCancel?: () => void
    readOnly?: boolean
}

const LoanChargeCreateForm = ({
    className,
    onSuccess,
    onCancel,
    readOnly,
}: IChargeFormProps) => {
    const form = useForm<TChargeFormValues>({
        resolver: standardSchemaResolver(ChargeSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            amount: 0,
            is_add_on: false,
        },
    })

    const { formRef, isDisabled } = useFormHelper<TChargeFormValues>({
        form,
        readOnly,
        autoSave: false,
    })

    const onSubmit = form.handleSubmit((formData, e) => {
        e?.stopPropagation()
        onSuccess?.(formData)
        form.reset()
    })

    return (
        <Form {...form}>
            <form
                ref={formRef}
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <div className="space-y-4">
                    <FormFieldWrapper
                        control={form.control}
                        name="account_id"
                        label="Account"
                        render={({ field }) => (
                            <AccountPicker
                                hideDescription
                                value={form.getValues('account')}
                                placeholder="Select Account for Charge"
                                onSelect={(account) => {
                                    field.onChange(account?.id)
                                    form.setValue('account', account, {
                                        shouldDirty: true,
                                    })
                                    form.setValue(
                                        'description',
                                        account.description,
                                        { shouldDirty: true }
                                    )
                                }}
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        name="amount"
                        label="Amount"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                placeholder="0.00"
                                className="text-right"
                                disabled={isDisabled(field.name)}
                                onChange={(e) => {
                                    const value =
                                        parseFloat(e.target.value) || 0
                                    field.onChange(value)
                                }}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        name="description"
                        label="Description"
                        render={({ field }) => (
                            <Textarea
                                {...field}
                                id={field.name}
                                placeholder="Charge description"
                                disabled={isDisabled(field.name)}
                                rows={3}
                            />
                        )}
                    />

                    <div className="flex items-center gap-6">
                        <FormFieldWrapper
                            control={form.control}
                            name="is_add_on"
                            className="w-fit"
                            render={({ field }) => (
                                <div className="flex items-center gap-2">
                                    <Switch
                                        id={field.name}
                                        checked={field.value || false}
                                        onCheckedChange={field.onChange}
                                        disabled={isDisabled(field.name)}
                                    />
                                    <Label
                                        htmlFor={field.name}
                                        className="text-sm font-medium"
                                    >
                                        Add-on Charge
                                    </Label>
                                </div>
                            )}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        disabled={!form.formState.isValid}
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            form.handleSubmit((data) => {
                                onSuccess?.(data)
                                form.reset()
                            })()
                        }}
                    >
                        Add Charge
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export const LoanChargeCreateModal = ({
    title = 'Add Charge',
    description = 'Add a new charge to this loan transaction.',
    className,
    onSuccess,
    ...props
}: IModalProps & {
    onSuccess?: (charge: TChargeFormValues) => void
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('!max-w-xl', className)}
            {...props}
        >
            <LoanChargeCreateForm
                onSuccess={(charge) => {
                    onSuccess?.(charge)
                    props.onOpenChange?.(false)
                }}
                onCancel={() => props.onOpenChange?.(false)}
            />
        </Modal>
    )
}

export default LoanChargeCreateForm
