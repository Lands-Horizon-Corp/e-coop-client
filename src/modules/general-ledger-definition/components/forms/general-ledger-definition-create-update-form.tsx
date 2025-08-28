import { Path, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
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

import { useAlertBeforeClosing } from '@/hooks/use-alert-before-closing'

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
}: IGeneralLedgerDefinitionCreateUpdateFormProps) => {
    const form = useForm<IGeneralLedgerDefinitionFormValues>({
        resolver: standardSchemaResolver(GeneralLedgerDefinitionSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            ...defaultValues,
        },
    })

    const isDisabled = (field: Path<IGeneralLedgerDefinitionFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

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
    const { mutate: UpdateGeneralLedgerDefinition, isPending: isUpdating } =
        useUpdateById({
            options: { onSuccess: onSuccess },
        })

    // Handle form submission
    const handleSubmit = form.handleSubmit((data) => {
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
    })

    const isLoading = isCreating || isUpdating

    const isFormChange = form.formState.isDirty

    const isDirty = Object.keys(form.formState.dirtyFields).length > 0

    useAlertBeforeClosing(isDirty)

    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit}
                className={cn('w-full space-y-4', className)}
            >
                <FormFieldWrapper
                    control={form.control}
                    name="name"
                    label="Name *"
                    render={({ field }) => (
                        <Input
                            {...field}
                            id={field.name}
                            value={field.value || ''}
                            disabled={isDisabled(field.name)}
                            placeholder="e.g., Cash in Bank, Accounts Payable"
                        />
                    )}
                />
                <FormFieldWrapper
                    control={form.control}
                    label="Type *"
                    name="general_ledger_type"
                    className="col-span-4"
                    render={({ field }) => (
                        <FormControl>
                            <Select
                                disabled={isDisabled(field.name)}
                                onValueChange={(selectedValue) => {
                                    field.onChange(selectedValue)
                                }}
                                defaultValue={field.value}
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
                    name="description"
                    label="Description "
                    render={({ field }) => (
                        <TextEditor
                            {...field}
                            content={field.value}
                            placeholder="Write some description..."
                            disabled={isDisabled(field.name)}
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
                                value={field.value ?? ''}
                                onChange={(e) =>
                                    field.onChange(
                                        parseFloat(e.target.value) || undefined
                                    )
                                }
                                type="number"
                                disabled={isDisabled(field.name)}
                                placeholder="e.g., 100"
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
                                id={field.name}
                                value={field.value || ''}
                                disabled={isDisabled(field.name)}
                                placeholder="e.g., Total Current Assets"
                                autoComplete="off"
                            />
                        )}
                    />
                </div>
                <FormFieldWrapper
                    control={form.control}
                    name="is_posting"
                    className="col-span-2"
                    render={({ field }) => {
                        return (
                            <GradientBackground
                                gradientOnly
                                className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
                            >
                                <Checkbox
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    checked={field.value || false}
                                    onCheckedChange={field.onChange}
                                    name={field.name}
                                    className="order-1 after:absolute after:inset-0"
                                    aria-describedby={`${field.name}-description`}
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
                                            id={`${field.name}-description`}
                                            className="text-xs text-muted-foreground"
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
                        render={({ field }) => (
                            <Input
                                {...field}
                                value={field.value ?? ''}
                                pattern="\d*"
                                onChange={(e) =>
                                    field.onChange(
                                        parseFloat(e.target.value) || undefined
                                    )
                                }
                                disabled={isDisabled(field.name)}
                                placeholder="e.g., 5000.00"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Beginning Balance"
                        name="beginning_balance_of_the_year_debit"
                        render={({ field }) => (
                            <Input
                                {...field}
                                pattern="\d*"
                                value={field.value ?? ''}
                                onChange={(e) =>
                                    field.onChange(
                                        parseFloat(e.target.value) || undefined
                                    )
                                }
                                disabled={isDisabled(field.name)}
                                placeholder="e.g., 5000.00"
                            />
                        )}
                    />
                </div>
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
                                    size="sm"
                                    type="button"
                                    variant="ghost"
                                    onClick={() => form.reset()}
                                    className="w-full self-end px-8 sm:w-fit"
                                >
                                    Reset
                                </Button>
                                <Button
                                    size="sm"
                                    type="submit"
                                    disabled={
                                        isLoading || generalLedgerDefinitionId
                                            ? !isFormChange
                                            : isCreating
                                    }
                                    className="w-full self-end px-8 sm:w-fit"
                                >
                                    {isCreating ? (
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
            title={title}
            description={description}
            className={cn('', className)}
            overlayClassName="!bg-transparent !backdrop-blur-sm"
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
