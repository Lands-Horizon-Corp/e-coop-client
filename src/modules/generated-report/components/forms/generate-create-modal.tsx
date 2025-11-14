import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    useCreateGeneratedReport,
    useUpdateGeneratedReportById,
} from '../../generated-report.service'
import {
    IGeneratedReport,
    IGeneratedReportRequest,
} from '../../generated-report.types'
import { GeneratedReportSchema } from '../../generated-report.validation'

type TBankFormValues = z.infer<typeof GeneratedReportSchema>

export interface IGeneratedReportFormProps
    extends IClassProps,
        IForm<
            Partial<IGeneratedReportRequest>,
            IGeneratedReport,
            Error,
            TBankFormValues
        > {
    reportId?: TEntityId
}

const GenerateReportCreateForm = ({
    className,
    reportId,
    ...formProps
}: IGeneratedReportFormProps) => {
    const form = useForm<TBankFormValues>({
        resolver: standardSchemaResolver(GeneratedReportSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateGeneratedReport({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Report Created',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })
    const updateMutation = useUpdateGeneratedReportById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Report updated',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled, firstError } =
        useFormHelper<TBankFormValues>({
            form,
            autoSave: formProps.autoSave,
            readOnly: formProps.readOnly,
            hiddenFields: formProps.hiddenFields,
            disabledFields: formProps.disabledFields,
            defaultValues: formProps.defaultValues,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (reportId) {
            updateMutation.mutate({ id: reportId, payload: formData })
        } else {
            createMutation.mutate(formData)
        }
    }, handleFocusError)

    const {
        error: errorResponse,
        isPending,
        reset,
    } = reportId ? updateMutation : createMutation

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
                        <FormErrorMessage errorMessage={firstError} />
                        <FormFieldWrapper
                            control={form.control}
                            label="Model Name"
                            name="name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Model Name"
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
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText={reportId ? 'Update Report' : 'Create Report'}
                />
            </form>
        </Form>
    )
}

export const GeneratedReportCreateFormModal = ({
    title = 'Generate Report',
    description = 'Fill out the form to generate report.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IGeneratedReportFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <GenerateReportCreateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default GeneratedReportCreateFormModal
