import z from 'zod'
import { useForm, Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { HandCoinsIcon, PieChartIcon } from 'lucide-react'

import { Form } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import Modal, { IModalProps } from '@/components/modals/modal'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import MemberTypeCombobox from '@/components/comboboxes/member-type-combobox'
import CivilStatusCombobox from '@/components/comboboxes/civil-status-combobox'
import MemberGenderCombobox from '@/components/comboboxes/member-gender-combobox'
import GeneralStatusCombobox from '@/components/comboboxes/general-status-combobox'
import MemberClassificationCombobox from '@/components/comboboxes/member-classification-combobox'

import { cn } from '@/lib/utils'
import { useQuickCreateMemberProfile } from '@/hooks/api-hooks/member/use-member-profile'
import { quickCreateMemberProfileSchema } from '@/validations/member/member-profile-schema'

import { IForm } from '@/types'
import {
    IClassProps,
    IMemberProfile,
    IMemberProfileQuickCreateRequest,
} from '@/types'
import { parseDate } from '@internationalized/date'
import { DateInput, DatePicker, DateSegment } from 'react-aria-components'

type TMemberProfileQuickFormValues = z.infer<
    typeof quickCreateMemberProfileSchema
>

export interface IMemberProfileQuickCreateFormProps
    extends IClassProps,
        IForm<
            Partial<IMemberProfileQuickCreateRequest>,
            IMemberProfile,
            string
        > {}

const MemberProfileQuickCreateForm = ({
    readOnly,
    className,
    hiddenFields,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: IMemberProfileQuickCreateFormProps) => {
    const form = useForm<TMemberProfileQuickFormValues>({
        resolver: zodResolver(quickCreateMemberProfileSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            organization_id: 'a0ddb598-c98c-443e-9c05-ca80bcc94be5', // TODO: REMOVE ONCE ORG BRANCH DONE
            branch_id: 'cecfa0bc-be4b-488c-b64e-44adbc555645', // TODO: REMOVE ONCE ORG BRANCH DONE
            first_name: '',
            last_name: '',
            status: 'for review',
            civil_status: 'single',
            is_mutual_fund_member: false,
            is_micro_finance_member: false,
            ...defaultValues,
        },
    })

    const { mutate, error, isPending } = useQuickCreateMemberProfile({
        onSuccess,
        onError,
    })

    const onSubmit = form.handleSubmit((formData) => {
        mutate(formData)
    })

    const isDisabled = (field: Path<TMemberProfileQuickFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    return (
        <Form {...form}>
            <form
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || readOnly}
                    className="grid gap-x-6 gap-y-4"
                >
                    <div className="space-y-4">
                        <p className="text-muted-foreground">
                            Membership Information
                        </p>
                        <div className="grid grid-cols-1 gap-x-2 gap-y-4 sm:grid-cols-2">
                            <FormFieldWrapper
                                control={form.control}
                                name="member_type_id"
                                label="Member Type *"
                                className="col-span-1"
                                render={({ field }) => (
                                    <MemberTypeCombobox
                                        {...field}
                                        placeholder="Select Member Type"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="member_classification_id"
                                label="Member Classification *"
                                className="col-span-1"
                                render={({ field }) => (
                                    <MemberClassificationCombobox
                                        {...field}
                                        placeholder="Select Member Classification"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="passbook"
                                label="Passbook"
                                className="col-span-1"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Passbook"
                                        autoComplete="off"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="old_reference_id"
                                label="Old Passbook (optional)"
                                className="col-span-1"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Old Passbook/Old Reference ID"
                                        autoComplete="off"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="status"
                                label="Member Profile Status"
                                className="col-span-1"
                                render={({ field }) => (
                                    <GeneralStatusCombobox
                                        {...field}
                                        placeholder="Status"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                        <p className="text-muted-foreground">
                            Personal Information
                        </p>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-10">
                            <FormFieldWrapper
                                control={form.control}
                                name="first_name"
                                label="First Name *"
                                className="col-span-3"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="First Name"
                                        autoComplete="given-name"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="middle_name"
                                label="Middle Name"
                                className="col-span-3"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Middle Name"
                                        autoComplete="additional-name"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="last_name"
                                label="Last Name *"
                                className="col-span-3"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Last Name"
                                        autoComplete="family-name"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="suffix"
                                label="Suffix"
                                className="col-span-1"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder=""
                                        autoComplete="honorific-suffix"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            <FormFieldWrapper
                                control={form.control}
                                name="civil_status"
                                label="Civil Status *"
                                render={({ field }) => (
                                    <CivilStatusCombobox
                                        {...field}
                                        id={field.name}
                                        placeholder="Civil Status"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="member_gender_id"
                                label="Gender *"
                                render={({ field }) => (
                                    <MemberGenderCombobox
                                        {...field}
                                        placeholder="Select Gender"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="birth_date"
                                label="Date of Birth *"
                                render={({ field }) => (
                                    // <Input
                                    //     type="date"
                                    //     {...field}
                                    //     value={field.value ?? ''}
                                    // />
                                    <DatePicker
                                        value={
                                            field.value
                                                ? parseDate(field.value)
                                                : undefined
                                        }
                                        onChange={(val) => {
                                            if (!val) return field.onChange('')
                                            field.onChange(val.toString())
                                        }}
                                    >
                                        <DateInput>
                                            {(segment) => (
                                                <DateSegment
                                                    segment={segment}
                                                />
                                            )}
                                        </DateInput>
                                    </DatePicker>
                                )}
                            />
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <p className="text-muted-foreground">Other</p>
                        <div className="grid gap-x-2 gap-y-4 sm:grid-cols-2">
                            <FormFieldWrapper
                                name="is_mutual_fund_member"
                                control={form.control}
                                hiddenFields={hiddenFields}
                                className="col-span-1"
                                render={({ field }) => (
                                    <div className="shadow-xs relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                        <Checkbox
                                            id={field.name}
                                            className="order-1 after:absolute after:inset-0"
                                            aria-describedby={`${field.name}`}
                                        />
                                        <div className="flex grow items-center gap-3">
                                            <div className="size-fit rounded-full bg-secondary p-2">
                                                <PieChartIcon />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor={field.name}>
                                                    Mutual Fund Member
                                                    <span className="text-xs font-normal leading-[inherit] text-muted-foreground"></span>
                                                </Label>
                                                <p
                                                    id={`${field.name}`}
                                                    className="text-xs text-muted-foreground"
                                                >
                                                    Contributes to a pooled
                                                    investment (mutual fund).
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />
                            <FormFieldWrapper
                                name="is_micro_finance_member"
                                control={form.control}
                                hiddenFields={hiddenFields}
                                className="col-span-1"
                                render={({ field }) => (
                                    <div className="shadow-xs relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                        <Checkbox
                                            id={field.name}
                                            className="order-1 after:absolute after:inset-0"
                                            aria-describedby={`${field.name}`}
                                        />
                                        <div className="flex grow items-center gap-3">
                                            <div className="size-fit rounded-full bg-secondary p-2">
                                                <HandCoinsIcon />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor={field.name}>
                                                    Micro Finance Member
                                                    <span className="text-xs font-normal leading-[inherit] text-muted-foreground"></span>
                                                </Label>
                                                <p
                                                    id={`${field.name}`}
                                                    className="text-xs text-muted-foreground"
                                                >
                                                    Participates in small-scale
                                                    financial services.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                </fieldset>
                <span className="text-center text-xs text-muted-foreground">
                    You can setup other member profile information later after
                    creation
                </span>
                <Separator className="my-2 sm:my-4" />
                <div>
                    <FormErrorMessage errorMessage={error} />
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
                            disabled={isPending}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isPending ? <LoadingSpinner /> : 'Create'}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export const MemberProfileQuickCreateFormModal = ({
    title = 'Quick Create Member Profile',
    description = 'Fill out the form to quickly create a member profile.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IMemberProfileQuickCreateFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('!max-w-4xl', className)}
            {...props}
        >
            <MemberProfileQuickCreateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MemberProfileQuickCreateForm
