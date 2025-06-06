import Modal, { IModalProps } from '@/components/modals/modal'

import { IClassProps, IForm, TEntityId } from '@/types'

import { cn } from '@/lib'
import { Path, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { Form, FormControl } from '@/components/ui/form'

import { GradientBackground } from '@/components/gradient-background/gradient-background'
import { Checkbox } from '@/components/ui/checkbox'
import { CloseIcon, NoteIcon } from '@/components/icons'
import { Label } from '@/components/ui/label'
import {
    FinancialStatementTypeEnum,
    IFinancialStatementDefinition,
    IFinancialStatementDefinitionRequest,
} from '@/types/coop-types/financial-statement-definition'
import { FinancialStatementDefinitionSchema } from '@/validations/financial-statement-definition/financial-statement-definition-schema'
import TextEditor from '@/components/text-editor'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select'

type TFinancialStatementDefinitionFormValues = z.infer<
    typeof FinancialStatementDefinitionSchema
>

interface IFinancialStatementDefinitionCreateUpdateFormProps
    extends IClassProps,
        IForm<
            Partial<IFinancialStatementDefinitionRequest>,
            IFinancialStatementDefinition,
            string,
            TFinancialStatementDefinitionFormValues
        > {
    accountId?: TEntityId
}

const FSDefinitionCreateUpdateForm = ({
    defaultValues,
    className,
    readOnly,
    disabledFields,
}: IFinancialStatementDefinitionCreateUpdateFormProps) => {
    // const { currentAuth } = useAuthUserWithOrgBranch()
    // const organizationId = currentAuth.user_organization.organization_id
    // const branchId = currentAuth.user_organization.branch_id

    const form = useForm<TFinancialStatementDefinitionFormValues>({
        resolver: zodResolver(FinancialStatementDefinitionSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            name_in_total: '',
            index: 0,
            is_posting: false,
            exclude: false,
            financial_statement_type: FinancialStatementTypeEnum.Assets,
            ...defaultValues,
        },
    })
    const isDisabled = (field: Path<TFinancialStatementDefinitionFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    const handleSubmit = form.handleSubmit((data) => {
        console.log('Form submitted:', data)
    })

    console.log(form.formState.errors)

    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit}
                className={cn('w-full space-y-2', className)}
            >
                <FormFieldWrapper
                    control={form.control}
                    name="name"
                    label="Financial Statement Item Name"
                    render={({ field }) => (
                        <Input
                            {...field}
                            id={field.name}
                            disabled={isDisabled(field.name)}
                            placeholder="Enter item name (e.g., Total Current Assets)"
                            autoComplete="off"
                        />
                    )}
                />

                <FormFieldWrapper
                    control={form.control}
                    label="Financial Statement Type"
                    name="financial_statement_type"
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
                    name="description"
                    label="Description"
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
                <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2">
                    <FormFieldWrapper
                        control={form.control}
                        label="Display Order Index"
                        name="index"
                        className=""
                        render={({ field }) => (
                            <div className="flex grow flex-col gap-y-2">
                                <Input
                                    {...field}
                                    value={field.value}
                                    onChange={(e) =>
                                        field.onChange(
                                            parseFloat(e.target.value)
                                        )
                                    }
                                    placeholder="e.g., 10 (for sorting)"
                                />
                            </div>
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Name in Total (Optional)"
                        name="name_in_total"
                        render={({ field }) => (
                            <Input
                                {...field}
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
                            <GradientBackground gradientOnly>
                                <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                    <Checkbox
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        name={field.name}
                                        className="order-1 after:absolute after:inset-0"
                                        aria-describedby={`${field.name}`}
                                    />
                                    <div className="flex grow items-center gap-3">
                                        <div className="size-fit rounded-full bg-secondary p-2">
                                            <NoteIcon />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={field.name}>
                                                is posting
                                            </Label>
                                            <p
                                                id={`${field.name}`}
                                                className="text-xs text-muted-foreground"
                                            >
                                                this item will set to posting.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </GradientBackground>
                        )
                    }}
                />
                <FormFieldWrapper
                    control={form.control}
                    name="exclude"
                    className="col-span-2"
                    render={({ field }) => {
                        return (
                            <GradientBackground gradientOnly>
                                <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                    <Checkbox
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        name={field.name}
                                        className="order-1 after:absolute after:inset-0"
                                        aria-describedby={`${field.name}`}
                                    />
                                    <div className="flex grow items-center gap-3">
                                        <div className="size-fit rounded-full bg-secondary p-2">
                                            <CloseIcon />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={field.name}>
                                                Exclude from Consolidated Total
                                            </Label>
                                            <p
                                                id={`${field.name}`}
                                                className="text-xs text-muted-foreground"
                                            >
                                                Check to exclude this item from
                                                the overall consolidated total.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </GradientBackground>
                        )
                    }}
                />
                <div className="grid w-full grid-cols-1 gap-2 py-2 md:grid-cols-2">
                    <div className="col-span-2 space-y-2">
                        <FormErrorMessage errorMessage={''} />
                        <div className="flex items-center justify-end gap-x-2">
                            <Button
                                size="sm"
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    form.reset()
                                }}
                                className="w-full self-end px-8 sm:w-fit"
                            >
                                Reset
                            </Button>
                            <Button
                                size="sm"
                                type="submit"
                                className="w-full self-end px-8 sm:w-fit"
                            >
                                Create
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export const FSDefinitionCreateUpdateFormModal = ({
    title = 'Create Financial Statement Definition',
    description = 'Fill out the form to add a new  Financial Statement Definition',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<
        IFinancialStatementDefinitionCreateUpdateFormProps,
        'className'
    >
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <FSDefinitionCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default FSDefinitionCreateUpdateForm
