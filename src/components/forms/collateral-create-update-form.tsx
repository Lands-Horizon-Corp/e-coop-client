import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { Path, useForm } from 'react-hook-form'

import IconCombobox from '@/components/comboboxes/icon-combobox'
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

import { collateralSchema } from '@/validations/form-validation/collateral-schema'

import {
    useCreateCollateral,
    useUpdateCollateral,
} from '@/hooks/api-hooks/use-collateral'

import { IClassProps, ICollateral, IForm, TEntityId, TIcon } from '@/types'

type TCollateralFormValues = z.infer<typeof collateralSchema>

export interface ICollateralFormProps
    extends IClassProps,
        IForm<
            Partial<TCollateralFormValues>,
            ICollateral,
            string,
            TCollateralFormValues
        > {
    collateralId?: TEntityId
}

const CollateralCreateUpdateForm = ({
    collateralId,
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: ICollateralFormProps) => {
    const form = useForm<TCollateralFormValues>({
        resolver: zodResolver(collateralSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            name: '',
            description: '',
            icon: '',
            ...defaultValues,
        },
    })

    const createMutation = useCreateCollateral({ onSuccess, onError })
    const updateMutation = useUpdateCollateral({ onSuccess, onError })

    const onSubmit = form.handleSubmit((formData) => {
        if (collateralId) {
            updateMutation.mutate({ id: collateralId, data: formData })
        } else {
            createMutation.mutate(formData)
        }
    })

    const { error, isPending } = collateralId ? updateMutation : createMutation

    const isDisabled = (field: Path<TCollateralFormValues>) =>
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
                    <FormFieldWrapper
                        control={form.control}
                        name="name"
                        label="Name *"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                placeholder="Collateral Name"
                                autoComplete="off"
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
                                placeholder="Optional description"
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        name="icon"
                        label="Icon *"
                        render={({ field }) => (
                            <IconCombobox
                                {...field}
                                value={field.value as TIcon}
                            />
                        )}
                    />
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
                            ) : collateralId ? (
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

export const CollateralCreateUpdateFormModal = ({
    title = 'Create Collateral',
    description = 'Fill out the form to add a new collateral.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ICollateralFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <CollateralCreateUpdateForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default CollateralCreateUpdateForm
