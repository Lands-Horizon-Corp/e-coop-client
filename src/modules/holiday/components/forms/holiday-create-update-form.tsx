import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { toInputDateString } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import { useCreateHoliday, useUpdateHolidayById } from '../..'
import { IHoliday, IHolidayRequest } from '../../holiday.types'
import { HolidaySchema, THolidaySchema } from '../../holiday.validation'

export interface IHolidayFormProps
    extends IClassProps,
        IForm<Partial<IHolidayRequest>, IHoliday, Error, THolidaySchema> {
    holidayId?: TEntityId
}

const HolidayCreateUpdateForm = ({
    holidayId,
    className,
    ...formProps
}: IHolidayFormProps) => {
    const form = useForm<THolidaySchema>({
        resolver: standardSchemaResolver(HolidaySchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            ...formProps.defaultValues,
            entry_date: toInputDateString(
                formProps.defaultValues?.entry_date ?? new Date()
            ),
        },
    })

    const createMutation = useCreateHoliday({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Holiday created',
                textError: 'Failed to create holiday',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })
    const updateMutation = useUpdateHolidayById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Holiday updated',
                textError: 'Failed to update holiday',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<THolidaySchema>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((formData) => {
        const data = {
            ...formData,
            entry_date: new Date(formData.entry_date).toISOString(),
        }

        if (holidayId) {
            updateMutation.mutate({
                id: holidayId,
                payload: data,
            })
        } else {
            createMutation.mutate(data)
        }
    }, handleFocusError)

    const {
        error: rawError,
        isPending,
        reset,
    } = holidayId ? updateMutation : createMutation

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
                            label="Holiday Name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    autoComplete="off"
                                    placeholder="Holiday Name"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="entry_date"
                            label="Date"
                            className="relative"
                            description="mm/dd/yyyy"
                            descriptionClassName="absolute top-0 right-0"
                            render={({ field }) => (
                                <InputDate
                                    type="date"
                                    {...field}
                                    value={field.value ?? ''}
                                    disabled={isDisabled(field.name)}
                                    className="block"
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
                                    placeholder="Description"
                                    disabled={isDisabled(field.name)}
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
                    submitText={holidayId ? 'Update' : 'Create'}
                    onReset={() => {
                        form.reset()
                        reset?.()
                    }}
                />
            </form>
        </Form>
    )
}

export const HolidayCreateUpdateFormModal = ({
    title = 'Create Holiday',
    description = 'Fill out the form to add a new holiday.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IHolidayFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <HolidayCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default HolidayCreateUpdateForm
