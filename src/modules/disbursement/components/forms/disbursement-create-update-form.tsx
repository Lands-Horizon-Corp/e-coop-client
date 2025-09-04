import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'

import IconCombobox from '@/components/comboboxes/icon-combobox'
import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { TIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    useCreateDisbursement,
    useUpdateDisbursementById,
} from '../../disbursement.service'
import { IDisbursement, IDisbursementRequest } from '../../disbursement.types'
import { DisbursementSchema } from '../../disbursement.validation'

type TDisbursementFormValues = z.infer<typeof DisbursementSchema>

export interface IDisbursementFormProps
    extends IClassProps,
        IForm<
            Partial<IDisbursementRequest>,
            IDisbursement,
            Error,
            TDisbursementFormValues
        > {
    disbursementId?: TEntityId
}

const DisbursementCreateUpdateForm = ({
    disbursementId,
    className,
    ...formProps
}: IDisbursementFormProps) => {
    const form = useForm<TDisbursementFormValues>({
        resolver: standardSchemaResolver(DisbursementSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            icon: '',
            description: '',
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateDisbursement({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })
    const updateMutation = useUpdateDisbursementById({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TDisbursementFormValues>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (disbursementId) {
            updateMutation.mutate({ id: disbursementId, payload: formData })
        } else {
            createMutation.mutate(formData)
        }
    }, handleFocusError)

    const {
        error: rawError,
        isPending,
        reset,
    } = disbursementId ? updateMutation : createMutation

    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                ref={formRef}
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || formProps.readOnly}
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
                                    disabled={isDisabled(field.name)}
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
                <FormFooterResetSubmit
                    error={error}
                    readOnly={formProps.readOnly}
                    isLoading={isPending}
                    disableSubmit={!form.formState.isDirty}
                    submitText={disbursementId ? 'Update' : 'Create'}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                />
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
