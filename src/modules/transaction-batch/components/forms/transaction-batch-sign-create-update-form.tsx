import { useEffect, useRef, useState } from 'react'

import { Path, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { IMedia } from '@/modules/media'

import {
    CheckFillIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import SignatureField from '@/components/ui/signature-field'
import {
    Stepper,
    StepperDescription,
    StepperIndicator,
    StepperItem,
    StepperSeparator,
    StepperTitle,
    StepperTrigger,
} from '@/components/ui/stepper'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    ITransactionBatchSignatures,
    useGetTransactionBatchById,
    useTransBatchUpdateSignApproval,
} from '../..'
import { BatchSignSchema } from '../../transaction-batch.validation'
import TransactionBatchMiniViewCard from '../transaction-batch/transaction-batch-mini-card'

type TBatchSignFormValues = z.infer<typeof BatchSignSchema>

type Step = {
    title: string
    description?: string
    longDescription?: string
    fields: Path<TBatchSignFormValues>[]
}

const Steps: Step[] = [
    {
        title: 'Prepared By',
        description: 'Person who prepared the batch for review.',
        longDescription:
            'This person is responsible for compiling and organizing all transaction records for the day, ensuring that all entries are complete and accurate before submitting for further review.',
        fields: [
            'prepared_by_name',
            'prepared_by_position',
            'prepared_by_signature_media_id',
        ],
    },
    {
        title: 'Certified By',
        description: 'Person who certified the accuracy of the batch.',
        longDescription:
            'This person verifies that all transactions in the batch are correct and match supporting documents, certifying the batch as accurate.',
        fields: [
            'certified_by_name',
            'certified_by_position',
            'certified_by_signature_media_id',
        ],
    },
    {
        title: 'Checked By',
        description: 'Person who checked and verified the entries.',
        longDescription:
            'This person reviews the batch for any discrepancies or errors, ensuring that all entries are accurate and complete.',
        fields: [
            'check_by_name',
            'check_by_position',
            'check_by_signature_media_id',
        ],
    },
    {
        title: 'Approved By',
        description: 'Person who approved the batch for posting.',
        longDescription:
            'This person gives the final approval for the batch to be posted, confirming that all transactions are accurate and complete.',
        fields: [
            'approved_by_name',
            'approved_by_position',
            'approved_by_signature_media_id',
        ],
    },
    {
        title: 'Verified By',
        description: 'Person who verified the batch completion.',
        longDescription:
            'This person verifies that the batch has been completed in accordance with all relevant procedures and regulations.',
        fields: [
            'verified_by_name',
            'verified_by_position',
            'verified_by_signature_media_id',
        ],
    },
    {
        title: 'Acknowledge By',
        description: 'Person who acknowledged the batch closure.',
        longDescription:
            'This person acknowledges that the batch has been closed and all transactions have been processed.',
        fields: [
            'acknowledge_by_name',
            'acknowledge_by_position',
            'acknowledge_by_signature_media_id',
        ],
    },
    {
        title: 'Noted By',
        description: 'Person who noted the batch for records.',
        longDescription:
            'This person makes a note of the batch in the records, ensuring that there is a permanent record of all transactions.',
        fields: [
            'noted_by_name',
            'noted_by_position',
            'noted_by_signature_media_id',
        ],
    },
    {
        title: 'Posted By',
        description: 'Person who posted the batch to the system.',
        longDescription:
            'This person is responsible for posting the batch to the system, making all transactions official.',
        fields: [
            'posted_by_name',
            'posted_by_position',
            'posted_by_signature_media_id',
        ],
    },
    {
        title: 'Paid By',
        description: 'Person who processed the payment.',
        longDescription:
            'This person processes the payment for the batch, ensuring that all transactions are settled.',
        fields: [
            'paid_by_name',
            'paid_by_position',
            'paid_by_signature_media_id',
        ],
    },
]

export interface ITransactionBatchSignFormProps
    extends IClassProps,
        IForm<
            Partial<ITransactionBatchSignatures>,
            ITransactionBatchSignatures,
            Error,
            TBatchSignFormValues
        > {
    batchId: TEntityId
    defaultStep?: number
}

const TransactionBatchSignCreateUpdateForm = ({
    batchId,
    className,
    defaultStep = 0,
    ...formProps
}: ITransactionBatchSignFormProps) => {
    const [step, setStep] = useState(defaultStep)

    const form = useForm<TBatchSignFormValues>({
        resolver: standardSchemaResolver(BatchSignSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            ...formProps.defaultValues,
        },
    })

    const {
        error: rawError,
        isPending,
        mutate,
        reset,
    } = useTransBatchUpdateSignApproval({
        options: {
            onSuccess: (data) => {
                form.reset(data)
                formProps.onSuccess?.(data)
            },
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TBatchSignFormValues>({
            form,
            ...formProps,
            autoSave: true,
            autoSaveDelay: 2000,
            resetOnDefaultChange: formProps.resetOnDefaultChange,
        })

    const error = serverRequestErrExtractor({ error: rawError })

    const { data: transactionBatch, isPending: isLoadingBatchInfo } =
        useGetTransactionBatchById({
            id: batchId,
        })

    const stepRefs = useRef<(HTMLHeadingElement | null)[]>([])

    useEffect(() => {
        const node = stepRefs.current[step]
        if (node) {
            node.scrollIntoView({ behavior: 'smooth', block: 'center' })
            node.focus()
        }
    }, [step])

    const onNext = async () => {
        const triggerValidation = await form.trigger(Steps[step].fields, {
            shouldFocus: true,
        })

        if (triggerValidation) setStep((prev) => prev + 1)
    }

    const onSubmit = form.handleSubmit((payload) => {
        mutate({ id: batchId, payload })
    }, handleFocusError)

    const onReset = () => {
        form.reset()
        reset()
        setStep(defaultStep)
    }

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <div className="flex w-full gap-x-4">
                    <div className="ecoop-scroll max-h-[90vh] w-[30%] gap-x-4 gap-y-4 overflow-auto sm:max-h-[73vh] [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar]:hover:w-[6px]">
                        <Stepper
                            onValueChange={setStep}
                            orientation="vertical"
                            value={step}
                        >
                            {Steps.map(({ title, description }, i) => (
                                <StepperItem
                                    className="not-last:flex-1 relative items-start"
                                    key={i}
                                    step={i}
                                >
                                    <StepperTrigger
                                        className="items-start rounded pb-8 last:pb-0"
                                        disabled={
                                            formProps.readOnly || isPending
                                        }
                                        type="button"
                                    >
                                        <StepperIndicator asChild>
                                            <p>{i + 1}</p>
                                        </StepperIndicator>
                                        <div className="mt-0.5 space-y-1 px-2 text-left">
                                            <StepperTitle
                                                ref={(el) => {
                                                    stepRefs.current[i] = el
                                                }}
                                            >
                                                {title}{' '}
                                                {!!form.getValues(
                                                    Steps[i].fields[0]
                                                ) && (
                                                    <CheckFillIcon className="inline ml-1 text-primary" />
                                                )}
                                            </StepperTitle>
                                            <StepperDescription>
                                                {description}
                                            </StepperDescription>
                                        </div>
                                    </StepperTrigger>
                                    {i < Steps.length - 1 && (
                                        <StepperSeparator className="absolute inset-y-0 left-3 top-[calc(1.5rem+0.125rem)] -order-1 m-0 -translate-x-1/2 group-data-[orientation=vertical]/stepper:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none" />
                                    )}
                                </StepperItem>
                            ))}
                        </Stepper>
                    </div>
                    <fieldset
                        className="ecoop-scroll max-h-[90vh] flex-1 space-y-4 overflow-auto px-2 sm:max-h-[73vh] sm:space-y-3"
                        disabled={isPending || formProps.readOnly}
                    >
                        <div className="space-y-1">
                            <p>Batch Approval Signature</p>
                            {isLoadingBatchInfo && <LoadingSpinner />}
                            {transactionBatch && (
                                <TransactionBatchMiniViewCard
                                    transactionBatch={transactionBatch}
                                />
                            )}
                        </div>
                        <Separator />
                        <fieldset className="space-y-3" key={step}>
                            <legend className="font-semibold">
                                {Steps[step].title}
                            </legend>
                            <sub className="text-sm text-muted-foreground">
                                {Steps[step].longDescription}
                            </sub>
                            <Separator />
                            <FormFieldWrapper
                                control={form.control}
                                label="Name"
                                name={Steps[step].fields[0]}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        autoComplete="off"
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="Name"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Position"
                                name={Steps[step].fields[1]}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        autoComplete="off"
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="ex: Admin, Manager, Teller"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Signature"
                                name={Steps[step].fields[2]}
                                render={({ field }) => {
                                    const value = form.watch(
                                        Steps[step].fields[2].replace(
                                            '_id',
                                            ''
                                        ) as Path<TBatchSignFormValues>
                                    )
                                    return (
                                        <SignatureField
                                            {...field}
                                            disabled={isDisabled(field.name)}
                                            onChange={(newImage) => {
                                                if (newImage)
                                                    field.onChange(newImage.id)
                                                else field.onChange(undefined)

                                                form.setValue(
                                                    Steps[
                                                        step
                                                    ].fields[2].replace(
                                                        '_id',
                                                        ''
                                                    ) as Path<TBatchSignFormValues>,
                                                    newImage
                                                )
                                            }}
                                            placeholder="Signature"
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
                        </fieldset>
                    </fieldset>
                </div>
                <Separator />
                <div className="space-y-2">
                    <FormErrorMessage errorMessage={error} />
                    <div className="flex items-center justify-between gap-x-1">
                        <Button
                            className="w-full self-end px-8 sm:w-fit"
                            disabled={isPending || formProps.readOnly}
                            onClick={() => onReset()}
                            size="sm"
                            type="button"
                            variant="ghost"
                        >
                            Reset
                        </Button>
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={isPending || step === 0}
                                onClick={() => setStep((prev) => prev - 1)}
                                size="icon"
                                type="button"
                                variant="secondary"
                            >
                                <ChevronLeftIcon />
                            </Button>
                            <Button
                                disabled={
                                    isPending || step === Steps.length - 1
                                }
                                onClick={() => onNext()}
                                size="icon"
                                type="button"
                                variant="secondary"
                            >
                                <ChevronRightIcon />
                            </Button>
                        </div>
                        <Button
                            className="w-full self-end px-8 sm:w-fit"
                            disabled={
                                isPending ||
                                !form.formState.isDirty ||
                                formProps.readOnly
                            }
                            size="sm"
                            type="submit"
                        >
                            {isPending ? <LoadingSpinner /> : 'Save'}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export const TransactionBatchSignCreateUpdateFormModal = ({
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<ITransactionBatchSignFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('!max-w-5xl', className)}
            closeButtonClassName="hidden"
            descriptionClassName="hidden"
            titleClassName="pb-4 hidden"
            {...props}
        >
            <TransactionBatchSignCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    // props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default TransactionBatchSignCreateUpdateForm
