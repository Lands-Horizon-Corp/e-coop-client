import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { useHotkeys } from 'react-hotkeys-hook'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { GradientBackground } from '@/components/gradient-background/gradient-background'
import { ExcludeIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import ColorPicker from '@/components/pickers/color-picker'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    useCreateFinancialStatementTitle,
    useUpdateFinancialStatementTitleById,
} from '../financial-statement-title.service'
import {
    IFinancialStatementTitle,
    IFinancialStatementTitleRequest,
} from '../financial-statement-title.types'
import { FinancialStatementTitleSchema } from '../financial-statement-title.validation'

type TFormValues = z.infer<typeof FinancialStatementTitleSchema>

export interface IFinancialStatementTitleFormProps
    extends
        IClassProps,
        IForm<
            Partial<IFinancialStatementTitleRequest>,
            IFinancialStatementTitle,
            Error,
            TFormValues
        > {
    financialStatementTitleId?: TEntityId
}

const FinancialStatementTitleCreateUpdateForm = ({
    className,
    ...formProps
}: IFinancialStatementTitleFormProps) => {
    const form = useForm<TFormValues>({
        resolver: standardSchemaResolver(FinancialStatementTitleSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            title: '',
            total_title: '',
            exclude_consolidate_total: false,
            index: 0,
            color: '#3b82f6',
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateFinancialStatementTitle({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Financial Statement Title Created',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const updateMutation = useUpdateFinancialStatementTitleById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Financial Statement Title Updated',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TFormValues>({
            form,
            autoSave: formProps.autoSave,
            readOnly: formProps.readOnly,
            hiddenFields: formProps.hiddenFields,
            disabledFields: formProps.disabledFields,
            defaultValues: formProps.defaultValues,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (formProps.financialStatementTitleId) {
            updateMutation.mutate({
                id: formProps.financialStatementTitleId,
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
    } = formProps.financialStatementTitleId ? updateMutation : createMutation

    const error = serverRequestErrExtractor({
        error: errorResponse,
    })

    useHotkeys(
        'ctrl + enter',
        (e) => {
            e.preventDefault()
            onSubmit()
        },
        {
            enableOnFormTags: true,
        },
        [onSubmit]
    )

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid gap-4"
                    disabled={isPending || formProps.readOnly}
                >
                    <FormFieldWrapper
                        control={form.control}
                        label="Title"
                        name="title"
                        render={({ field }) => (
                            <Input
                                {...field}
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                                placeholder="Section Title"
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Total Title"
                        name="total_title"
                        render={({ field }) => (
                            <Input
                                {...field}
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                                placeholder="Total Section Title"
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Select Color"
                        name="color"
                        render={({ field }) => (
                            <ColorPicker
                                alpha={true}
                                className="mt-0 w-full"
                                inputClassName="h-10 w-full"
                                onChange={field.onChange}
                                value={field.value ?? ''}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Index"
                        name="index"
                        render={({ field }) => (
                            <Input
                                {...field}
                                disabled={isDisabled(field.name)}
                                type="number"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="exclude_consolidate_total"
                        render={({ field }) => (
                            <GradientBackground gradientOnly>
                                <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-2 outline-none duration-200 ease-out has-checked:border-primary/30 has-checked:bg-primary/40">
                                    <div className="flex grow items-center gap-3">
                                        <div className="size-fit rounded-full bg-secondary p-2">
                                            <ExcludeIcon />
                                        </div>
                                        <div className="flex-2 grid gap-2">
                                            <Label htmlFor={field.name}>
                                                Exclude Consolidate Total
                                            </Label>
                                        </div>
                                        <Switch
                                            aria-describedby={`${field.name}-description`}
                                            checked={field.value}
                                            className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                                            id={field.name}
                                            onCheckedChange={(e) => {
                                                field.onChange(e)
                                            }}
                                        />
                                    </div>
                                </div>
                            </GradientBackground>
                        )}
                    />
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
                    submitText={
                        formProps.financialStatementTitleId
                            ? 'Update'
                            : 'Create'
                    }
                />
            </form>
        </Form>
    )
}

export const FinancialStatementTitleCreateUpdateFormModal = ({
    title = 'Create Financial Statement Title',
    description = 'Fill out the form to create a new financial statement section.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IFinancialStatementTitleFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <FinancialStatementTitleCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}
