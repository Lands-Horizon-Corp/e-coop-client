import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toInputDateString } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { WarningFillIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import { usePostMutualFund } from '../../mutual-fund.service'
import { IMutualFund, IMutualFundPostRequest } from '../../mutual-fund.types'
import { MutualFundViewPostRequestSchema } from '../../mutual-fund.validation'

type TMutualFundPostFormValues = z.infer<typeof MutualFundViewPostRequestSchema>

export interface IMutualFundPostFormProps
    extends
        IClassProps,
        IForm<
            Partial<IMutualFundPostRequest>,
            IMutualFund,
            Error,
            TMutualFundPostFormValues
        > {
    mutualFundId: TEntityId
}

const MutualFundPostForm = ({
    className,
    mutualFundId,
    ...formProps
}: IMutualFundPostFormProps) => {
    const form = useForm<TMutualFundPostFormValues>({
        resolver: standardSchemaResolver(MutualFundViewPostRequestSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            post_account_id: undefined,
            entry_date: toInputDateString(new Date()),
            check_voucher_number: '',
            ...formProps.defaultValues,
        },
    })

    const postMutation = usePostMutualFund({
        options: {
            onSuccess: (data) => {
                formProps.onSuccess?.(data)
                form.reset()
                toast.success('Mutual fund posted successfully')
            },
            onError: (error) => {
                formProps.onError?.(error)
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage || 'Failed to post mutual fund')
            },
        },
    })

    const { formRef, handleFocusError } =
        useFormHelper<TMutualFundPostFormValues>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((data) => {
        const mutationPromise = postMutation.mutateAsync({
            mutualFundId,
            payload: data,
        })

        toast.promise(mutationPromise, {
            loading: 'Posting mutual fund...',
            success: 'Mutual fund posted successfully',
            error: 'Failed to post mutual fund',
        })
    }, handleFocusError)

    const { error: rawError, isPending, reset } = postMutation

    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                className={cn(
                    'min-w-0 max-w-full flex flex-col gap-y-4',
                    className
                )}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="min-w-0 max-w-full space-y-4"
                    disabled={isPending || formProps.readOnly}
                >
                    <FormFieldWrapper
                        control={form.control}
                        label="Post Account"
                        name="post_account_id"
                        render={({ field }) => (
                            <AccountPicker
                                allowClear
                                {...field}
                                mode="deposit"
                                nameOnly
                                onSelect={(account) => {
                                    field.onChange(account?.id || undefined)
                                    form.setValue('post_account', account)
                                }}
                                placeholder="Select post account"
                                triggerClassName="flex-1"
                                value={form.watch('post_account')}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="CV No"
                        name="check_voucher_number"
                        render={({ field }) => (
                            <Input
                                {...field}
                                autoComplete="off"
                                placeholder="Enter check voucher number (optional)"
                                type="text"
                                value={field.value ?? ''}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Date *"
                        name="entry_date"
                        render={({ field }) => (
                            <InputDate
                                {...field}
                                className="block"
                                placeholder="Select entry date"
                                value={field.value ?? ''}
                            />
                        )}
                    />
                </fieldset>

                <div className="flex items-start gap-2 px-3 py-2 rounded text-sm bg-warning/10 text-warning-foreground/70 border-warning/20 border">
                    <WarningFillIcon className="size-5 text-warning-foreground/70 shrink-0 mt-0.5" />
                    <span className="text-xs font-medium">
                        Posting the mutual fund records the transaction in the
                        general ledger and allocates the benefit amount to the
                        selected account. This action will mark the mutual fund
                        as posted and prevent further modifications.
                    </span>
                </div>

                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty || isPending}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText="POST"
                />
            </form>
        </Form>
    )
}

export const MutualFundPostFormModal = ({
    title = 'Post Mutual Fund',
    description = 'Fill out the form to post the mutual fund record.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<IMutualFundPostFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('!max-w-xl', className)}
            description={description}
            title={title}
            {...props}
        >
            <MutualFundPostForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MutualFundPostForm
