import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { CurrencyCombobox } from '@/modules/currency'

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

type TDisbursementSchema = z.infer<typeof DisbursementSchema>

export interface IDisbursementFormProps
    extends IClassProps,
        IForm<
            Partial<IDisbursementRequest>,
            IDisbursement,
            Error,
            TDisbursementSchema
        > {
    disbursementId?: TEntityId
}

const DisbursementCreateUpdateForm = ({
    disbursementId,
    className,
    ...formProps
}: IDisbursementFormProps) => {
    const form = useForm<TDisbursementSchema>({
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
        useFormHelper<TDisbursementSchema>({
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
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                    disabled={isPending || formProps.readOnly}
                >
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            label="Disbursement Name"
                            name="name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Enter disbursement name"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            disabled={isPending}
                            label="Currency *"
                            name="currency_id"
                            render={({ field }) => (
                                <CurrencyCombobox
                                    disabled={
                                        isDisabled(field.name) || isPending
                                    }
                                    onChange={(selected) =>
                                        field.onChange(selected.id)
                                    }
                                    placeholder="Select Currency"
                                    value={field.value}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            description="Enter an emoji or icon character"
                            label="Icon (Optional)"
                            name="icon"
                            render={({ field }) => (
                                <IconCombobox
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    value={field.value as TIcon}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Description"
                            name="description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Enter disbursement description"
                                    rows={3}
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>
                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText={disbursementId ? 'Update' : 'Create'}
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
            className={cn('', className)}
            description={description}
            title={title}
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
