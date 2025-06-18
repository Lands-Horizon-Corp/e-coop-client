import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import TextEditor from '@/components/text-editor'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl } from '@/components/ui/form'
import Modal, { IModalProps } from '@/components/modals/modal'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import FormErrorMessage from '@/components/ui/form-error-message'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { GradientBackground } from '@/components/gradient-background/gradient-background'

import { MoneyBagIcon } from '@/components/icons'

import { IClassProps, IForm, TEntityId } from '@/types'
import {
    GeneralLedgerTypeEnum,
    IGeneralLedgerDefinition,
    IGeneralLedgerDefinitionRequest,
    GeneralLedgerFinancialStatementNodeType,
} from '@/types/coop-types/general-ledger-definitions'

import {
    GeneralLedgerDefinitionSchema,
    IGeneralLedgerDefinitionFormValues,
} from '@/validations/general-ledger-definition/general-ledger-definition-schema'

import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'
import { useCreateGeneralLedgerDefinition } from '@/hooks/api-hooks/general-ledger-definition/use-general-ledger-definition'

import { cn } from '@/lib'
import { Path, useForm } from 'react-hook-form'

interface IGeneralLedgerDefinitionCreateUpdateFormProps
    extends IClassProps,
        IForm<
            Partial<IGeneralLedgerDefinitionRequest>,
            IGeneralLedgerDefinition,
            string,
            IGeneralLedgerDefinitionFormValues
        > {
    generalLedgerId?: TEntityId
}
const GeneralLedgerDefinitionCreateUpdateForm = ({
    defaultValues,
    className,
    readOnly,
    disabledFields,
    generalLedgerId,
}: IGeneralLedgerDefinitionCreateUpdateFormProps) => {
    const { currentAuth } = useAuthUserWithOrgBranch()

    const organizationId = currentAuth.user_organization.organization_id
    const branchId = currentAuth.user_organization.branch_id

    const form = useForm<IGeneralLedgerDefinitionFormValues>({
        resolver: zodResolver(GeneralLedgerDefinitionSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            ...defaultValues,
        },
    })

    const isDisabled = (field: Path<IGeneralLedgerDefinitionFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    const { mutate: CreateGeneralLedgerDefinition, isPending: isCreating } =
        useCreateGeneralLedgerDefinition({
            onSuccess: () => {
                form.reset()
            },
        })

    // Handle form submission
    const handleSubmit = form.handleSubmit((data) => {
        const request = {
            organization_id: organizationId,
            branch_id: branchId,
            ...data,
        }
        CreateGeneralLedgerDefinition(request)
    })

    const isFormChange = form.formState.isDirty

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
                                pattern="\d*"
                                onChange={(e) =>
                                    field.onChange(
                                        parseFloat(e.target.value) || undefined
                                    )
                                }
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
                    name="type"
                    className="col-span-2"
                    render={({ field }) => (
                        <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value || ''}
                            disabled={isDisabled(field.name)}
                            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                        >
                            {Object.values(
                                GeneralLedgerFinancialStatementNodeType
                            ).map((type) => (
                                <GradientBackground gradientOnly>
                                    <div
                                        key={type}
                                        className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
                                    >
                                        <RadioGroupItem
                                            value={type}
                                            id={`interest-fines-diminishing-${type}`}
                                            className="order-1 after:absolute after:inset-0"
                                        />
                                        <div className="flex grow items-center gap-3">
                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor={`interest-fines-diminishing-${type}`}
                                                >
                                                    {type}
                                                </Label>
                                                <p
                                                    id={`interest-fines-diminishing-${type}-description`}
                                                    className="text-xs text-muted-foreground"
                                                >
                                                    {type ===
                                                        GeneralLedgerFinancialStatementNodeType.DEFINITION &&
                                                        'General Ledger Definition'}
                                                    {type ===
                                                        GeneralLedgerFinancialStatementNodeType.ACCOUNT &&
                                                        'General Ledger Account.'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </GradientBackground>
                            ))}
                        </RadioGroup>
                    )}
                />
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
                                        generalLedgerId
                                            ? !isFormChange
                                            : isCreating
                                    }
                                    className="w-full self-end px-8 sm:w-fit"
                                >
                                    {isCreating ? (
                                        <LoadingSpinner />
                                    ) : generalLedgerId ? (
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

export default GeneralLedgerDefinitionCreateUpdateForm
