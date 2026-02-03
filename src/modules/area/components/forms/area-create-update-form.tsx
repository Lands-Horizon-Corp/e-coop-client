import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { IMedia } from '@/modules/media/media.types'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import MapPicker from '@/components/map/map-picker'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import ImageField from '@/components/ui/image-field'
import { Input } from '@/components/ui/input'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import { useCreateArea, useUpdateAreaById } from '../..'
import { IArea, IAreaRequest } from '../../area.types'
import { AreaSchema } from '../../area.validation'

type TAreaFormValues = z.infer<typeof AreaSchema>

const DEFAULT_LAT = 14.780043
const DEFAULT_LNG = 121.046351

export interface IAreaFormProps
    extends
        IClassProps,
        IForm<Partial<IAreaRequest>, IArea, Error, TAreaFormValues> {
    areaId?: TEntityId
}

const AreaCreateUpdateForm = ({ className, ...formProps }: IAreaFormProps) => {
    const form = useForm<TAreaFormValues>({
        resolver: standardSchemaResolver(AreaSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateArea({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Area Created',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const updateMutation = useUpdateAreaById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Area Updated',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TAreaFormValues>({
            form,
            autoSave: formProps.autoSave,
            readOnly: formProps.readOnly,
            hiddenFields: formProps.hiddenFields,
            disabledFields: formProps.disabledFields,
            defaultValues: formProps.defaultValues,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (formProps.areaId) {
            updateMutation.mutate({
                id: formProps.areaId,
                payload: formData,
            })
        } else {
            createMutation.mutate(formData)
        }
    }, handleFocusError)

    const {
        error: errorResponse,
        isPending,
        reset,
    } = formProps.areaId ? updateMutation : createMutation

    const error = serverRequestErrExtractor({ error: errorResponse })

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
                            label="Area Name"
                            name="name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Area Name"
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Area Photo"
                            name="media_id"
                            render={({ field }) => {
                                const value = form.watch('media')

                                return (
                                    <ImageField
                                        {...field}
                                        onChange={(newImage) => {
                                            if (newImage)
                                                field.onChange(newImage.id)
                                            else field.onChange(undefined)

                                            form.setValue('media', newImage)
                                        }}
                                        placeholder="Upload Area Photo"
                                        value={
                                            value
                                                ? (value as IMedia).download_url
                                                : value
                                        }
                                    />
                                )
                            }}
                        />
                        <MapPicker
                            className="w-full bg-popover"
                            disabled={isPending || formProps.readOnly}
                            onChange={(location) => {
                                if (location) {
                                    form.setValue('latitude', location.lat, {
                                        shouldDirty: true,
                                    })
                                    form.setValue('longitude', location.lng, {
                                        shouldDirty: true,
                                    })
                                } else {
                                    form.setValue('latitude', 0, {
                                        shouldDirty: true,
                                    })
                                    form.setValue('longitude', 0, {
                                        shouldDirty: true,
                                    })
                                }
                            }}
                            placeholder="Choose/Select exact area location"
                            title="Pinpoint Area Location"
                            value={{
                                lat: form.watch('latitude') ?? DEFAULT_LAT,
                                lng: form.watch('longitude') ?? DEFAULT_LNG,
                            }}
                            variant="outline"
                        />
                    </fieldset>
                </fieldset>

                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty || isPending}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText={formProps.areaId ? 'Update' : 'Create'}
                />
            </form>
        </Form>
    )
}

export const AreaCreateUpdateFormModal = ({
    title = 'Create Area',
    description = 'Fill out the form to add a new area.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IAreaFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <AreaCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default AreaCreateUpdateForm
