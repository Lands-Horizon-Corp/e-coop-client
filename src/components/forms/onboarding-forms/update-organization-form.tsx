import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { useForm } from 'react-hook-form'

import { PhoneInput } from '@/components/contact-input/contact-input'
import { GradientBackground } from '@/components/gradient-background/gradient-background'
import { BuildingBranchIcon, VerifiedPatchIcon } from '@/components/icons'
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
import { Separator } from '@/components/ui/separator'

import { cn } from '@/lib/utils'

import { EditOrganizationSchema } from '@/validations/form-validation/onboarding/create-organization-schema'

import { useUpdateOrganization } from '@/hooks/api-hooks/use-organization'
import { useAlertBeforeClosing } from '@/hooks/use-alert-before-closing'
import { useLocationInfo } from '@/hooks/use-location-info'

import { IClassProps, IForm, IOrganizationRequest, TEntityId } from '@/types'

type TEditOrganizationFormValues = z.infer<typeof EditOrganizationSchema>

export interface IEditOrganizationFormProps
    extends IClassProps,
        IForm<
            Partial<IOrganizationRequest>,
            IOrganizationRequest,
            string,
            TEditOrganizationFormValues
        > {
    organizationId?: TEntityId
}

const UpdateOrganizationForm = ({
    organizationId,
    className,
    defaultValues,
    onError,
    onSuccess,
}: IEditOrganizationFormProps) => {
    const { countryCode } = useLocationInfo()

    const form = useForm<TEditOrganizationFormValues>({
        resolver: zodResolver(EditOrganizationSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            ...defaultValues,
        },
    })

    const {
        mutate: updateMutation,
        error,
        isPending,
        reset,
    } = useUpdateOrganization({ onSuccess, onError })

    const onSubmit = form.handleSubmit((formData) => {
        if (organizationId) {
            updateMutation({ organizationId, data: formData })
        }
    })

    const isDirty = Object.keys(form.formState.dirtyFields).length > 0

    useAlertBeforeClosing(isDirty)

    return (
        <Form {...form}>
            <form
                onSubmit={onSubmit}
                className={cn('w-full space-y-5 px-5', className)}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                    <div className="flex flex-col gap-y-2 w-full">
                        <FormFieldWrapper
                            control={form.control}
                            name="name"
                            label="Organization Name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    autoComplete="org-name"
                                    placeholder="enter organization name"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="contact_number"
                            label="Organization Contact Number"
                            className="col-span-2"
                            render={({
                                field,
                                fieldState: { invalid, error },
                            }) => (
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
                                        defaultCountry={countryCode}
                                    />
                                </div>
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="address"
                            label="Organization Address"
                            className="col-span-2"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    autoComplete="organization address"
                                    placeholder="enter organization address"
                                    className=""
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="is_private"
                            render={({ field }) => {
                                return (
                                    <GradientBackground gradientOnly>
                                        <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                            <Checkbox
                                                id={field.name}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                name={field.name}
                                                className="order-1 after:absolute after:inset-0"
                                            />
                                            <div className="flex grow items-center gap-3">
                                                <div className="size-fit rounded-sm bg-secondary p-2">
                                                    <BuildingBranchIcon />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor={field.name}>
                                                        Make this Organization
                                                        Private
                                                    </Label>
                                                </div>
                                            </div>
                                        </div>
                                    </GradientBackground>
                                )
                            }}
                        />
                    </div>
                    <div className=" flex flex-col gap-y-2 w-full">
                        <FormFieldWrapper
                            control={form.control}
                            label="Organization Description"
                            name="description"
                            className="col-span-4"
                            render={({ field }) => {
                                const { ref: _ref, ...rest } = field
                                return (
                                    <FormControl>
                                        <TextEditor
                                            {...rest}
                                            toolBarClassName="bg-background/50 rounded-lg my-2 p-2"
                                            content={field.value || ''}
                                            className="w-full "
                                            textEditorClassName=" !max-w-none"
                                            placeholder="Write some description about your Organization..."
                                        />
                                    </FormControl>
                                )
                            }}
                        />
                    </div>
                </div>
                <Separator />
                <div className="w-full flex flex-col gap-y-5">
                    <div className="my-5">
                        <h2 className="text-2xl font-semibold">
                            {' '}
                            Add Policies
                        </h2>
                        <p className="text-xs text-muted-foreground">
                            This Policies will only apply to this organization.
                        </p>
                    </div>
                    <FormFieldWrapper
                        control={form.control}
                        label="Terms and Conditions"
                        name="terms_and_conditions"
                        className="col-span-4"
                        render={({ field }) => {
                            const { ref: _ref, ...rest } = field
                            return (
                                <FormControl>
                                    <TextEditor
                                        {...rest}
                                        isHeadingDisabled={false}
                                        toolBarClassName="bg-background/50 rounded-lg my-2 p-2"
                                        content={field.value || ''}
                                        className="w-full "
                                        textEditorClassName="!h-[25rem] max-h-[30rem] !max-w-none"
                                        placeholder="Write your terms and conditions..."
                                    />
                                </FormControl>
                            )
                        }}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Privacy Policy"
                        name="privacy_policy"
                        className="col-span-4"
                        render={({ field }) => {
                            const { ref: _ref, ...rest } = field
                            return (
                                <FormControl>
                                    <TextEditor
                                        {...rest}
                                        isHeadingDisabled={false}
                                        toolBarClassName="bg-background/50 rounded-lg my-2 p-2"
                                        content={field.value || ''}
                                        className="w-full "
                                        textEditorClassName="!h-[25rem] max-h-[30rem] !max-w-none"
                                        placeholder="Write your privacy policy..."
                                    />
                                </FormControl>
                            )
                        }}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Cookie Policy"
                        name="cookie_policy"
                        className="col-span-4"
                        render={({ field }) => {
                            const { ref: _ref, ...rest } = field
                            return (
                                <FormControl>
                                    <TextEditor
                                        {...rest}
                                        isHeadingDisabled={false}
                                        toolBarClassName="bg-background/50 rounded-lg my-2 p-2"
                                        content={field.value || ''}
                                        className="w-full"
                                        textEditorClassName="!h-[25rem] max-h-[30rem] !max-w-none"
                                        placeholder="Write your cookie policy..."
                                    />
                                </FormControl>
                            )
                        }}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Refund Policy"
                        name="refund_policy"
                        className="col-span-4"
                        render={({ field }) => {
                            const { ref: _ref, ...rest } = field
                            return (
                                <FormControl>
                                    <TextEditor
                                        {...rest}
                                        isHeadingDisabled={false}
                                        toolBarClassName="bg-background/50 rounded-lg my-2 p-2"
                                        content={field.value || ''}
                                        className="w-full "
                                        textEditorClassName="!h-[25rem] max-h-[30rem] !max-w-none"
                                        placeholder="Write your refund policy..."
                                    />
                                </FormControl>
                            )
                        }}
                    />
                    <div className="space-y-2">
                        <FormFieldWrapper
                            control={form.control}
                            label="User Agreement"
                            name="user_agreement"
                            className="col-span-4"
                            render={({ field }) => {
                                const { ref: _ref, ...rest } = field
                                return (
                                    <FormControl>
                                        <TextEditor
                                            {...rest}
                                            isHeadingDisabled={false}
                                            toolBarClassName="bg-background/50 rounded-lg my-2 p-2"
                                            content={field.value || ''}
                                            className="w-full "
                                            textEditorClassName="!h-[25rem] max-h-[30rem] !max-w-none"
                                            placeholder="Write your user agreement..."
                                        />
                                    </FormControl>
                                )
                            }}
                        />
                        <FormErrorMessage errorMessage={error} />
                        <div className="flex items-center justify-end gap-x-2">
                            <Button
                                size="sm"
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    form.reset()
                                    reset()
                                }}
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
                                {isPending ? (
                                    <LoadingSpinner />
                                ) : organizationId ? (
                                    'Update'
                                ) : (
                                    'Create'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export const UpdateOrganizationFormModal = ({
    title = 'Edit Organization',
    description = 'Fill out the form to edit the organization.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IEditOrganizationFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('max-w-[80rem]', className)}
            {...props}
        >
            <UpdateOrganizationForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default UpdateOrganizationFormModal
