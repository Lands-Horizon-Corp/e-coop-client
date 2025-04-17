import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/ui/input'
import {
    ChecklistTemplate,
    ValueChecklistMeter,
} from '@/components/value-checklist-indicator'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { VerifiedPatchIcon } from '@/components/icons'
import { Form, FormControl } from '@/components/ui/form'
import PasswordInput from '@/components/ui/password-input'
import Modal, { IModalProps } from '@/components/modals/modal'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import FormErrorMessage from '@/components/ui/form-error-message'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { PhoneInput } from '@/components/contact-input/contact-input'
import InputDatePicker from '@/components/date-time-pickers/input-date-picker'

import { cn } from '@/lib/utils'
import { IClassProps } from '@/types'
import {
    useCreateMember,
    useUpdateMember,
} from '@/hooks/api-hooks/member/use-member'
import { IForm } from '@/types/components'
import {
    createMemberAccountSchema,
    updateMemberAccountSchema,
    memberCreateUpdateAccountSchema,
} from '@/validations/member/member-account-schema'

type TMemberCreateUpdateForm = z.infer<typeof memberCreateUpdateAccountSchema>

interface IMemberCreateUpdateFormProps
    extends IClassProps,
        IForm<Partial<TMemberCreateUpdateForm>, unknown, string> {}

const MemberCreateUpdateForm = ({
    readOnly,
    className,
    hiddenFields,
    defaultValues,
    onError,
    onSuccess,
}: IMemberCreateUpdateFormProps) => {
    const form = useForm<TMemberCreateUpdateForm>({
        resolver: zodResolver(memberCreateUpdateAccountSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            username: '',
            firstName: '',
            lastName: '',
            middleName: '',
            birthDate: new Date(),
            contactNumber: '',
            permanentAddress: '',
            email: '',
            ...defaultValues,
        },
    })

    const {
        error: createError,
        isPending: isCreating,
        mutate: createMember,
    } = useCreateMember({ onSuccess, onError })

    const {
        error: updateError,
        isPending: isUpdating,
        mutate: updateMember,
    } = useUpdateMember({
        onSuccess: (data) => {
            form.reset({ ...data, birthDate: new Date(data.birthDate) })
            onSuccess?.(data)
        },
        onError,
    })

    const handleSubmit = (data: TMemberCreateUpdateForm) => {
        if (data.id) {
            updateMember({
                id: data.id,
                data: data as unknown as z.infer<
                    typeof updateMemberAccountSchema
                >,
            })
        } else {
            createMember(
                data as unknown as z.infer<typeof createMemberAccountSchema>
            )
        }
    }

    const error = createError || updateError
    const isLoading = isUpdating || isCreating

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isLoading || readOnly}
                    className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3 sm:gap-y-3"
                >
                    <div className="space-y-3">
                        <legend>Account Information</legend>

                        <FormFieldWrapper
                            control={form.control}
                            name="username"
                            label="Username"
                            hiddenFields={hiddenFields}
                            render={({ field }) => (
                                <FormControl>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        autoComplete="username"
                                        placeholder="Username"
                                    />
                                </FormControl>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="password"
                            label="Password"
                            hiddenFields={hiddenFields}
                            render={({ field }) => (
                                <FormControl>
                                    <div className="space-y-1">
                                        <PasswordInput
                                            {...field}
                                            maxLength={50}
                                            id={field.name}
                                            placeholder="Password"
                                            autoComplete="new-password"
                                        />
                                        {field.value && (
                                            <ValueChecklistMeter
                                                value={field.value}
                                                checkList={ChecklistTemplate[
                                                    'password-checklist'
                                                ].concat([
                                                    {
                                                        regex: /^.{0,50}$/,
                                                        text: 'No more than 50 characters',
                                                    },
                                                ])}
                                            />
                                        )}
                                    </div>
                                </FormControl>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="confirmPassword"
                            label="Confirm Password"
                            hiddenFields={hiddenFields}
                            render={({ field }) => (
                                <FormControl>
                                    <PasswordInput
                                        {...field}
                                        id={field.name}
                                        autoComplete="off"
                                        placeholder="Confirm Password"
                                    />
                                </FormControl>
                            )}
                        />
                    </div>

                    <div className="space-y-3">
                        <legend>Personal Information</legend>

                        <FormFieldWrapper
                            control={form.control}
                            name="firstName"
                            label="First Name"
                            hiddenFields={hiddenFields}
                            render={({ field }) => (
                                <FormControl>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        autoComplete="given-name"
                                        placeholder="First Name"
                                    />
                                </FormControl>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="middleName"
                            label="Middle Name"
                            hiddenFields={hiddenFields}
                            render={({ field }) => (
                                <FormControl>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Middle Name"
                                        autoComplete="additional-name"
                                    />
                                </FormControl>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="lastName"
                            label="Last Name"
                            hiddenFields={hiddenFields}
                            render={({ field }) => (
                                <FormControl>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Last Name"
                                        autoComplete="family-name"
                                    />
                                </FormControl>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="birthDate"
                            label="Birth Date"
                            hiddenFields={hiddenFields}
                            render={({ field }) => (
                                <FormControl>
                                    <InputDatePicker
                                        id={field.name}
                                        value={field.value}
                                        onChange={field.onChange}
                                        captionLayout="dropdown-buttons"
                                        disabled={(date) => date > new Date()}
                                    />
                                </FormControl>
                            )}
                        />
                    </div>

                    <div className="space-y-3">
                        <legend>Contact Information</legend>

                        <FormFieldWrapper
                            control={form.control}
                            name="email"
                            label="Email"
                            hiddenFields={hiddenFields}
                            render={({ field }) => (
                                <FormControl>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        autoComplete="email"
                                        placeholder="Email"
                                    />
                                </FormControl>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="contactNumber"
                            label="Contact Number"
                            hiddenFields={hiddenFields}
                            render={({
                                field,
                                fieldState: { invalid, error },
                            }) => (
                                <FormControl>
                                    <div className="relative flex flex-1 items-center gap-x-2">
                                        <VerifiedPatchIcon
                                            className={cn(
                                                'absolute right-2 top-1/2 z-20 size-4 -translate-y-1/2 text-primary delay-300 duration-300 ease-in-out',
                                                (invalid || error) &&
                                                    'text-destructive'
                                            )}
                                        />
                                        <PhoneInput
                                            {...field}
                                            className="w-full"
                                            defaultCountry="PH"
                                        />
                                    </div>
                                </FormControl>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="permanentAddress"
                            label="Permanent Address"
                            hiddenFields={hiddenFields}
                            render={({ field }) => (
                                <FormControl>
                                    <Input
                                        {...field}
                                        id={field.name}
                                        autoComplete="street-address"
                                        placeholder="Permanent Address"
                                    />
                                </FormControl>
                            )}
                        />
                    </div>
                </fieldset>

                <FormErrorMessage errorMessage={error} />
                <div>
                    <Separator className="my-2 sm:my-4" />
                    <div className="flex items-center justify-end gap-x-2">
                        <Button
                            type="button"
                            variant="ghost"
                            disabled={isLoading}
                            onClick={() => form.reset()}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isLoading ? (
                                <LoadingSpinner />
                            ) : defaultValues?.id ? (
                                'Save'
                            ) : (
                                'Create'
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export const MemberCreateUpdateFormModal = ({
    title = 'Create Member',
    description = 'Fill out the form to add a new member.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<IMemberCreateUpdateFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('sm:max-w-full lg:max-w-7xl', className)}
            {...props}
        >
            <MemberCreateUpdateForm {...formProps} />
        </Modal>
    )
}

export default MemberCreateUpdateForm
