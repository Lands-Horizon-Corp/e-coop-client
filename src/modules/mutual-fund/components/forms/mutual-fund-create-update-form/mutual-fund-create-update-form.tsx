import { UseFormReturn, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { toInputDateString } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { AccountPicker } from '@/modules/account'
import MemberPicker from '@/modules/member-profile/components/member-picker'
import MutualFundEntryView from '@/modules/mutual-fund-entry/components/tables/mutual-fund-entry-view'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { DotsHorizontalIcon, UserPlusIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, IForm, TEntityId } from '@/types'

import { MUTUAL_FUND_COMPUTATION_TYPES } from '../../../mutual-fund.constant'
import {
    useCreateMutualFund,
    useGenerateMutualFundProcessView,
    useUpdateMutualFundById,
} from '../../../mutual-fund.service'
import { IMutualFund, IMutualFundRequest } from '../../../mutual-fund.types'
import {
    MUTUAL_FUND_COMPUTATION_TYPE_DESCRIPTIONS,
    MUTUAL_FUND_COMPUTATION_TYPE_LABELS,
} from '../../../mutual-fund.utils'
import {
    MutualFundSchema,
    MutualFundViewSchema,
} from '../../../mutual-fund.validation'
import MutualFundAdditionalMemberSection from './mutual-fund-additional-member-section'
import MutualFundTableSection from './mutual-fund-table-section'

type TMutualFundSchema = z.infer<typeof MutualFundSchema>

export interface IMutualFundFormProps
    extends IClassProps,
        IForm<
            Partial<IMutualFundRequest>,
            IMutualFund,
            Error,
            TMutualFundSchema
        > {
    mutualFundId?: TEntityId
}

const MutualFundCreateUpdateForm = ({
    mutualFundId,
    className,
    ...formProps
}: IMutualFundFormProps) => {
    const form = useForm<TMutualFundSchema>({
        resolver: standardSchemaResolver(MutualFundSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            amount: 0,
            computation_type: 'continuous',
            extension_only: false,
            mutual_fund_entries: [],
            ...formProps.defaultValues,
            date_of_death: toInputDateString(
                formProps.defaultValues?.date_of_death || new Date()
            ),
        },
    })

    const createMutation = useCreateMutualFund({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const updateMutation = useUpdateMutualFundById({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const generateMutation = useGenerateMutualFundProcessView({
        options: {
            onSuccess: (data) => {
                form.setValue(
                    'mutual_fund_entries',
                    data.mutual_fund_entries || []
                )
                form.setValue('total_amount', data.total_amount || 0)
                form.setValue('is_viewing_entries', true)
                toast.success('Mutual fund entries generated successfully')
                form.trigger()
            },
            onError: (error) => {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(
                    errorMessage || 'Failed to generate mutual fund entries'
                )
            },
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TMutualFundSchema>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (mutualFundId) {
            toast.promise(
                updateMutation.mutateAsync({
                    id: mutualFundId,
                    payload: formData,
                }),
                {
                    loading: 'Updating mutual fund...',
                    success: 'Mutual fund updated successfully',
                    error: 'Failed to update mutual fund',
                }
            )
        } else {
            toast.promise(createMutation.mutateAsync(formData), {
                loading: 'Creating mutual fund...',
                success: 'Mutual fund created successfully',
                error: 'Failed to create mutual fund',
            })
        }
    }, handleFocusError)

    const onProcess = async () => {
        const formData = form.getValues()
        form.trigger()
        generateMutation.reset()

        const result = MutualFundViewSchema.safeParse(formData)

        if (!result.success) {
            toast.error(`Validation failed, please check the form fields.`)
            handleFocusError()
            return
        }

        toast.promise(generateMutation.mutateAsync(result.data), {
            loading: 'Generating mutual fund entries...',
        })
    }

    const {
        error: rawError,
        isPending,
        reset,
    } = mutualFundId ? updateMutation : createMutation

    const error = serverRequestErrExtractor({
        error: rawError || generateMutation.error,
    })
    const computationType = form.watch('computation_type')

    return (
        <Form {...form}>
            <form
                className={cn(
                    'flex w-full flex-col gap-y-4 min-w-0 max-w-full ',
                    className
                )}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid gap-x-6 min-w-0 max-w-full gap-y-4 sm:gap-y-3"
                    disabled={isPending || formProps.readOnly}
                >
                    <fieldset className="space-y-3 min-w-0 max-w-full ">
                        <FormFieldWrapper
                            control={form.control}
                            label="Deceased Member *"
                            name="member_profile_id"
                            render={({ field }) => (
                                <MemberPicker
                                    allowShorcutCommand
                                    disabled={isDisabled(field.name)}
                                    onSelect={(selectedMember) => {
                                        field.onChange(selectedMember?.id)
                                        form.setValue(
                                            'name',
                                            `Mutual fund for ${selectedMember.full_name}`
                                        )
                                        form.setValue(
                                            'member_profile',
                                            selectedMember
                                        )
                                    }}
                                    placeholder="Deceased Member"
                                    value={form.getValues('member_profile')}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Name *"
                            name="name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    placeholder="Mutual Fund Name"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Account *"
                            name="account_id"
                            render={({ field }) => (
                                <AccountPicker
                                    {...field}
                                    mode="deposit"
                                    onSelect={(account) => {
                                        field.onChange(account?.id || undefined)
                                        form.setValue('account', account)
                                    }}
                                    placeholder="Select account"
                                    value={form.watch('account')}
                                />
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormFieldWrapper
                                control={form.control}
                                label="Date of Death *"
                                name="date_of_death"
                                render={({ field }) => (
                                    <InputDate
                                        {...field}
                                        className="block"
                                        disabled={isDisabled(field.name)}
                                        placeholder="Select date"
                                        value={field.value ?? ''}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Benefit Claimed *"
                                name="amount"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="0.00"
                                    />
                                )}
                            />
                        </div>

                        <FormFieldWrapper
                            control={form.control}
                            label="Computation Type *"
                            name="computation_type"
                            render={({ field }) => (
                                <div className="space-y-2">
                                    <RadioGroup
                                        className="grid grid-cols-2 gap-3 rounded-xl bg-popover/20 p-3.5"
                                        disabled={isDisabled(field.name)}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        {MUTUAL_FUND_COMPUTATION_TYPES.map(
                                            (type) => (
                                                <div
                                                    className="flex items-center space-x-2"
                                                    key={type}
                                                >
                                                    <RadioGroupItem
                                                        id={type}
                                                        value={type}
                                                    />
                                                    <Label
                                                        className="cursor-pointer font-normal"
                                                        htmlFor={type}
                                                    >
                                                        {
                                                            MUTUAL_FUND_COMPUTATION_TYPE_LABELS[
                                                                type
                                                            ]
                                                        }
                                                        {type ===
                                                            'by_membership_year' && (
                                                            <MutualFundTableSectionTrigger
                                                                className="ml-1"
                                                                disabled={
                                                                    formProps.readOnly ||
                                                                    computationType !==
                                                                        'by_membership_year'
                                                                }
                                                                form={form}
                                                            />
                                                        )}
                                                    </Label>
                                                </div>
                                            )
                                        )}{' '}
                                        {computationType && (
                                            <p className="text-xs col-span-2 text-muted-foreground ">
                                                {
                                                    MUTUAL_FUND_COMPUTATION_TYPE_DESCRIPTIONS[
                                                        computationType
                                                    ]
                                                }
                                            </p>
                                        )}
                                    </RadioGroup>
                                </div>
                            )}
                        />

                        <EntriesSection
                            form={form}
                            isDisabledSection={!!mutualFundId}
                            isProcessing={generateMutation.isPending}
                            onProcess={onProcess}
                        />

                        <EntriesModalSection form={form} />

                        <div className="flex justify-between gap-x-2 items-center">
                            <FormFieldWrapper
                                control={form.control}
                                name="extension_only"
                                render={({ field }) => (
                                    <div className="flex items-center space-x-2 rounded-xl bg-popover/20 p-3.5">
                                        <Checkbox
                                            checked={field.value}
                                            disabled={isDisabled(field.name)}
                                            id="extension_only"
                                            onCheckedChange={field.onChange}
                                        />
                                        <Label
                                            className="w-full cursor-pointer font-normal"
                                            htmlFor="extension_only"
                                        >
                                            Extension Only
                                        </Label>
                                    </div>
                                )}
                            />
                            <MutualFundAdditionalMemberSectionTrigger
                                form={form}
                            />
                        </div>
                        <FormFieldWrapper
                            control={form.control}
                            label="Description"
                            name="description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    placeholder="Enter description"
                                    rows={3}
                                />
                            )}
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
                    submitText={mutualFundId ? 'Update' : 'Create'}
                />
            </form>
        </Form>
    )
}

export const MutualFundCreateUpdateFormModal = ({
    title = 'Create Mutual Fund',
    description = 'Fill out the form to create a mutual fund record.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IMutualFundFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('!max-w-2xl', className)}
            description={description}
            title={title}
            {...props}
        >
            <MutualFundCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MutualFundCreateUpdateForm

const EntriesSection = ({
    form,
    isProcessing,
    isDisabledSection = false,
    onProcess,
}: {
    isDisabledSection?: boolean
    form: UseFormReturn<TMutualFundSchema>
    isProcessing: boolean
    onProcess: () => void
}) => {
    const entries = form.watch('mutual_fund_entries') || []
    const hasEntries = entries.length > 0

    return (
        <div
            className={cn(
                'rounded-xl p-4 space-y-2',
                'border-2 transition-all duration-500 ease-in-out',
                hasEntries
                    ? 'bg-gradient-to-br from-primary/15 via-accent/10 to-primary/5 border-primary/30 shadow-sm'
                    : 'bg-popover/20 border-transparent'
            )}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <p className="text-sm font-medium">Generated Entries</p>
                    <span
                        className={cn(
                            'px-1.5 py-0.5 rounded-md font-semibold text-xs',
                            'transition-all duration-300 ease-in-out',
                            hasEntries
                                ? 'bg-primary text-primary-foreground shadow-sm scale-105'
                                : 'bg-muted text-muted-foreground'
                        )}
                    >
                        {entries.length}
                    </span>
                </div>
                <div className="flex gap-2">
                    {hasEntries && (
                        <Button
                            onClick={() => {
                                form.setValue('mutual_fund_entries', [])
                            }}
                            size="xs"
                            type="button"
                            variant="outline"
                        >
                            Clear
                        </Button>
                    )}
                    <Button
                        className="transition-all duration-300 ease-in-out"
                        disabled={isProcessing || isDisabledSection}
                        onClick={onProcess}
                        size="xs"
                        type="button"
                        variant={hasEntries ? 'secondary' : 'default'}
                    >
                        {isProcessing ? 'Processing...' : 'Generate'}
                    </Button>
                </div>
            </div>
            {hasEntries && (
                <p className="text-xs font-medium text-muted-foreground">
                    You now generated {entries.length} entr
                    {entries.length > 1 ? 'ies' : 'y'}. You can change config
                    and reprocess to get another result or you can save it
                </p>
            )}
        </div>
    )
}

const EntriesModalSection = ({
    form,
}: {
    form: UseFormReturn<TMutualFundSchema>
}) => {
    const entries = form.watch('mutual_fund_entries') || []
    const total = form.watch('total_amount')
    const isViewingEntries = form.watch('is_viewing_entries') || false

    return (
        <Modal
            className="!max-w-7xl"
            description={`Showing ${entries.length} generated mutual fund entries. Review the distribution amounts below.`}
            onOpenChange={(open) => {
                form.setValue('is_viewing_entries', open)
            }}
            open={isViewingEntries}
            title="Generated Mutual Fund Entries"
        >
            <MutualFundEntryView
                className="h-[70vh] text-sm"
                entries={entries}
                total_amount={total}
            />
        </Modal>
    )
}

const MutualFundAdditionalMemberSectionTrigger = ({
    form,
    disabled,
}: {
    form: UseFormReturn<TMutualFundSchema>
    disabled?: boolean
}) => {
    const openAdditionalMemberModal = useModalState()

    return (
        <>
            <FormFieldWrapper
                control={form.control}
                name="description"
                render={({ field }) => (
                    <Button
                        {...field}
                        className="w-full"
                        disabled={disabled}
                        onClick={() =>
                            openAdditionalMemberModal.onOpenChange(true)
                        }
                        size="sm"
                        type="button"
                        variant="outline"
                    >
                        <UserPlusIcon className="size-4 mr-1" />
                        Additional Members
                    </Button>
                )}
            />

            {openAdditionalMemberModal.open && (
                <Modal
                    {...openAdditionalMemberModal}
                    className="!max-w-5xl"
                    closeButtonClassName="top-2 right-2"
                    descriptionClassName="hidden"
                    titleClassName="hidden"
                >
                    <MutualFundAdditionalMemberSection
                        disabled={disabled}
                        form={form}
                    />
                </Modal>
            )}
        </>
    )
}

const MutualFundTableSectionTrigger = ({
    form,
    disabled,
    className,
}: {
    form: UseFormReturn<TMutualFundSchema>
    disabled?: boolean
    className?: string
}) => {
    const openTableModal = useModalState()

    return (
        <>
            <Button
                className={cn('p-1.5 size-fit', className)}
                disabled={disabled}
                onClick={() => openTableModal.onOpenChange(true)}
                size="icon-sm"
                type="button"
                variant="outline"
            >
                <DotsHorizontalIcon className="size-2 mr-1" />
            </Button>
            {openTableModal.open && (
                <Modal
                    {...openTableModal}
                    className="!max-w-5xl"
                    closeButtonClassName="top-2 right-2"
                    descriptionClassName="hidden"
                    titleClassName="hidden"
                >
                    <MutualFundTableSection disabled={disabled} form={form} />
                </Modal>
            )}
        </>
    )
}
