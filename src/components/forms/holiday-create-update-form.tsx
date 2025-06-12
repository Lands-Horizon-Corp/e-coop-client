import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import Modal, { IModalProps } from '@/components/modals/modal'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import LoadingSpinner from '@/components/spinners/loading-spinner'

import { cn } from '@/lib/utils'
import {
    useCreateHoliday,
    useUpdateHoliday,
} from '@/hooks/api-hooks/use-holiday'
import { useFormHelper } from '@/hooks/use-form-helper'

import {
    IForm,
    IHoliday,
    TEntityId,
    IClassProps,
    IHolidayRequest,
} from '@/types'

const holidaySchema = z.object({
    name: z.string().min(1, 'Holiday name is required'),
    entry_date: z.string().min(1, 'Date is required'),
    description: z.string(),
})

type THolidayFormValues = z.infer<typeof holidaySchema>

export interface IHolidayFormProps
    extends IClassProps,
        IForm<Partial<IHolidayRequest>, IHoliday, string, THolidayFormValues> {
    holidayId?: TEntityId
}

const HolidayCreateUpdateForm = ({
    holidayId,
    className,
    defaultValues,
    onError,
    onSuccess,
    ...props
}: IHolidayFormProps) => {
    const form = useForm<THolidayFormValues>({
        resolver: zodResolver(holidaySchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            entry_date: '',
            description: '',
            ...defaultValues,
        },
    })

    const createMutation = useCreateHoliday({ onSuccess, onError })
    const updateMutation = useUpdateHoliday({ onSuccess, onError })

    const onSubmit = form.handleSubmit((formData) => {
        if (holidayId) {
            updateMutation.mutate({ holidayId, data: formData })
        } else {
            createMutation.mutate(formData)
        }
    })

    const { error, isPending, reset } = holidayId
        ? updateMutation
        : createMutation

    const { getDisableHideFieldProps } = useFormHelper<THolidayFormValues>({
        form,
        ...props,
    })

    return (
        <Form {...form}>
            <form
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || props.readOnly}
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
                                    {...getDisableHideFieldProps(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="entry_date"
                            label="Date"
                            render={({ field }) => (
                                <Input
                                    type="date"
                                    {...field}
                                    value={field.value ?? ''}
                                    {...getDisableHideFieldProps(field.name)}
                                    className="block [&::-webkit-calendar-picker-indicator]:hidden"
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
                                    {...getDisableHideFieldProps(field.name)}
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
                            ) : holidayId ? (
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
