import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { CurrencyInput } from '@/modules/currency'
import {
    GeneralLedgerDefinitionSchema,
    GeneralLedgerTypeEnum,
    IGeneralLedgerDefinition,
    IGeneralLedgerDefinitionFormValues,
    IGeneralLedgerDefinitionRequest,
    useCreate,
    useUpdateById,
} from '@/modules/general-ledger-definition'

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

interface IGeneralLedgerDefinitionCreateUpdateFormProps
    extends IClassProps,
        IForm<
            Partial<IGeneralLedgerDefinitionRequest>,
            IGeneralLedgerDefinition,
            string,
            IGeneralLedgerDefinitionFormValues
        > {
    generalLedgerDefinitionEntriesId?: TEntityId
    generalLedgerDefinitionId?: TEntityId
    generalLedgerAccountsGroupingId?: TEntityId
}
const GeneralLedgerDefinitionCreateUpdateForm = ({
    defaultValues,
    className,
    readOnly,
    disabledFields,
    generalLedgerDefinitionEntriesId,
    generalLedgerAccountsGroupingId,
    generalLedgerDefinitionId,
    onSuccess,
    ...formProps
}: IGeneralLedgerDefinitionCreateUpdateFormProps) => {
    const form = useForm<IGeneralLedgerDefinitionFormValues>({
        resolver: standardSchemaResolver(GeneralLedgerDefinitionSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            ...defaultValues,
        },
    })

    const { mutate: CreateGeneralLedgerDefinition, isPending: isCreating } =
        useCreate({
            options: {
                onSuccess: (data) => {
                    form.reset()
                    onSuccess?.(data)
                    toast.success('Added General Ledger Definition')
                },
            },
        })
    const {
        mutate: UpdateGeneralLedgerDefinition,
        isPending: isUpdating,
        error,
    } = useUpdateById({
        options: { onSuccess: onSuccess },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<IGeneralLedgerDefinitionFormValues>({
            form,
            ...formProps,
            readOnly,
            disabledFields,
        })

    const onSubmit = form.handleSubmit((data) => {
        if (!generalLedgerAccountsGroupingId) {
            form.setError('root', {
                type: 'manual',
                message: 'Please select a General Ledger Accounts Grouping.',
            })
            return
        }

        if (generalLedgerDefinitionId) {
            const request = {
                ...data,
                general_ledger_definition_entries_id:
                    defaultValues?.general_ledger_definition_entries_id,
                general_ledger_accounts_grouping_id:
                    generalLedgerAccountsGroupingId,
            }
            UpdateGeneralLedgerDefinition({
                id: generalLedgerDefinitionId,
                payload: request,
            })
        } else {
            const CreateRequest = {
                ...data,
                general_ledger_definition_entries_id:
                    generalLedgerDefinitionEntriesId,
                general_ledger_accounts_grouping_id:
                    generalLedgerAccountsGroupingId,
            }
            CreateGeneralLedgerDefinition(CreateRequest)
        }
    }, handleFocusError)

    const isLoading = isCreating || isUpdating

    const errorMessage = serverRequestErrExtractor({ error })

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
                    name="general_ledger_type"
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
                                    {field.value || 'Select GL Type'}
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.values(GeneralLedgerTypeEnum).map(
                                        (type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        )
                                    )}
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
                <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                    <FormFieldWrapper
                        control={form.control}
                        label="Beginning Balance (Credit)"
                        name="beginning_balance_of_the_year_credit"
                        render={({ field: { onChange, ...field } }) => (
                            <CurrencyInput
                                {...field}
                                disabled={isDisabled(field.name)}
                                onValueChange={(newValue) => {
                                    onChange(newValue)
                                }}
                                placeholder="e.g., 5000.00"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Beginning Balance (Debit)"
                        name="beginning_balance_of_the_year_debit"
                        render={({ field: { onChange, ...field } }) => (
                            <CurrencyInput
                                {...field}
                                disabled={isDisabled(field.name)}
                                onValueChange={(newValue) => {
                                    onChange(newValue)
                                }}
                                placeholder="e.g., 5000.00"
                            />
                        )}
                    />
                </div>
                {!readOnly && (
                    <>
                        <Separator />
                        <div className="space-y-2">
                            <FormErrorMessage errorMessage={errorMessage} />
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
                                    ) : generalLedgerDefinitionId ? (
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

export const GeneralLedgerDefinitionCreateUpdateFormModal = ({
    title,
    description,
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IGeneralLedgerDefinitionCreateUpdateFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            overlayClassName="!bg-transparent !backdrop-blur-sm"
            title={title}
            {...props}
        >
            <GeneralLedgerDefinitionCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default GeneralLedgerDefinitionCreateUpdateFormModal
