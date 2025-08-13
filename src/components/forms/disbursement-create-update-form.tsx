import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { Path, useForm } from 'react-hook-form'

import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

import { cn } from '@/lib/utils'

import { disbursementSchema } from '@/validations/form-validation/disbursement-schema'

import {
    useCreateDisbursement,
    useUpdateDisbursement,
} from '@/hooks/api-hooks/use-disbursement'
import { useAlertBeforeClosing } from '@/hooks/use-alert-before-closing'

import {
    IClassProps,
    IDisbursement,
    IDisbursementRequest,
    IForm,
    TEntityId,
    TIcon,
} from '@/types'

import IconCombobox from '../comboboxes/icon-combobox'

type TDisbursementFormValues = z.infer<typeof disbursementSchema>

export interface IDisbursementFormProps
    extends IClassProps,
        IForm<
            Partial<IDisbursementRequest>,
            IDisbursement,
            string,
            TDisbursementFormValues
        > {
    disbursementId?: TEntityId
}

const DisbursementCreateUpdateForm = ({
    disbursementId,
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: IDisbursementFormProps) => {
    const form = useForm<TDisbursementFormValues>({
        resolver: zodResolver(disbursementSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            icon: '',
            description: '',
            ...defaultValues,
        },
    })

    const createMutation = useCreateDisbursement({ onSuccess, onError })
    const updateMutation = useUpdateDisbursement({ onSuccess, onError })

    const onSubmit = form.handleSubmit((formData) => {
        if (disbursementId) {
            updateMutation.mutate({ disbursementId, data: formData })
        } else {
            createMutation.mutate(formData)
        }
    })

    const { error, isPending, reset } = disbursementId
        ? updateMutation
        : createMutation

    const isDisabled = (field: Path<TDisbursementFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    const isDirty = Object.keys(form.formState.dirtyFields).length > 0

    useAlertBeforeClosing(isDirty)

    return (
        <Form {...form}>
            <form
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || readOnly}
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                >
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            name="name"
                            label="Disbursement Name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Enter disbursement name"
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="icon"
                            label="Icon (Optional)"
                            description="Enter an emoji or icon character"
                            render={({ field }) => (
                                <IconCombobox
                                    {...field}
                                    value={field.value as TIcon}
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
                                    autoComplete="off"
                                    placeholder="Enter disbursement description"
                                    disabled={isDisabled(field.name)}
                                    rows={3}
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>
                <Separator />
                <div className="space-y-2">
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
                            ) : disbursementId ? (
                                'Update'
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

export const DisbursementCreateUpdateFormModal = ({
    title = 'Create Disbursement',
    description = 'Fill out the form to add a new disbursement type.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IDisbursementFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <DisbursementCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default DisbursementCreateUpdateForm
