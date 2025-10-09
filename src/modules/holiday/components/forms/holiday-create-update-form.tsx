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
                            label="Holiday Name"
                            name="name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Holiday Name"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            className="relative"
                            control={form.control}
                            description="mm/dd/yyyy"
                            descriptionClassName="absolute top-0 right-0"
                            label="Date"
                            name="entry_date"
                            render={({ field }) => (
                                <InputDate
                                    type="date"
                                    {...field}
                                    className="block"
                                    disabled={isDisabled(field.name)}
                                    value={field.value ?? ''}
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
                                    placeholder="Description"
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
                        reset?.()
                    }}
                    readOnly={formProps.readOnly}
                    submitText={holidayId ? 'Update' : 'Create'}
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
            className={cn('', className)}
            description={description}
            title={title}
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
