import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib'

import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import FormErrorMessage from '@/components/ui/form-error-message'
import Modal, { IModalProps } from '@/components/modals/modal'
import { toast } from 'sonner'

import { TCheckClearingSchema } from '@/validations/check-bank/check-clearing-schema'
import BankPicker from '@/components/pickers/bank-picker'
import InputDatePicker from '@/components/date-time-pickers/input-date-picker'
import { useCreateCheckClearing } from '@/hooks/api-hooks/transactions/use-check-clearing'
import FileUploader from '@/components/ui/file-uploader'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { useShortcut } from '@/components/use-shorcuts'

import { useMemberPickerStore } from '@/store/use-member-picker-state-store'
import {
    usePaymentsDataStore,
    usePaymentsModalStore,
} from '@/store/transaction/payments-entry-store'

import {
    IPaymentsEntry,
    TRANSACTION_TYPE,
    IPaymentsEntryRequest,
} from '@/types'
import { TPaymentFormValues } from './payments-entry-form'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { useCallback, useState } from 'react'
import { useSinglePictureUpload } from '@/hooks/api-hooks/use-media-resource'
import { IBankResponse } from '@/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
    base64ImagetoFile,
    capitalize,
    commaSeparators,
    formatNumberOnBlur,
    isValidDecimalInput,
    sanitizeNumberInput,
} from '@/helpers'
import { TrashIcon } from '@/components/icons'
import { Progress } from '@/components/ui/progress'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import useConfirmModalStore from '@/store/confirm-modal-store'
import FileTypeIcon from '@/components/ui/file-type'
import { useCreatePaymentEntry } from '@/hooks/api-hooks/transactions/use-payments-entry'
import { IForm } from '@/types'
import { IClassProps } from '@/types'

type TCheckClearingFormValues = z.infer<typeof TCheckClearingSchema>

type DepositCheckClearingListType = Omit<TCheckClearingFormValues, 'bankId'> & {
    bank?: IBankResponse
}

export interface IClearingFormProps
    extends IClassProps,
        IForm<TPaymentFormValues> {
    resetPaymentsForm?: () => void
    paymentFormsValue?: TPaymentFormValues
    ORNumber?: number
    amount?: number
    form: UseFormReturn<TCheckClearingFormValues>
}

const CheckClearingForm = ({
    resetPaymentsForm,
    paymentFormsValue,
    amount,
    ORNumber,
}: IClearingFormProps) => {
    const [selectedBank, setSelectedBank] = useState<IBankResponse>()
    const [newAmount, setNewAmount] = useState(amount)
    const [uploadMediaProgress, setUploadCheckMediaProgress] =
        useState<number>(0)
    const [depositCheckClearingList, setDepositCheckClearingList] = useState<
        DepositCheckClearingListType[]
    >([])

    const {
        selectedPayments,
        setSelectedPayments,
        selectedMember,
        selectedAccounts,
    } = usePaymentsDataStore()

    const {
        setOpenPaymentsEntryModal,
        transactionType,
        setOpenCheckClearingFormModal,
        setTransactionType,
    } = usePaymentsModalStore()

    const { isOpen } = useMemberPickerStore()

    const form = useForm<TCheckClearingFormValues>({
        resolver: zodResolver(TCheckClearingSchema),
        defaultValues: {
            checkNo: '',
            bankId: '',
            checkDate: new Date(),
            picture: '',
            amount: amount,
        },
    })

    const resetForms = useCallback(() => {
        resetPaymentsForm?.()
        form.reset()
        setOpenCheckClearingFormModal(false)
        setOpenPaymentsEntryModal(false)
        setTransactionType('payment')
    }, [
        form,
        resetPaymentsForm,
        setOpenCheckClearingFormModal,
        setOpenPaymentsEntryModal,
        setTransactionType,
    ])

    const {
        data: uploadedPhoto,
        isPending: isUploadingPhoto,
        mutateAsync: uploadPhoto,
    } = useSinglePictureUpload({
        onUploadProgressChange: (progress) =>
            setUploadCheckMediaProgress(progress),
    })

    const { mutateAsync, error, isPending } = useCreateCheckClearing({
        onSuccess: (data) => {
            toast.success(`${data.length} clearing check is successfully added`)
        },
    })

    const { mutate: createPayment, isPending: isPendingCreatePayments } =
        useCreatePaymentEntry({
            onSuccess: (data) => {
                toast.success(
                    `${data.length} ${transactionType} is successfully added`
                )
            },
            onError: (error) => {
                toast.error(error)
            },
        })

    const handleUploadPhoto = useCallback(
        async (picture: string) => {
            const photoFile = base64ImagetoFile(picture, 'logo.jpg') as File
            if (photoFile) {
                await uploadPhoto(photoFile)
                form.setValue('picture', '')
            }
        },
        [uploadPhoto, form]
    )

    const isNotPayment = transactionType !== TRANSACTION_TYPE.payment

    const handleSubmit = useCallback(
        async (data: TCheckClearingFormValues) => {
            try {
                if (
                    !paymentFormsValue ||
                    !paymentFormsValue.amount ||
                    !paymentFormsValue.transactionType ||
                    !selectedMember?.id ||
                    !selectedAccounts ||
                    !transactionType ||
                    !amount ||
                    !newAmount ||
                    !data.amount ||
                    !ORNumber
                ) {
                    toast.warning('Incomplete payment data. Skipping submit.')
                    return
                }

                //deposit and withdraw
                if (isNotPayment) {
                    if (data.amount > newAmount) {
                        toast.error(
                            'Invalid Input: The input amount must be less than the deposited amount!'
                        )
                        return
                    }

                    const updatedDepositList = [
                        {
                            ...data,
                            checkDate: new Date(data.checkDate),
                            bank: selectedBank,
                            picture: uploadedPhoto?.id ?? '',
                        },
                        ...depositCheckClearingList,
                    ]

                    const sanitizedAmount: number = parseFloat(
                        Math.max(0, newAmount - data.amount)
                            .toFixed(2)
                            .toString()
                    )

                    form.setValue('amount', sanitizedAmount)
                    setDepositCheckClearingList(updatedDepositList)
                    setNewAmount(sanitizedAmount)

                    await handleUploadPhoto(data.picture ?? '')

                    if (sanitizedAmount === 0) {
                        await mutateAsync(
                            updatedDepositList.map((item) => ({
                                ...item,
                                bankId: item.bank?.id ?? '',
                                checkDate: item.checkDate.toISOString(),
                            }))
                        )

                        const paymentPayload: IPaymentsEntryRequest[] = [
                            {
                                ...paymentFormsValue,
                                ORNumber,
                                memberId: selectedMember.id,
                                type: transactionType as TRANSACTION_TYPE,
                                isPrinted: paymentFormsValue.isPrinted ?? false,
                            },
                        ]

                        createPayment(paymentPayload)
                        resetForms()
                    }
                } else {
                    const newEntry: IPaymentsEntry = {
                        ...paymentFormsValue,
                        ORNumber,
                        memberId: selectedMember.id,
                        account: selectedAccounts,
                        isPrinted: paymentFormsValue.isPrinted ?? false,
                        type: transactionType as TRANSACTION_TYPE,
                        checkClearing: [
                            {
                                ...data,
                                checkDate: data.checkDate.toISOString(),
                            },
                        ],
                    }
                    setSelectedPayments([newEntry, ...selectedPayments])
                    toast.success('Added payments entry')
                    resetForms()
                }
            } catch (err) {
                console.error('Error submitting check clearing:', err)
            }
        },
        [
            form,
            selectedAccounts,
            selectedMember?.id,
            transactionType,
            depositCheckClearingList,
            setDepositCheckClearingList,
            selectedBank,
            amount,
            setNewAmount,
            newAmount,
            paymentFormsValue,
            uploadedPhoto,
            resetForms,
            mutateAsync,
            createPayment,
            setSelectedPayments,
            isNotPayment,
            ORNumber,
            handleUploadPhoto,
            selectedPayments,
        ]
    )

    const handleDeleteCheckItem = (
        amount: number,
        itemToDelete: number,
        oldValue: number
    ) => {
        setDepositCheckClearingList((prev) =>
            prev.filter((_, index) => index !== itemToDelete)
        )
        if ((form.watch('amount') ?? 0) > amount) return

        const newAmountValue = oldValue + amount
        form.setValue('amount', newAmountValue)
        setNewAmount(newAmountValue)
    }

    const totalAmount = depositCheckClearingList.reduce(
        (acc, entry) => acc + (entry.amount ?? 0),
        0
    )

    const handleClearAll = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault()
        setDepositCheckClearingList([])
        setNewAmount(amount ?? 0)
        form.setValue(
            'amount',
            amount !== undefined ? parseFloat(amount.toFixed(2)) : undefined
        )
    }

    useShortcut('Enter', async (event) => {
        event.preventDefault()
        const activeElement = document.activeElement as HTMLElement
        if (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA'
        )
            return
        const isValid = await form.trigger()
        if (isValid && !isOpen) {
            await handleSubmit(form.getValues() as TCheckClearingFormValues)
            resetPaymentsForm?.()
        }
    })

    const hasDepositClearingList = depositCheckClearingList.length <= 0

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="w-full space-y-4"
            >
                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                    {isNotPayment && (
                        <FormFieldWrapper
                            className=""
                            control={form.control}
                            name="amount"
                            label="Payment Amount"
                            render={({ field }) => (
                                <div className="relative w-full">
                                    <Input
                                        {...field}
                                        id={field.name}
                                        className={cn(
                                            'rounded-2xl !bg-background/70 pl-8 pr-10 text-lg font-bold text-primary placeholder:text-sm placeholder:font-normal placeholder:text-foreground/40'
                                        )}
                                        type="text"
                                        inputMode="decimal"
                                        placeholder="Enter the payment amount"
                                        autoComplete="off"
                                        value={
                                            field.value !== undefined &&
                                            field.value !== null
                                                ? commaSeparators(
                                                      field.value.toString()
                                                  )
                                                : ''
                                        }
                                        onChange={(e) => {
                                            const rawValue =
                                                sanitizeNumberInput(
                                                    e.target.value
                                                )
                                            if (isValidDecimalInput(rawValue)) {
                                                field.onChange(rawValue)
                                            }
                                        }}
                                        onBlur={(e) =>
                                            formatNumberOnBlur(
                                                e.target.value,
                                                field.onChange
                                            )
                                        }
                                    />
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-primary after:content-['₱']" />
                                </div>
                            )}
                        />
                    )}
                    <FormFieldWrapper
                        className=""
                        control={form.control}
                        name="checkNo"
                        label="Check Number"
                        render={({ field }) => (
                            <Input
                                {...field}
                                onChange={(e) => {
                                    field.onChange(e.target.value.toUpperCase())
                                }}
                                className="!bg-background/70"
                                id={field.name}
                                placeholder="Enter the check number"
                                autoComplete="off"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="bankId"
                        label="Select Bank"
                        render={({ field }) => (
                            <BankPicker
                                ButtonClassName="!bg-background/70"
                                value={field.value}
                                onSelect={(bank) => {
                                    setSelectedBank(bank)
                                    field.onChange(bank.id)
                                }}
                                placeholder="Choose a bank"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="checkDate"
                        label="Check Issue Date"
                        render={({ field }) => (
                            <InputDatePicker
                                value={field.value}
                                onChange={field.onChange}
                                captionLayout="dropdown-buttons"
                                className="bg-background/70"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        className="md:col-span-4"
                        control={form.control}
                        name="picture"
                        label="Upload Check Image"
                        render={({ field }) => (
                            <FileUploader
                                defaultPhotos={field.value}
                                className="max-h-42 min-h-10 w-full"
                                maxFiles={1}
                                accept={{
                                    'image/png': ['.png'],
                                    'image/jpeg': ['.jpg', '.jpeg'],
                                }}
                                selectedPhotos={(selectedPhoto) => {
                                    field.onChange(selectedPhoto)
                                }}
                            />
                        )}
                    />
                    {isUploadingPhoto && (
                        <div className="md:col-span-4">
                            <Progress
                                value={uploadMediaProgress}
                                className="h-1"
                            />
                            <div className="flex items-center justify-center gap-x-1 text-center text-xs text-foreground/60">
                                <LoadingSpinner className="size-2" />
                                {isUploadingPhoto && 'uploading picture...'}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex w-full justify-end">
                    {isNotPayment && hasDepositClearingList && (
                        <Button
                            disabled={hasDepositClearingList}
                            onClick={handleClearAll}
                            variant={'ghost'}
                            className={cn('hover:bg-background/20')}
                        >
                            clear all
                        </Button>
                    )}
                </div>
                {isNotPayment && (
                    <ScrollArea className="max-h-[30vh] overflow-auto rounded-md border md:col-span-4">
                        {!hasDepositClearingList && (
                            <div className="flex w-full justify-end"></div>
                        )}
                        <Table className="overflow">
                            <TableCaption>
                                A list of submitted check deposits.
                            </TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Check No.</TableHead>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Bank</TableHead>
                                    <TableHead>Deposit Date</TableHead>
                                    <TableHead></TableHead>
                                    <TableHead className="text-right">
                                        Amount
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {depositCheckClearingList.map((item, idx) => {
                                    const photoFile = base64ImagetoFile(
                                        item.picture ?? '',
                                        'logo.jpg'
                                    ) as File

                                    return (
                                        <TableRow key={item.checkNo}>
                                            <TableCell className="font-medium">
                                                {item.checkNo}
                                            </TableCell>
                                            <TableCell>
                                                {photoFile && (
                                                    <>
                                                        {isUploadingPhoto ? (
                                                            <LoadingSpinner />
                                                        ) : (
                                                            <FileTypeIcon
                                                                file={photoFile}
                                                            />
                                                        )}
                                                    </>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {item.bank?.name}
                                            </TableCell>
                                            <TableCell>
                                                {item.checkDate.toLocaleDateString(
                                                    undefined,
                                                    {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    }
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <TrashIcon
                                                    onClick={() => {
                                                        handleDeleteCheckItem(
                                                            item.amount ?? 0,
                                                            idx,
                                                            form.getValues(
                                                                'amount'
                                                            ) ?? 0
                                                        )
                                                    }}
                                                    size={18}
                                                    className="text-red-500"
                                                />
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-green-600 dark:text-green-400">
                                                ₱{' '}
                                                {commaSeparators(
                                                    (item.amount ?? 0).toFixed(
                                                        2
                                                    )
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="font-bold"
                                    >
                                        Total
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-green-600 dark:text-green-400">
                                        ₱{' '}
                                        {commaSeparators(
                                            totalAmount.toFixed(2)
                                        )}
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </ScrollArea>
                )}
                {error && <FormErrorMessage errorMessage={error} />}
                <div>
                    <Separator className="my-2 sm:my-4" />
                    <div className="flex items-center justify-end gap-x-2">
                        <Button
                            type="button"
                            variant="ghost"
                            disabled={
                                isPending ||
                                isUploadingPhoto ||
                                isPendingCreatePayments
                            }
                            onClick={() => {
                                form.reset()
                                setDepositCheckClearingList([])
                                form.setValue('amount', amount)
                                setNewAmount(amount ?? 0)
                                setOpenCheckClearingFormModal(false)
                            }}
                            className="w-full sm:w-fit"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                isPending ||
                                isUploadingPhoto ||
                                isPendingCreatePayments
                            }
                            className="w-full sm:w-fit"
                        >
                            {isPending ||
                            isUploadingPhoto ||
                            isPendingCreatePayments
                                ? 'Processing...'
                                : 'Save'}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export const TransactionCheckClearingFormModal = ({
    title = 'Check Clearing',
    description = 'Fill out the form to save Check.',
    className,
    formProps,
    onOpenChange,
    ...props
}: IModalProps & {
    formProps?: Omit<IClearingFormProps, 'className' | 'form'>
}) => {
    const { onOpen } = useConfirmModalStore()
    const { transactionType } = usePaymentsModalStore()

    const form = useForm<TCheckClearingFormValues>({
        resolver: zodResolver(TCheckClearingSchema),
        defaultValues: {
            checkNo: '',
            bankId: '',
            checkDate: new Date(),
            picture: '',
            amount: formProps?.amount,
        },
    })

    const resetForm = () => {
        form.reset({
            checkNo: '',
            bankId: '',
            checkDate: new Date(),
            picture: '',
            amount: formProps?.amount,
        })
    }

    const onPaymentsEntryModalClose = (isOpen: boolean) => {
        const { isDirty } = form.formState

        if (!isOpen) {
            if (!isDirty) {
                onOpenChange?.(false)
            } else {
                onOpen({
                    title: `Discard ${capitalize(transactionType ?? '')}`,
                    description:
                        'Are you sure you want to discard this transaction?',
                    onConfirm: () => {
                        resetForm()
                        onOpenChange?.(false)
                    },
                    confirmString: 'Discard',
                })
            }
        }
    }

    return (
        <Modal
            title={title}
            description={description}
            onOpenChange={onPaymentsEntryModalClose}
            className={cn('max-w-[64rem] p-10', className)}
            {...props}
        >
            <CheckClearingForm
                amount={formProps?.amount}
                form={form}
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default TransactionCheckClearingFormModal
