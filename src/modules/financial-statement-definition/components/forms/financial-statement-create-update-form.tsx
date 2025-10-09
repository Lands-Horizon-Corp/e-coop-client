import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import {
    FinancialStatementDefinitionSchema,
    FinancialStatementTypeEnum,
    IFinancialStatementDefinition,
    IFinancialStatementDefinitionFormValues,
    IFinancialStatementDefinitionRequest,
    useCreate,
    useUpdateById,
} from '@/modules/financial-statement-definition'

import { GradientBackground } from '@/components/gradient-background/gradient-background'
import { MoneyBagIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import TextEditor from '@/components/text-editor'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

interface IFinancialStatementCreateUpdateFormProps
    extends IClassProps,
        IForm<
            Partial<IFinancialStatementDefinitionRequest>,
            IFinancialStatementDefinition,
            string,
            IFinancialStatementDefinitionFormValues
        > {
    financialStatementDefinitionEntriesId?: TEntityId
    financialStatementId?: TEntityId
    financialStatementAccountsGroupingId?: TEntityId
}
const FinancialStatementCreateUpdateForm = ({
    defaultValues,
    className,
    readOnly,
    disabledFields,
    financialStatementDefinitionEntriesId,
    financialStatementAccountsGroupingId,
    financialStatementId,
    onSuccess,
    ...formProps
}: IFinancialStatementCreateUpdateFormProps) => {
    const form = useForm<IFinancialStatementDefinitionFormValues>({
        resolver: standardSchemaResolver(FinancialStatementDefinitionSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            ...defaultValues,
        },
    })

    const {
        mutate: CreateFinancialStatementDefinition,
        isPending: isCreating,
    } = useCreate({
        options: {
            onSuccess: (data) => {
                form.reset()
                onSuccess?.(data)
                toast.success('Added Financial Statement Definition')
            },
        },
    })
    const {
        mutate: UpdateFinancialStatementDefinition,
        isPending: isUpdating,
    } = useUpdateById({
        options: { onSuccess: onSuccess },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<IFinancialStatementDefinitionFormValues>({
            form,
            ...formProps,
            readOnly,
            disabledFields,
        })

    const onSubmit = form.handleSubmit((data) => {
        if (!financialStatementAccountsGroupingId) {
            form.setError('root', {
                type: 'manual',
                message:
                    'Please select a FinancialStatement Accounts Grouping.',
            })
            return
        }

        if (financialStatementId) {
            const request = {
                ...data,
                financial_statement_definition_entries_id:
                    defaultValues?.financial_statement_definition_entries_id,
                financial_statement_grouping_id:
                    financialStatementAccountsGroupingId,
            }
            UpdateFinancialStatementDefinition({
                id: financialStatementId,
                payload: request,
            })
        } else {
            const CreateRequest = {
                ...data,
                financial_statement_definition_entries_id:
                    financialStatementDefinitionEntriesId,
                financial_statement_grouping_id:
                    financialStatementAccountsGroupingId,
            }
            CreateFinancialStatementDefinition(CreateRequest)
        }
    }, handleFocusError)

    const isLoading = isCreating || isUpdating

    return (
        <Form {...form}>
            <form
                className={cn('w-full space-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <FormFieldWrapper
                    control={form.control}
                    label="Name *"
                    name="name"
                    render={({ field }) => (
                        <Input
                            {...field}
                            disabled={isDisabled(field.name)}
                            id={field.name}
                            placeholder="e.g., Cash in Bank, Accounts Payable"
                            value={field.value || ''}
                        />
                    )}
                />
                <FormFieldWrapper
                    className="col-span-4"
                    control={form.control}
                    label="Type *"
                    name="financial_statement_type"
                    render={({ field }) => (
                        <FormControl>
                            <Select
                                defaultValue={field.value}
                                disabled={isDisabled(field.name)}
                                onValueChange={(selectedValue) => {
                                    field.onChange(selectedValue)
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    {field.value || 'Select FS Type'}
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(
                                        FinancialStatementTypeEnum
                                    ).map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormControl>
                    )}
                />
                <FormFieldWrapper
                    control={form.control}
                    label="Description "
                    name="description"
                    render={({ field }) => (
                        <TextEditor
                            {...field}
                            content={field.value}
                            disabled={isDisabled(field.name)}
                            placeholder="Write some description..."
                            textEditorClassName="!max-w-xl max-h-32 bg-background"
                        />
                    )}
                />
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <FormFieldWrapper
                        control={form.control}
                        label="Index "
                        name="index"
                        render={({ field }) => (
                            <Input
                                {...field}
                                disabled={isDisabled(field.name)}
                                onChange={(e) =>
                                    field.onChange(
                                        parseFloat(e.target.value) || undefined
                                    )
                                }
                                placeholder="e.g., 100"
                                type="number"
                                value={field.value ?? ''}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Name in Total"
                        name="name_in_total"
                        render={({ field }) => (
                            <Input
                                {...field}
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                placeholder="e.g., Total Current Assets"
                                value={field.value || ''}
                            />
                        )}
                    />
                </div>
                <FormFieldWrapper
                    className="col-span-2"
                    control={form.control}
                    name="is_posting"
                    render={({ field }) => {
                        return (
                            <GradientBackground
                                className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
                                gradientOnly
                            >
                                <Checkbox
                                    aria-describedby={`${field.name}-description`}
                                    checked={field.value || false}
                                    className="order-1 after:absolute after:inset-0"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    name={field.name}
                                    onCheckedChange={field.onChange}
                                />
                                <div className="flex grow items-center gap-3">
                                    <div className="size-fit rounded-full bg-secondary p-2">
                                        <MoneyBagIcon className="size-5" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor={field.name}>
                                            Is Posting Account?
                                        </Label>
                                        <p
                                            className="text-xs text-muted-foreground"
                                            id={`${field.name}-description`}
                                        >
                                            Check if this account allows direct
                                            financial postings.
                                        </p>
                                    </div>
                                </div>
                            </GradientBackground>
                        )
                    }}
                />
                {!readOnly && (
                    <>
                        <Separator />
                        <div className="space-y-2">
                            <FormErrorMessage
                                errorMessage={
                                    form.formState.errors.root?.message || ''
                                }
                            />
                            <div className="flex items-center justify-end gap-x-2">
                                <Button
                                    className="w-full self-end px-8 sm:w-fit"
                                    onClick={() => form.reset()}
                                    size="sm"
                                    type="button"
                                    variant="ghost"
                                >
                                    Reset
                                </Button>
                                <Button
                                    className="w-full self-end px-8 sm:w-fit"
                                    disabled={
                                        isLoading || !form.formState.isDirty
                                    }
                                    size="sm"
                                    type="submit"
                                >
                                    {isLoading ? (
                                        <LoadingSpinner />
                                    ) : financialStatementId ? (
                                        'Update'
                                    ) : (
                                        'Create'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </form>
        </Form>
    )
}

export const FinancialStatementCreateUpdateFormModal = ({
    title,
    description,
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IFinancialStatementCreateUpdateFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            overlayClassName="!bg-transparent !backdrop-blur-sm"
            title={title}
            {...props}
        >
            <FinancialStatementCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default FinancialStatementCreateUpdateFormModal
