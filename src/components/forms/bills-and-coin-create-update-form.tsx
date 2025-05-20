import z from 'zod'
import { useForm, Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Modal, { IModalProps } from '@/components/modals/modal'
import { CountryCombobox } from '../comboboxes/country-combobox'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import LoadingSpinner from '@/components/spinners/loading-spinner'

import { cn } from '@/lib/utils'
import {
    useCreateBillsAndCoin,
    useUpdateBillsAndCoin,
} from '@/hooks/api-hooks/use-bills-and-coins'

import {
    IForm,
    TEntityId,
    IClassProps,
    IBillsAndCoin,
    IBillsAndCoinRequest,
    IMedia,
} from '@/types'
import ImageField from '../ui/image-field'

const billsAndCoinSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    value: z.coerce.number().min(0, 'Value is required'),
    country_code: z.string().min(1, 'Country code is required'),
    media_id: z.string().optional(),
    media: z.any(),
    branch_id: z.string().optional(),
    organization_id: z.string().optional(),
})

type TBillsAndCoinFormValues = z.infer<typeof billsAndCoinSchema>

export interface IBillsAndCoinFormProps
    extends IClassProps,
        IForm<
            Partial<IBillsAndCoinRequest>,
            IBillsAndCoin,
            string,
            TBillsAndCoinFormValues
        > {
    billsAndCoinId?: TEntityId
}

const BillsAndCoinCreateUpdateForm = ({
    billsAndCoinId,
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: IBillsAndCoinFormProps) => {
    const form = useForm<TBillsAndCoinFormValues>({
        resolver: zodResolver(billsAndCoinSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            value: 0,
            country_code: '',
            ...defaultValues,
        },
    })

    const createMutation = useCreateBillsAndCoin({ onSuccess, onError })
    const updateMutation = useUpdateBillsAndCoin({ onSuccess, onError })

    const onSubmit = form.handleSubmit((formData) => {
        if (billsAndCoinId) {
            updateMutation.mutate({ id: billsAndCoinId, data: formData })
        } else {
            createMutation.mutate(formData)
        }
    })

    const { error, isPending } = billsAndCoinId
        ? updateMutation
        : createMutation

    const isDisabled = (field: Path<TBillsAndCoinFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

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
                            label="Name *"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Bill/Coin Name"
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="value"
                            label="Value *"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="number"
                                    step="0.01"
                                    placeholder="Value"
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="country_code"
                            label="Country Code *"
                            render={({ field }) => (
                                <CountryCombobox
                                    {...field}
                                    defaultValue={field.value}
                                    onChange={(country) =>
                                        field.onChange(country.alpha2)
                                    }
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="media_id"
                            label="Bill/Coin Photo"
                            render={({ field }) => {
                                const value = form.watch('media')
                                return (
                                    <ImageField
                                        {...field}
                                        placeholder="Upload Bill/Coin Photo"
                                        value={
                                            value
                                                ? (value as IMedia).download_url
                                                : value
                                        }
                                        onChange={(newImage) => {
                                            if (newImage)
                                                field.onChange(newImage.id)
                                            else field.onChange(undefined)

                                            form.setValue('media', newImage)
                                        }}
                                    />
                                )
                            }}
                        />
                    </fieldset>
                </fieldset>
                <FormErrorMessage errorMessage={error} />
                <div>
                    <Separator className="my-2 sm:my-4" />
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
                            {isPending ? (
                                <LoadingSpinner />
                            ) : billsAndCoinId ? (
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

export const BillsAndCoinCreateUpdateFormModal = ({
    title = 'Create Bill or Coin',
    description = 'Fill out the form to add a new bill or coin.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IBillsAndCoinFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <BillsAndCoinCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default BillsAndCoinCreateUpdateForm
