import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toInputDateString } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { BadgeExclamationFillIcon, WarningFillIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import { usePostGeneratedSavingsInterest } from '../../generated-savings-interest.service'
import { IGeneratedSavingsInterest } from '../../generated-savings-interest.types'
import { GenerateSavingsInterestPostSchema } from '../../generated-savings-interest.validation'

type TGenerateSavingsInterestPostFormValues = z.infer<
    typeof GenerateSavingsInterestPostSchema
>

export interface IGenerateSavingsInterestPostFormProps
    extends IClassProps,
        IForm<
            Partial<TGenerateSavingsInterestPostFormValues>,
            IGeneratedSavingsInterest,
            Error,
            TGenerateSavingsInterestPostFormValues
        > {
    generatedSavingsInterestId: TEntityId
}

const GenerateSavingsInterestPostForm = ({
    className,
    generatedSavingsInterestId,
    ...formProps
}: IGenerateSavingsInterestPostFormProps) => {
    const form = useForm<TGenerateSavingsInterestPostFormValues>({
        resolver: standardSchemaResolver(GenerateSavingsInterestPostSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            check_voucher_number: '',
            entry_date: toInputDateString(new Date()),
            ...formProps.defaultValues,
        },
    })

    const postMutation = usePostGeneratedSavingsInterest({
        options: {
            onSuccess: (data) => {
                formProps.onSuccess?.(data)
                form.reset()
                toast.success('Savings interest posted successfully')
            },
            onError: (error) => {
                formProps.onError?.(error)
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage || 'Failed to post savings interest')
            },
        },
    })

    const { formRef, handleFocusError } =
        useFormHelper<TGenerateSavingsInterestPostFormValues>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((data) => {
        const mutationPromise = postMutation.mutateAsync({
            generatedSavingsId: generatedSavingsInterestId,
            payload: data,
        })

        toast.promise(mutationPromise, {
            loading: 'Posting savings interest...',
            success: 'Savings interest posted successfully',
            error: 'Failed to post savings interest',
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
                        label="Account"
                        name="post_account_id"
                        render={({ field }) => (
                            <AccountPicker
                                {...field}
                                mode="deposit"
                                onSelect={(account) => {
                                    field.onChange(account?.id || undefined)
                                    form.setValue('post_account', account, {
                                        shouldDirty: true,
                                    })
                                }}
                                placeholder="Select post account"
                                value={form.getValues('post_account')}
                            />
                        )}
                    />

                    <div className="flex items-start gap-2 px-3 py-2 rounded text-sm bg-muted/10 text-muted-foreground/70 border-border border">
                        <BadgeExclamationFillIcon className="size-4 text-blue-400/70 shrink-0 mt-0.5" />
                        <span className="text-xs font-medium">
                            This post account will be credited or debited based
                            on the corresponding ledger entry. When savings
                            interest is generated, the funds are deducted from
                            this account and credited to the generated savings
                            interest account. (OPTIONAL)
                        </span>
                    </div>

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
                        Represents the cost incurred by the cooperative for
                        providing interest on member&apos;s savings or share
                        capital. Posting interest increases this expense and
                        reduces Cash on Hand, as funds are distributed or
                        allocated to members.
                    </span>
                </div>

                <FormFooterResetSubmit
                    // disableSubmit={!form.formState.isDirty || isPending }
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

export const GenerateSavingsInterestPostFormModal = ({
    title = 'Post Savings Interest',
    description = 'Fill out the form to post the generated savings interest.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<IGenerateSavingsInterestPostFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('!max-w-xl', className)}
            description={description}
            title={title}
            {...props}
        >
            <GenerateSavingsInterestPostForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default GenerateSavingsInterestPostForm
