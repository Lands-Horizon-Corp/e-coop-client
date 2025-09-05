import { useCallback, useRef, useState } from 'react'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { AccountPicker } from '@/modules/account'
import {
    IMemberProfile,
    useGetMemberProfileById,
} from '@/modules/member-profile'
import MemberPicker from '@/modules/member-profile/components/member-picker'
import MemberProfileInfoViewCard from '@/modules/member-profile/components/member-profile-info-loan-view-card'
import { IQRMemberProfileDecodedResult } from '@/modules/qr-crypto'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import {
    BuildingBranchIcon,
    CheckIcon,
    DotsHorizontalIcon,
    HandDepositIcon,
    PinLocationIcon,
    ScanLineIcon,
    UserIcon,
} from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import QrCodeScanner from '@/components/qrcode-scanner'
import { Button } from '@/components/ui/button'
import { Form, FormItem } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useModalState } from '@/hooks/use-modal-state'
import { useQeueryHookCallback } from '@/hooks/use-query-hook-cb'
import { useShortcut } from '@/hooks/use-shorcuts'
import { useSimpleShortcut } from '@/hooks/use-simple-shortcut'

import { IClassProps, IForm, TEntityId } from '@/types'

import { useCreateLoanTransaction, useUpdateLoanTransactionById } from '../..'
import {
    ILoanTransaction,
    ILoanTransactionRequest,
} from '../../loan-transaction.types'
import {
    LoanTransactionSchema,
    TLoanTransactionSchema,
} from '../../loan-transaction.validation'
import { LOAN_MODE_OF_PAYMENT } from '../../loan.constants'
import WeekdayCombobox from '../weekday-combobox'

type TLoanTransactionFormMode = 'create' | 'update'

export interface ILoanTransactionFormProps
    extends IClassProps,
        IForm<Partial<ILoanTransactionRequest>, ILoanTransaction, Error> {
    loanTransactionId?: TEntityId
    mode: TLoanTransactionFormMode
}

const LoanMemberProfileScanner = ({
    startScan,
    setStartScan,
    onSelect,
}: {
    startScan: boolean
    setStartScan: (state: boolean) => void
    onSelect: (value: IMemberProfile | undefined) => void
}) => {
    const [memberProfileId, setMemberProfileId] = useState<
        undefined | TEntityId
    >()
    const [previousScanned, setPreviousScanned] = useState<
        undefined | TEntityId
    >()

    const {
        data,
        isError,
        error: rawError,
        isSuccess,
    } = useGetMemberProfileById({
        id: memberProfileId as TEntityId,
        options: {
            enabled: !!memberProfileId,
            retry: 0,
        },
    })

    const handleSuccess = useCallback(
        (data: IMemberProfile) => {
            if (data && previousScanned !== data.id) {
                onSelect(data)
                setPreviousScanned(data.id)
            }
        },
        [onSelect, previousScanned]
    )

    useQeueryHookCallback({
        data,
        onSuccess: handleSuccess,
        onError: () =>
            toast.error('QR Code is valid, but member profile not found.'),
        error: rawError,
        isError,
        isSuccess,
    })

    useShortcut('s', () => setStartScan(true))

    return (
        <div className="flex flex-col flex-shrink-0 w-fit justify-center items-center">
            <div className=" size-56">
                {startScan ? (
                    <div className="aspect-square size-full rounded-xl overflow-hidden ">
                        <QrCodeScanner<IQRMemberProfileDecodedResult>
                            onSuccessDecode={(data) => {
                                if (data.type !== 'member-qr') {
                                    return toast.error(
                                        'Invalid QR. Please use a valid Member Profile QR'
                                    )
                                }
                                setMemberProfileId(data.data.member_profile_id)
                            }}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col size-full bg-muted rounded-xl items-center justify-center text-center py-8">
                        <ScanLineIcon className="mx-auto h-16 w-16 text-muted-foreground/70" />
                        <p className="text-xs text-muted-foreground/70 text-center">
                            Press "S" to start scan
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

const LoanTransactionCreateUpdateForm = ({
    className,
    mode = 'create',
    ...formProps
}: ILoanTransactionFormProps) => {
    const [startScan, setStartScan] = useState(false)
    const [formMode, setFormMode] = useState<TLoanTransactionFormMode>(mode)
    const memberPickerModal = useModalState()

    const [_createdLoanTransactionId, setCreatedLoanTransactionId] =
        useState<TEntityId | null>(null)
    const hasAutoCreatedRef = useRef(false) // Prevent multiple auto-creates

    const form = useForm<TLoanTransactionSchema>({
        resolver: standardSchemaResolver(LoanTransactionSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateLoanTransaction({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Loan Transaction Created',
                onSuccess: (loanTransaction) => {
                    setFormMode('update')
                    setCreatedLoanTransactionId(loanTransaction.id)
                    hasAutoCreatedRef.current = true
                    // Don't reset form, keep current values
                },
            }),
        },
    })

    const updateMutation = useUpdateLoanTransactionById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Loan Transaction Updated',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TLoanTransactionSchema>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((_payload) => {
        // const targetId = loanStatusId || createdLoanTransactionId
        // if (formMode === 'update' && targetId) {
        //     updateMutation.mutate({ id: targetId, payload })
        // } else if (formMode === 'create' && !hasAutoCreatedRef.current) {
        //     // Manual create if auto-create hasn't happened
        //     createMutation.mutate(payload)
        // }
    }, handleFocusError)

    useSimpleShortcut(['S'], () => {
        memberPickerModal.onOpenChange(!memberPickerModal.open)
    })

    const {
        error: rawError,
        isPending,
        reset,
    } = formMode === 'update' ? updateMutation : createMutation

    const error = serverRequestErrExtractor({ error: rawError })

    const mode_of_payment = form.watch('mode_of_payment')
    const memberProfile = form.watch('member_profile')

    return (
        <Form {...form}>
            <form
                ref={formRef}
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || formProps.readOnly}
                    className="grid gap-x-6 p-4 gap-y-4 sm:gap-y-3"
                >
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            name="member_profile_id"
                            render={({ field }) => {
                                return (
                                    <div className="gap-x-2 flex items-center">
                                        <LoanMemberProfileScanner
                                            key={field.value}
                                            startScan={startScan}
                                            setStartScan={setStartScan}
                                            onSelect={(memberProfile) => {
                                                field.onChange(
                                                    memberProfile?.id
                                                )
                                                form.setValue(
                                                    'member_profile',
                                                    memberProfile,
                                                    {
                                                        shouldDirty: true,
                                                    }
                                                )
                                            }}
                                        />
                                        <div className="space-y-2 flex-1 bg-gradient-to-br min-h-56 flex flex-col items-center justify-center from-primary/10 to-background bg-popover rounded-xl p-4">
                                            {memberProfile ? (
                                                <>
                                                    <MemberProfileInfoViewCard
                                                        className="w-full"
                                                        memberProfile={
                                                            memberProfile
                                                        }
                                                    />
                                                    <Button
                                                        size="sm"
                                                        onClick={() => {
                                                            field.onChange(
                                                                undefined
                                                            )
                                                            form.setValue(
                                                                'member_profile',
                                                                undefined
                                                            )
                                                        }}
                                                        variant="secondary"
                                                        className="w-full"
                                                    >
                                                        Replace
                                                    </Button>
                                                </>
                                            ) : (
                                                <div className="p-4 flex-col items-center justify-center">
                                                    <UserIcon className="size-12 mx-auto text-muted-foreground" />
                                                    <p className="text-center text-muted-foreground">
                                                        Please Select Member
                                                    </p>
                                                    <p className="text-center text-muted-foreground/80 text-xs">
                                                        select member or press
                                                        'Enter' to show picker |
                                                        or press 'S' to scan QR
                                                        Code
                                                    </p>
                                                </div>
                                            )}
                                            <MemberPicker
                                                modalState={{
                                                    ...memberPickerModal,
                                                }}
                                                value={memberProfile}
                                                placeholder="Select Member"
                                                triggerClassName="hidden"
                                                onSelect={(memberProfile) => {
                                                    field.onChange(
                                                        memberProfile?.id
                                                    )
                                                    form.setValue(
                                                        'member_profile',
                                                        memberProfile,
                                                        {
                                                            shouldDirty: true,
                                                        }
                                                    )
                                                }}
                                            />
                                        </div>
                                    </div>
                                )
                            }}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="account_id"
                            label="Account"
                            render={({ field }) => (
                                <AccountPicker
                                    mode="loan"
                                    value={form.getValues('account')}
                                    placeholder="Select Account"
                                    onSelect={(account) => {
                                        field.onChange(account?.id)

                                        form.setValue('account', account)
                                    }}
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <div className="flex gap-x-4">
                            <FormFieldWrapper
                                control={form.control}
                                name="mode_of_payment"
                                label="Mode of Payment"
                                className="shrink-0 w-fit"
                                render={({ field }) => (
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value ?? ''}
                                        className="flex gap-x-2"
                                    >
                                        {LOAN_MODE_OF_PAYMENT.map((mop) => (
                                            <FormItem
                                                key={mop}
                                                className="flex items-center gap-4"
                                            >
                                                <label
                                                    key={`mop-${mop}`}
                                                    className="border-accent hover:bg-accent ease-in-out duration-100 bg-muted has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-primary/40 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer items-center gap-1 rounded-md border py-2.5 px-6 text-center shadow-xs outline-none has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50"
                                                >
                                                    <RadioGroupItem
                                                        value={mop}
                                                        id={`mop-${mop}`}
                                                        className="sr-only after:absolute after:inset-0"
                                                    />
                                                    <p className="text-foreground capitalize text-xs leading-none font-medium">
                                                        {mop}
                                                    </p>
                                                    {field.value === mop && (
                                                        <CheckIcon className="inline" />
                                                    )}
                                                </label>
                                            </FormItem>
                                        ))}
                                    </RadioGroup>
                                )}
                            />
                            {mode_of_payment === 'weekly' && (
                                <>
                                    <Separator
                                        role="none"
                                        orientation="vertical"
                                        className="!min-h-12 my-3"
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name="mode_of_payment_weekly"
                                        label="Weekdays"
                                        className="space-y-1 col-span-1"
                                        render={({ field }) => (
                                            <WeekdayCombobox {...field} />
                                        )}
                                    />
                                </>
                            )}
                            {mode_of_payment === 'semi-monthly' && (
                                <>
                                    <Separator
                                        role="none"
                                        orientation="vertical"
                                        className="!min-h-12 my-3"
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name="mode_of_payment_semi_monthly_pay_1"
                                        label="Pay 1"
                                        className="col-span-1"
                                        render={({ field }) => (
                                            <Input {...field} />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name="mode_of_payment_semi_monthly_pay_2"
                                        label="Pay 2"
                                        className="col-span-1"
                                        render={({ field }) => (
                                            <Input {...field} />
                                        )}
                                    />
                                </>
                            )}
                        </div>

                        <div className="flex gap-x-4 items-center">
                            <FormFieldWrapper
                                control={form.control}
                                name="collector_place"
                                label="Collector"
                                className="shrink-0 w-fit"
                                render={({ field }) => (
                                    <RadioGroup
                                        value={field.value ?? ''}
                                        onValueChange={field.onChange}
                                        className="flex gap-x-2"
                                    >
                                        <FormItem className="flex items-center gap-4">
                                            <div className="border-input has-data-[state=checked]:bg-gradient-to-t hover:bg-accent ease-in-out duration-100 from-primary/30 has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border px-6 py-3 text-center shadow-xs outline-none has-focus-visible:ring-[3px]">
                                                <RadioGroupItem
                                                    value="field"
                                                    id="collector-field"
                                                    className="sr-only"
                                                />
                                                <PinLocationIcon
                                                    size={20}
                                                    aria-hidden="true"
                                                    className="opacity-60"
                                                />
                                                <label
                                                    htmlFor="collector-field"
                                                    className="text-foreground cursor-pointer text-xs leading-none font-medium after:absolute after:inset-0"
                                                >
                                                    Field
                                                </label>
                                            </div>
                                        </FormItem>

                                        <FormItem className="flex items-center gap-4">
                                            <div className="border-input hover:bg-accent has-data-[state=checked]:bg-gradient-to-t from-primary/30 ease-in-out duration-100 to-accent/80 has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border px-6 py-3 text-center shadow-xs outline-none has-focus-visible:ring-[3px]">
                                                <RadioGroupItem
                                                    value="office"
                                                    id="collector-office"
                                                    className="sr-only"
                                                />
                                                <BuildingBranchIcon
                                                    size={20}
                                                    aria-hidden="true"
                                                    className="opacity-60"
                                                />
                                                <label
                                                    htmlFor="collector-office"
                                                    className="text-foreground cursor-pointer text-xs leading-none font-medium after:absolute after:inset-0"
                                                >
                                                    Office
                                                </label>
                                            </div>
                                        </FormItem>
                                    </RadioGroup>
                                )}
                            />
                            <Separator
                                orientation="vertical"
                                className="!min-h-20"
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="comaker_type"
                                label="Comaker"
                                className="shrink-0 w-fit"
                                render={({ field }) => (
                                    <RadioGroup
                                        value={field.value ?? ''}
                                        onValueChange={field.onChange}
                                        className="flex gap-x-2"
                                    >
                                        <FormItem className="flex items-center gap-4">
                                            <div className="border-input hover:bg-accent has-data-[state=checked]:bg-gradient-to-t ease-in-out duration-100 from-primary/30 has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border px-6 py-3 text-center shadow-xs outline-none has-focus-visible:ring-[3px]">
                                                <RadioGroupItem
                                                    value="member"
                                                    id="comaker-member"
                                                    className="sr-only"
                                                />
                                                <UserIcon
                                                    size={20}
                                                    aria-hidden="true"
                                                    className="opacity-60"
                                                />
                                                <label
                                                    htmlFor="comaker-member"
                                                    className="text-foreground cursor-pointer text-xs leading-none font-medium after:absolute after:inset-0"
                                                >
                                                    Member
                                                </label>
                                            </div>
                                        </FormItem>
                                        <FormItem className="flex items-center gap-4">
                                            <div className="border-input hover:bg-accent has-data-[state=checked]:bg-gradient-to-t ease-in-out duration-100 from-primary/30 has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border px-6 py-3 text-center shadow-xs outline-none has-focus-visible:ring-[3px]">
                                                <RadioGroupItem
                                                    value="deposit"
                                                    id="comaker-deposit"
                                                    className="sr-only"
                                                />
                                                <HandDepositIcon
                                                    size={20}
                                                    aria-hidden="true"
                                                    className="opacity-60"
                                                />
                                                <label
                                                    htmlFor="comaker-deposit"
                                                    className="text-foreground cursor-pointer text-xs leading-none font-medium after:absolute after:inset-0"
                                                >
                                                    Deposit
                                                </label>
                                            </div>
                                        </FormItem>
                                        <FormItem className="flex items-center gap-4">
                                            <div className="border-input hover:bg-accent has-data-[state=checked]:bg-gradient-to-t ease-in-out duration-100 from-primary/30 has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border px-6 py-3 text-center shadow-xs outline-none has-focus-visible:ring-[3px]">
                                                <RadioGroupItem
                                                    value="others"
                                                    id="comaker-others"
                                                    className="sr-only"
                                                />
                                                <DotsHorizontalIcon
                                                    size={20}
                                                    aria-hidden="true"
                                                    className="opacity-60"
                                                />
                                                <label
                                                    htmlFor="comaker-others"
                                                    className="text-foreground cursor-pointer text-xs leading-none font-medium after:absolute after:inset-0"
                                                >
                                                    Other
                                                </label>
                                            </div>
                                        </FormItem>
                                    </RadioGroup>
                                )}
                            />
                        </div>
                    </fieldset>
                </fieldset>
                <FormFooterResetSubmit
                    className="p-4"
                    error={error}
                    readOnly={formProps.readOnly}
                    isLoading={isPending}
                    // disableSubmit={
                    //     formMode === 'create' && !areRequiredFieldsFilled
                    // }
                    submitText={
                        formMode === 'update' ? 'Update' : ''
                        // : areRequiredFieldsFilled
                        //   ? 'Creating...'
                        //   : 'Save'
                    }
                    onReset={() => {
                        form.reset()
                        reset?.()
                        hasAutoCreatedRef.current = false
                        setFormMode('create')
                        setCreatedLoanTransactionId(null)
                    }}
                />
            </form>
        </Form>
    )
}

export const LoanTransactionCreateUpdateFormModal = ({
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<ILoanTransactionFormProps, 'className'>
}) => {
    return (
        <Modal
            title=""
            description=""
            className={cn('p-0 !max-w-7xl', className)}
            {...props}
        >
            <LoanTransactionCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default LoanTransactionCreateUpdateForm
