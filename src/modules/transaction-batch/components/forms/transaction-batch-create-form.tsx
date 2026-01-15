import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import START_TRANSACTION_BATCH_ARTWORK from '@/assets/artworks/artwork-start-transaction-batch.svg'
import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { IBatchFundingRequest } from '@/modules/batch-funding'
import { CurrencyCombobox, CurrencyInput } from '@/modules/currency'
import EmployeePicker from '@/modules/employee/components/employee-picker'
import { IMedia } from '@/modules/media'
import { motion } from 'motion/react'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import ImageDisplay from '@/components/image-display'
import Modal, { IModalProps } from '@/components/modals/modal'
import TextEditor from '@/components/text-editor'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import SignatureField from '@/components/ui/signature-field'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm } from '@/types'

import { useCreateTransactionBatch } from '../../transaction-batch.service'
import { ITransactionBatchMinimal } from '../../transaction-batch.types'
import { TransactionBatchCreateSchema } from '../../transaction-batch.validation'

type TTransactionBatchFormValues = z.infer<typeof TransactionBatchCreateSchema>

export interface ITransactionBatchCreateFormProps
    extends IClassProps,
        IForm<
            Partial<IBatchFundingRequest>,
            ITransactionBatchMinimal,
            Error,
            TTransactionBatchFormValues
        > {}

const TransactionBatchCreateForm = ({
    className,
    ...formProps
}: ITransactionBatchCreateFormProps) => {
    const form = useForm<TTransactionBatchFormValues>({
        resolver: standardSchemaResolver(TransactionBatchCreateSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            amount: 0,
            provided_by_user_id: '',
            ...formProps.defaultValues,
        },
    })

    const {
        mutate: createBatch,
        error: rawError,
        isPending,
        reset,
    } = useCreateTransactionBatch({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TTransactionBatchFormValues>({
            form,
            ...formProps,
            autoSave: false,
        })

    const onSubmit = form.handleSubmit(async (formData) => {
        createBatch(formData)
    }, handleFocusError)

    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                className={cn(
                    'flex w-full flex-col relative gap-y-4',
                    className
                )}
                onSubmit={onSubmit}
                ref={formRef}
            >
                {/* FRAGMENT SHAPES DESU */}
                <div className="size-[100px] rounded-xl absolute -top-8 -translate-y-[50%] right-1/2 -translate-x-1/2 border-2 border-accent dark:border-muted/80" />
                <div className="size-[40px] rounded-full absolute top-16 left-24 bg-accent/70 dark:bg-muted/40" />
                <div className="size-[40px] rounded-full absolute top-56 right-24 bg-accent/70 dark:bg-muted/40" />

                <motion.div
                    animate={{ scale: 1, opacity: 1 }}
                    className="size-[300px] rounded-full absolute -top-8 -translate-y-[50%] translate-x-[50%] -right-5 bg-accent dark:bg-muted/80"
                    initial={{ scale: 0.5, opacity: 0.5 }}
                    transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                        mass: 0.8,
                        duration: 0.8,
                    }}
                />
                <motion.div
                    animate={{ scale: 1, opacity: 1 }}
                    className="size-[320px] rounded-full absolute -top-8 -translate-y-[50%] translate-x-[50%] -right-5 border-2 border-accent dark:border-accent/80"
                    initial={{ scale: 0.5, opacity: 0.5 }}
                    transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                        mass: 0.8,
                        delay: 0.1,
                        duration: 0.8,
                    }}
                />
                <motion.div
                    animate={{ scale: 1, opacity: 1 }}
                    className="size-[200px] rounded-full absolute -top-8 translate-y-[50%] -translate-x-[50%] -left-5 bg-accent dark:bg-muted/50"
                    initial={{ scale: 0.5, opacity: 0.5 }}
                    transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                        mass: 0.8,
                        delay: 0.35,
                    }}
                />
                <motion.div
                    animate={{ scale: 1, opacity: 1 }}
                    className="size-[220px] rounded-full absolute -top-8 translate-y-[41%] -translate-x-[50%] -left-5 border-2 border-accent dark:border-accent/80"
                    initial={{ scale: 0.5, opacity: 0.5 }}
                    transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                        mass: 0.8,
                        delay: 0.35,
                        duration: 0.3,
                    }}
                />

                <div className="mx-auto py-6 space-y-4 relative">
                    <motion.div
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        className="mx-auto w-fit"
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        transition={{
                            type: 'spring',
                            stiffness: 200,
                            damping: 20,
                            delay: 0.5,
                        }}
                        whileHover={{ scale: 1.05 }}
                    >
                        <ImageDisplay
                            className="size-48 rounded-xl"
                            src={START_TRANSACTION_BATCH_ARTWORK}
                        />
                    </motion.div>
                    <motion.p
                        animate={{ opacity: 1, y: 0 }}
                        className="text-lg font-semibold text-center text-foreground"
                        initial={{ opacity: 0, y: 20 }}
                        transition={{
                            delay: 0.7,
                            duration: 0.5,
                        }}
                    >
                        🎉 Let's Get the Ball Rolling!
                    </motion.p>
                    <motion.p
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-center text-muted-foreground"
                        initial={{ opacity: 0, y: 20 }}
                        transition={{
                            delay: 0.85,
                            duration: 0.5,
                        }}
                    >
                        Start a new transaction batch and make financial magic
                        happen. Your organized workflow begins here! ✨
                    </motion.p>
                </div>

                <motion.fieldset
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-x-6 gap-y-4 sm:gap-y-3"
                    disabled={isPending || formProps.readOnly}
                    initial={{ opacity: 0, y: 30 }}
                    transition={{
                        duration: 0.6,
                        delay: 1,
                        ease: [0.25, 0.1, 0.25, 1],
                    }}
                >
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            label="Batch Name"
                            name="name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Batch Name"
                                />
                            )}
                        />

                        <div className="space-y-1">
                            <p>Starting Balance Info</p>
                            <div className="grid gap-x-4 space-y-4">
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Currency *"
                                    name="currency_id"
                                    render={({ field }) => (
                                        <CurrencyCombobox
                                            {...field}
                                            mode="blotter-available"
                                            onChange={(currency) => {
                                                field.onChange(currency?.id)
                                                form.setValue(
                                                    'currency',
                                                    currency
                                                )
                                            }}
                                            value={field.value}
                                        />
                                    )}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Amount *"
                                    name="amount"
                                    render={({
                                        field: { onChange, ...field },
                                    }) => (
                                        <CurrencyInput
                                            {...field}
                                            currency={form.watch('currency')}
                                            disabled={isDisabled(field.name)}
                                            onValueChange={(newValue = '') => {
                                                onChange(newValue)
                                            }}
                                            placeholder="Amount"
                                        />
                                    )}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Provided By *"
                                    name="provided_by_user_id"
                                    render={({ field }) => (
                                        <EmployeePicker
                                            {...field}
                                            disabled={isDisabled(field.name)}
                                            onSelect={(value) => {
                                                field.onChange(value?.user_id)
                                                form.setValue(
                                                    'provided_by_user',
                                                    value
                                                )
                                            }}
                                            placeholder="Select Employee"
                                            value={form.watch(
                                                'provided_by_user'
                                            )}
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <Accordion collapsible type="single">
                            <AccordionItem
                                className="border-b-0"
                                value="more-options"
                            >
                                <AccordionTrigger className="text-xs !p-2 !hover:underline-0 !rounded-xl !px-4">
                                    More Options
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-2">
                                    <FormFieldWrapper
                                        control={form.control}
                                        label="Provider Signature"
                                        name="signature_media_id"
                                        render={({ field }) => {
                                            const value =
                                                form.watch('signature_media')
                                            return (
                                                <SignatureField
                                                    {...field}
                                                    disabled={isDisabled(
                                                        field.name
                                                    )}
                                                    onChange={(newImage) => {
                                                        if (newImage)
                                                            field.onChange(
                                                                newImage.id
                                                            )
                                                        else
                                                            field.onChange(
                                                                undefined
                                                            )

                                                        form.setValue(
                                                            'signature_media',
                                                            newImage
                                                        )
                                                    }}
                                                    placeholder="Signature of the provider that gives the fund"
                                                    value={
                                                        value
                                                            ? (value as IMedia)
                                                                  .download_url
                                                            : value
                                                    }
                                                />
                                            )
                                        }}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        label="Description"
                                        name="description"
                                        render={({ field }) => (
                                            <TextEditor
                                                {...field}
                                                content={field.value}
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                placeholder="Description"
                                                textEditorClassName="!max-w-none bg-background"
                                            />
                                        )}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </fieldset>

                    <FormFooterResetSubmit
                        className="sticky bottom-0"
                        // disableSubmit={!form.formState.isDirty || isPending }
                        error={error}
                        isLoading={isPending}
                        onReset={() => {
                            form.reset()
                            reset()
                        }}
                        readOnly={formProps.readOnly}
                        submitText="Create"
                    />
                </motion.fieldset>
            </form>
        </Form>
    )
}

export const TransactionBatchCreateFormModal = ({
    title = 'Create Transaction Batch',
    description = 'Fill out the form to create a new transaction batch.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ITransactionBatchCreateFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('!max-w-xl p-0 bg-transparent', className)}
            description={description}
            descriptionClassName="hidden"
            title={title}
            titleClassName="hidden"
            {...props}
        >
            <TransactionBatchCreateForm
                {...formProps}
                className="p-4 max-w-full overflow-x-clip bg-gradient-to-t from-popover from-40% to-background dark:to-background/80 min-w-0"
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default TransactionBatchCreateForm
