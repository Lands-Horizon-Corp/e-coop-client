import z from 'zod'
import { toast } from 'sonner'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Path, useFieldArray, useForm } from 'react-hook-form'

import {
    XIcon,
    PlusIcon,
    TrashIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    VerifiedPatchIcon,
    SignatureLightIcon,
} from '@/components/icons'
import {
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
} from '@/components/ui/form'
import {
    Select,
    SelectItem,
    SelectValue,
    SelectTrigger,
    SelectContent,
} from '@/components/ui/select'
import BranchPicker, {
    IBranchPickerCreateProps,
} from '@/components/pickers/branch-picker'
import { Input } from '@/components/ui/input'
import { IForm } from '@/types/components'
import { Button } from '@/components/ui/button'
import TextEditor from '@/components/text-editor'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { AvatarUploadField } from './avatar-upload-field'
import GenderSelect, {
    IGenderSelectCreateProps,
} from '@/components/selects/gender-select'
import MemberPicker from '@/components/pickers/member-picker'
import Modal, { IModalProps } from '@/components/modals/modal'
import { SignatureUploadField } from './signature-upload-field'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import FormErrorMessage from '@/components/ui/form-error-message'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { SingleImageUploadField } from './single-image-upload-field'
import { PhoneInput } from '@/components/contact-input/contact-input'
import MemberTypeSelect from '@/components/selects/member-type-select'
import ProvinceCombobox from '@/components/comboboxes/province-combobox'
import BarangayCombobox from '@/components/comboboxes/barangay-combobox'
import MunicipalityCombobox from '@/components/comboboxes/municipality-combobox'
import MemberOccupationCombobox, {
    IMemberOccupationComboboxCreateProps,
} from '@/components/comboboxes/member-occupation-combobox'
import MemberClassificationCombobox, {
    IMemberClassificationComboboxCreateProps,
} from '@/components/comboboxes/member-classification-combobox'
import MemberEducationalAttainmentPicker, {
    IMemberEducationalAttainmentComboboxCreateProps,
} from '@/components/comboboxes/member-educational-attainment-combobox'
import { CountryCombobox } from '@/components/comboboxes/country-combobox'
import GovernmentBenefitsCombobox from '@/components/comboboxes/government-benefits-combobox'
import MemberCenterPicker, {
    IMemberCenterPickerCreateProps,
} from '@/components/pickers/member-center-picker'
import RelationshipCombobox from '@/components/comboboxes/relationship-combobox'
import MemberCloseAccountBanner from '@/components/member-infos/banners/member-closed-account-banner'

import {
    useCreateMemberProfile,
    useUpdateMemberProfile,
} from '@/hooks/api-hooks/member/use-member-profile'
import { TFilterObject } from '@/contexts/filter-context'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { createMemberProfileSchema } from '@/validations/member/member-profile-schema'

import { cn } from '@/lib'
import { IClassProps } from '@/types'
import logger from '@/helpers/loggers/logger'
import { philippinesCards } from '@/constants'
import { TEntityId, TRelationship } from '@/server'

type TMemberProfileForm = z.infer<typeof createMemberProfileSchema>

interface IMemberProfileCreateUpdateFormProps
    extends IClassProps,
        IForm<Partial<TMemberProfileForm>, unknown, string> {
    memberTypeOptionsFilter?: TFilterObject
    profileId?: TEntityId

    // Since this form uses pickers and other stuff, they might have create capabilities
    branchPickerCreateProps?: IBranchPickerCreateProps
    memberGenderCreateProps?: IGenderSelectCreateProps
    memberCenterPickerCreateProps?: IMemberCenterPickerCreateProps
    memberClassificationCreateProps?: IMemberClassificationComboboxCreateProps
    memberOccupationComboboxCreateProps?: IMemberOccupationComboboxCreateProps
    educationalAttainmentComboboxCreateProps?: IMemberEducationalAttainmentComboboxCreateProps
}

type Step = {
    title: string
    fields: Path<TMemberProfileForm>[]
}

const Steps: Step[] = [
    {
        title: 'Personal & Identification Information',
        fields: [
            'memberId',
            'passbookNumber',
            'oldReferenceId',
            'status',
            'memberTypeId',
            'branchId',
            'isMutualFundMember',
            'isMicroFinanceMember',
            'contactNumber',
            'civilStatus',
            'memberGenderId',
            'memberClassificationId',
            'occupationId',
            'businessAddress',
            'businessContact',
            'memberAddresses',
            'memberContactNumberReferences',
            'memberDescriptions',
        ],
    },
    {
        title: 'Government Related Information',
        fields: ['memberGovernmentBenefits'],
    },
    {
        title: 'Financial Details',
        fields: ['memberIncome', 'memberExpenses', 'memberAssets'],
    },
    {
        title: 'Family & Relationships',
        fields: ['memberRelativeAccounts', 'memberJointAccounts'],
    },
    {
        title: 'Other',
        fields: ['memberDescriptions'],
    },
]

const MemberProfileCreateUpdateForm = ({
    readOnly,
    className,
    hiddenFields,
    defaultValues,
    disabledFields,
    branchPickerCreateProps,
    memberTypeOptionsFilter,
    memberGenderCreateProps,
    memberCenterPickerCreateProps,
    memberClassificationCreateProps,
    memberOccupationComboboxCreateProps,
    educationalAttainmentComboboxCreateProps,
    onError,
    onSuccess,
}: IMemberProfileCreateUpdateFormProps) => {
    const { onOpen } = useConfirmModalStore()
    const [step, setStep] = useState(0)

    const form = useForm<TMemberProfileForm>({
        resolver: zodResolver(createMemberProfileSchema),
        reValidateMode: 'onChange',
        mode: 'onChange',
        defaultValues: {
            notes: '',
            description: '',
            contactNumber: '',
            civilStatus: 'Single',
            status: 'Pending',
            isClosed: false,
            isMutualFundMember: false,
            isMicroFinanceMember: false,
            ...defaultValues,
        },
    })

    const isDisabled = (field: Path<TMemberProfileForm>) =>
        readOnly ||
        disabledFields?.includes(field) ||
        defaultValues?.isClosed ||
        false

    const onNext = async () => {
        const triggerValidation = await form.trigger(Steps[step].fields, {
            shouldFocus: true,
        })

        if (triggerValidation) setStep((prev) => prev + 1)
    }

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'memberDescriptions',
    })

    form.watch('memberAddresses')
    const memberAddresses = useFieldArray({
        control: form.control,
        name: 'memberAddresses',
    })

    const memberContactNumberReferences = useFieldArray({
        control: form.control,
        name: 'memberContactNumberReferences',
    })

    const {
        fields: memberAssetsFields,
        append: addAsset,
        remove: removeAsset,
    } = useFieldArray({
        control: form.control,
        name: 'memberAssets',
    })

    const {
        fields: incomeFields,
        append: addIncome,
        remove: removeIncome,
    } = useFieldArray({
        control: form.control,
        name: 'memberIncome',
    })

    const {
        fields: relativeFields,
        append: addRelative,
        remove: removeRelative,
    } = useFieldArray({
        control: form.control,
        name: 'memberRelativeAccounts',
    })

    const {
        fields: memberExpensesFields,
        append: addExpense,
        remove: removeExpense,
    } = useFieldArray({
        control: form.control,
        name: 'memberExpenses',
    })

    const {
        fields: jointFields,
        append: addJoint,
        remove: removeJoint,
    } = useFieldArray({
        control: form.control,
        name: 'memberJointAccounts',
    })

    const {
        fields: govtFields,
        append: addGovtBenefit,
        remove: removeGovtBenefit,
    } = useFieldArray({
        control: form.control,
        name: 'memberGovernmentBenefits',
    })

    const {
        error: createError,
        isPending: isCreating,
        mutate: createMemberProfile,
    } = useCreateMemberProfile({ onSuccess, onError })

    const {
        error: updateError,
        isPending: isUpdating,
        mutate: updateMemberProfile,
    } = useUpdateMemberProfile({ onSuccess, onError })

    const handleSubmit = (data: TMemberProfileForm) => {
        if (data.id) {
            updateMemberProfile({ id: data.id, data })
        } else {
            createMemberProfile(data)
        }
    }

    const error = createError || updateError
    const isLoading = isCreating || isUpdating

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <div className="flex items-center justify-between">
                    <p>{Steps[step].title}</p>
                    <div className="flex items-center gap-x-2">
                        <p className="text-sm text-foreground/70">
                            {step + 1} of {Steps.length}
                        </p>
                    </div>
                </div>

                {defaultValues?.isClosed && (
                    <MemberCloseAccountBanner
                        closeRemarks={defaultValues?.memberCloseRemarks}
                    />
                )}

                <fieldset
                    className="min-h-[60vh] gap-x-4 gap-y-4 space-y-5"
                    disabled={isLoading || readOnly || defaultValues?.isClosed}
                >
                    {step === 0 && (
                        <>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-4">
                                    <legend>Identification & Reference</legend>
                                    <Separator />
                                    <FormFieldWrapper
                                        name="memberTypeId"
                                        control={form.control}
                                        label="Member Type *"
                                        hiddenFields={hiddenFields}
                                        render={({ field }) => (
                                            <FormControl>
                                                <MemberTypeSelect
                                                    {...field}
                                                    disabled={isDisabled(
                                                        field.name
                                                    )}
                                                    filter={
                                                        memberTypeOptionsFilter
                                                    }
                                                    onChange={(memberType) =>
                                                        field.onChange(
                                                            memberType.id
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        name="passbookNumber"
                                        control={form.control}
                                        label="Passbook Number"
                                        hiddenFields={hiddenFields}
                                        render={({ field }) => (
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    id={field.name}
                                                    placeholder="Enter Passbook Number"
                                                    disabled={isDisabled(
                                                        field.name
                                                    )}
                                                />
                                            </FormControl>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        name="oldReferenceId"
                                        control={form.control}
                                        label="Old Reference Id"
                                        hiddenFields={hiddenFields}
                                        render={({ field }) => (
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    id={field.name}
                                                    placeholder="Enter Old Passbook/ID"
                                                    disabled={isDisabled(
                                                        field.name
                                                    )}
                                                />
                                            </FormControl>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        name="branchId"
                                        control={form.control}
                                        label="Member Branch"
                                        hiddenFields={hiddenFields}
                                        render={({ field }) => (
                                            <FormControl>
                                                <BranchPicker
                                                    {...field}
                                                    createProps={
                                                        branchPickerCreateProps
                                                    }
                                                    onSelect={(branch) =>
                                                        field.onChange(
                                                            branch.id
                                                        )
                                                    }
                                                />
                                            </FormControl>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        name="memberClassificationId"
                                        control={form.control}
                                        label="Member Classification"
                                        hiddenFields={hiddenFields}
                                        render={({ field }) => (
                                            <FormControl>
                                                <MemberClassificationCombobox
                                                    {...field}
                                                    memberClassificationCreateProps={
                                                        memberClassificationCreateProps
                                                    }
                                                    onChange={(memClass) => {
                                                        logger.log(
                                                            'Setting to ',
                                                            memClass.id
                                                        )
                                                        field.onChange(
                                                            memClass.id
                                                        )
                                                    }}
                                                />
                                            </FormControl>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        name="memberCenterId"
                                        control={form.control}
                                        label="Member Center"
                                        hiddenFields={hiddenFields}
                                        render={({ field }) => (
                                            <FormControl>
                                                <MemberCenterPicker
                                                    {...field}
                                                    onSelect={(selected) => {
                                                        field.onChange(
                                                            selected.id
                                                        )
                                                    }}
                                                    disabled={isDisabled(
                                                        field.name
                                                    )}
                                                    createProps={
                                                        memberCenterPickerCreateProps
                                                    }
                                                />
                                            </FormControl>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        name="memberId"
                                        control={form.control}
                                        label="Member Account ID"
                                        description="System generated unique ID for member"
                                        hiddenFields={hiddenFields}
                                        render={({ field }) => (
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    id={field.name}
                                                    placeholder="Member Account ID"
                                                    disabled={isDisabled(
                                                        field.name
                                                    )}
                                                />
                                            </FormControl>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        name="status"
                                        label="Status"
                                        control={form.control}
                                        hiddenFields={hiddenFields}
                                        render={({ field }) => (
                                            <Select
                                                defaultValue={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <FormControl>
                                                    <SelectTrigger
                                                        disabled={isDisabled(
                                                            field.name
                                                        )}
                                                    >
                                                        <SelectValue
                                                            {...field}
                                                            id={field.name}
                                                            placeholder="Member Status"
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Pending">
                                                        Pending
                                                    </SelectItem>
                                                    <SelectItem value="Verified">
                                                        Verified
                                                    </SelectItem>
                                                    <SelectItem value="Not Allowed">
                                                        Not Allowed
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />

                                    <FormFieldWrapper
                                        control={form.control}
                                        name="recruitedByMemberProfileId"
                                        label="Recruited By"
                                        description="Select the member that recruited this member."
                                        hiddenFields={hiddenFields}
                                        render={({ field }) => (
                                            <FormControl>
                                                <MemberPicker
                                                    {...field}
                                                    onSelect={(member) => {
                                                        if (
                                                            !member.memberProfile
                                                        )
                                                            return toast.warning(
                                                                "Can't select a member that has no profile yet."
                                                            )
                                                        field.onChange(
                                                            member.memberProfile
                                                                .id
                                                        )
                                                    }}
                                                    placeholder="Select rectuiter"
                                                    disabled={isDisabled(
                                                        field.name
                                                    )}
                                                />
                                            </FormControl>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        name="isMutualFundMember"
                                        control={form.control}
                                        hiddenFields={hiddenFields}
                                        render={({ field }) => (
                                            <span className="inline-flex w-full items-center gap-x-2 rounded-xl bg-secondary px-4 py-2 dark:bg-popover">
                                                <FormControl>
                                                    <Checkbox
                                                        id={field.name}
                                                        disabled={isDisabled(
                                                            field.name
                                                        )}
                                                        onCheckedChange={(
                                                            checked
                                                        ) =>
                                                            field.onChange(
                                                                checked
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormLabel
                                                    htmlFor={field.name}
                                                    className="ml-2 space-y-2"
                                                >
                                                    <span>
                                                        Mutualfund Member
                                                    </span>
                                                    <FormDescription className="font-normal">
                                                        Contributes to a pooled
                                                        investment (mutual
                                                        fund).
                                                    </FormDescription>
                                                </FormLabel>
                                            </span>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        name="isMicroFinanceMember"
                                        control={form.control}
                                        hiddenFields={hiddenFields}
                                        render={({ field }) => (
                                            <span className="inline-flex w-full items-center gap-x-2 rounded-xl bg-secondary px-4 py-2 dark:bg-popover">
                                                <FormControl>
                                                    <Checkbox
                                                        id={field.name}
                                                        disabled={isDisabled(
                                                            field.name
                                                        )}
                                                        checked={field.value}
                                                        onCheckedChange={(
                                                            checked
                                                        ) =>
                                                            field.onChange(
                                                                checked
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormLabel
                                                    htmlFor={field.name}
                                                    className="ml-2 space-y-2"
                                                >
                                                    <span>
                                                        Micro Finance Member
                                                    </span>
                                                    <FormDescription className="font-normal">
                                                        Participates in
                                                        small-scale financial
                                                        services.
                                                    </FormDescription>
                                                </FormLabel>
                                            </span>
                                        )}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <legend>Personal Information</legend>
                                    <Separator />
                                    <FormFieldWrapper
                                        name="mediaId"
                                        control={form.control}
                                        label="Picture"
                                        className="col-span-1"
                                        hiddenFields={hiddenFields}
                                        render={({ field }) => (
                                            <FormControl>
                                                <AvatarUploadField
                                                    placeholder="Upload Person Picture"
                                                    description="Upload Member Picture/Photo"
                                                    {...field}
                                                    mediaImage={form.getValues(
                                                        'media'
                                                    )}
                                                    onChange={(
                                                        mediaUploaded
                                                    ) => {
                                                        field.onChange(
                                                            mediaUploaded?.id
                                                        )
                                                        form.setValue(
                                                            'media',
                                                            mediaUploaded
                                                        )
                                                    }}
                                                />
                                            </FormControl>
                                        )}
                                    />
                                    <div className="grid gap-x-2 gap-y-4 md:grid-cols-3">
                                        <FormFieldWrapper
                                            name="firstName"
                                            control={form.control}
                                            label="First Name"
                                            hiddenFields={hiddenFields}
                                            render={({ field }) => (
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        id={field.name}
                                                        autoComplete="given-name"
                                                        placeholder="First Name"
                                                        disabled={isDisabled(
                                                            field.name
                                                        )}
                                                    />
                                                </FormControl>
                                            )}
                                        />
                                        <FormFieldWrapper
                                            name="middleName"
                                            control={form.control}
                                            label="Middle Name"
                                            hiddenFields={hiddenFields}
                                            render={({ field }) => (
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        id={field.name}
                                                        placeholder="Middle Name"
                                                        disabled={isDisabled(
                                                            field.name
                                                        )}
                                                    />
                                                </FormControl>
                                            )}
                                        />
                                        <FormFieldWrapper
                                            name="lastName"
                                            control={form.control}
                                            label="Last Name"
                                            hiddenFields={hiddenFields}
                                            render={({ field }) => (
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        id={field.name}
                                                        autoComplete="family-name"
                                                        placeholder="Last Name"
                                                        disabled={isDisabled(
                                                            field.name
                                                        )}
                                                    />
                                                </FormControl>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-2">
                                        <FormFieldWrapper
                                            name="contactNumber"
                                            control={form.control}
                                            label="Contact Number *"
                                            hiddenFields={hiddenFields}
                                            render={({
                                                field,
                                                fieldState: { invalid, error },
                                            }) => (
                                                <FormControl>
                                                    <div className="relative flex flex-1 items-center gap-x-2">
                                                        <VerifiedPatchIcon
                                                            className={cn(
                                                                'absolute right-2 top-1/2 z-20 size-4 -translate-y-1/2 text-primary delay-300 duration-300 ease-in-out',
                                                                (invalid ||
                                                                    error) &&
                                                                    'text-destructive'
                                                            )}
                                                        />
                                                        <PhoneInput
                                                            {...field}
                                                            className="w-full"
                                                            defaultCountry="PH"
                                                        />
                                                    </div>
                                                </FormControl>
                                            )}
                                        />
                                        <FormFieldWrapper
                                            name="civilStatus"
                                            control={form.control}
                                            label="Civil Status"
                                            hiddenFields={hiddenFields}
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger
                                                            disabled={isDisabled(
                                                                field.name
                                                            )}
                                                        >
                                                            <SelectValue
                                                                {...field}
                                                                id={field.name}
                                                                placeholder="Select Civil Status"
                                                            />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Married">
                                                            Married
                                                        </SelectItem>
                                                        <SelectItem value="Single">
                                                            Single
                                                        </SelectItem>
                                                        <SelectItem value="Widowed">
                                                            Widowed
                                                        </SelectItem>
                                                        <SelectItem value="Separated">
                                                            Separated
                                                        </SelectItem>
                                                        <SelectItem value="N/A">
                                                            N/A
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>
                                    <FormFieldWrapper
                                        name="signatureMediaId"
                                        control={form.control}
                                        label="Signature"
                                        hiddenFields={hiddenFields}
                                        render={({ field }) => (
                                            <SignatureUploadField
                                                placeholder="Upload Signature Photo"
                                                {...field}
                                                DisplayIcon={SignatureLightIcon}
                                                mediaImage={form.getValues(
                                                    'signatureMedia'
                                                )}
                                                onChange={(mediaUploaded) => {
                                                    field.onChange(
                                                        mediaUploaded?.id ??
                                                            undefined
                                                    )
                                                    form.setValue(
                                                        'signatureMedia',
                                                        mediaUploaded
                                                    )
                                                }}
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        name="memberGenderId"
                                        control={form.control}
                                        label="Gender"
                                        hiddenFields={hiddenFields}
                                        render={({ field }) => (
                                            <GenderSelect
                                                {...field}
                                                createGenderProps={
                                                    memberGenderCreateProps
                                                }
                                                onChange={(gender) =>
                                                    field.onChange(gender.id)
                                                }
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        name="memberEducationalAttainmentId"
                                        control={form.control}
                                        label="Educational Attainment"
                                        hiddenFields={hiddenFields}
                                        render={({ field }) => (
                                            <MemberEducationalAttainmentPicker
                                                {...field}
                                                educationalAttainmentComboboxCreateProps={
                                                    educationalAttainmentComboboxCreateProps
                                                }
                                                onChange={(selected) =>
                                                    field.onChange(selected.id)
                                                }
                                            />
                                        )}
                                    />

                                    <FormFieldWrapper
                                        name="occupationId"
                                        control={form.control}
                                        label="Occupation"
                                        hiddenFields={hiddenFields}
                                        render={({ field }) => (
                                            <FormControl>
                                                <MemberOccupationCombobox
                                                    {...field}
                                                    disabled={isDisabled(
                                                        field.name
                                                    )}
                                                    onChange={(occupation) =>
                                                        field.onChange(
                                                            occupation.id
                                                        )
                                                    }
                                                    placeholder="Select Occupation"
                                                    memberOccupationComboboxCreateProps={
                                                        memberOccupationComboboxCreateProps
                                                    }
                                                />
                                            </FormControl>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        name="businessAddress"
                                        control={form.control}
                                        label="Business Address"
                                        hiddenFields={hiddenFields}
                                        render={({ field }) => (
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    id={field.name}
                                                    placeholder="Enter business address"
                                                    className="min-h-0"
                                                    disabled={isDisabled(
                                                        field.name
                                                    )}
                                                />
                                            </FormControl>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        name="businessContact"
                                        control={form.control}
                                        label="Business Contact"
                                        hiddenFields={hiddenFields}
                                        render={({
                                            field,
                                            fieldState: { invalid, error },
                                        }) => (
                                            <FormControl>
                                                <div className="relative flex flex-1 items-center gap-x-2">
                                                    <VerifiedPatchIcon
                                                        className={cn(
                                                            'absolute right-2 top-1/2 z-20 size-4 -translate-y-1/2 text-primary delay-300 duration-300 ease-in-out',
                                                            (invalid ||
                                                                error) &&
                                                                'text-destructive'
                                                        )}
                                                    />
                                                    <PhoneInput
                                                        {...field}
                                                        disabled={isDisabled(
                                                            field.name
                                                        )}
                                                        className="w-full"
                                                        defaultCountry="PH"
                                                    />
                                                </div>
                                            </FormControl>
                                        )}
                                    />
                                </div>
                            </div>
                            <FormFieldWrapper
                                name="memberAddresses"
                                label="Address"
                                control={form.control}
                                hiddenFields={hiddenFields}
                                render={() => (
                                    <>
                                        <Separator />
                                        <fieldset className="grid gap-4">
                                            {memberAddresses.fields.map(
                                                (addressField, index) => (
                                                    <div
                                                        key={addressField.id}
                                                        className="relative flex w-full flex-col gap-4 md:flex-row"
                                                    >
                                                        <FormFieldWrapper
                                                            name={`memberAddresses.${index}.label`}
                                                            control={
                                                                form.control
                                                            }
                                                            label="Label *"
                                                            hiddenFields={
                                                                hiddenFields
                                                            }
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        id={
                                                                            field.name
                                                                        }
                                                                        placeholder="Label"
                                                                    />
                                                                </FormControl>
                                                            )}
                                                        />
                                                        <FormFieldWrapper
                                                            name={`memberAddresses.${index}.province`}
                                                            control={
                                                                form.control
                                                            }
                                                            label="Province *"
                                                            hiddenFields={
                                                                hiddenFields
                                                            }
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormControl>
                                                                    <ProvinceCombobox
                                                                        {...field}
                                                                        id={
                                                                            field.name
                                                                        }
                                                                        placeholder="Province"
                                                                    />
                                                                </FormControl>
                                                            )}
                                                        />
                                                        <FormFieldWrapper
                                                            name={`memberAddresses.${index}.city`}
                                                            control={
                                                                form.control
                                                            }
                                                            label="City *"
                                                            hiddenFields={
                                                                hiddenFields
                                                            }
                                                            render={({
                                                                field,
                                                            }) => {
                                                                const isProvinceValid =
                                                                    !!form.watch(
                                                                        `memberAddresses.${index}.province`
                                                                    ) &&
                                                                    !form
                                                                        .formState
                                                                        .errors
                                                                        .memberAddresses?.[
                                                                        index
                                                                    ]?.province

                                                                return (
                                                                    <FormControl>
                                                                        <MunicipalityCombobox
                                                                            {...field}
                                                                            id={
                                                                                field.name
                                                                            }
                                                                            province={form.getValues(
                                                                                `memberAddresses.${index}.province`
                                                                            )}
                                                                            disabled={
                                                                                !isProvinceValid
                                                                            }
                                                                            placeholder="City"
                                                                        />
                                                                    </FormControl>
                                                                )
                                                            }}
                                                        />
                                                        <FormFieldWrapper
                                                            name={`memberAddresses.${index}.barangay`}
                                                            control={
                                                                form.control
                                                            }
                                                            label="Barangay *"
                                                            hiddenFields={
                                                                hiddenFields
                                                            }
                                                            render={({
                                                                field,
                                                            }) => {
                                                                const isCityValid =
                                                                    !!form.watch(
                                                                        `memberAddresses.${index}.city`
                                                                    ) &&
                                                                    !form
                                                                        .formState
                                                                        .errors
                                                                        .memberAddresses?.[
                                                                        index
                                                                    ]?.province

                                                                return (
                                                                    <FormControl>
                                                                        <BarangayCombobox
                                                                            {...field}
                                                                            id={
                                                                                field.name
                                                                            }
                                                                            municipality={form.getValues(
                                                                                `memberAddresses.${index}.city`
                                                                            )}
                                                                            disabled={
                                                                                !isCityValid
                                                                            }
                                                                            placeholder="Barangay"
                                                                        />
                                                                    </FormControl>
                                                                )
                                                            }}
                                                        />
                                                        <FormFieldWrapper
                                                            name={`memberAddresses.${index}.postalCode`}
                                                            control={
                                                                form.control
                                                            }
                                                            label="Postal Code *"
                                                            hiddenFields={
                                                                hiddenFields
                                                            }
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        id={
                                                                            field.name
                                                                        }
                                                                        placeholder="Postal Code"
                                                                    />
                                                                </FormControl>
                                                            )}
                                                        />
                                                        <Button
                                                            size="icon"
                                                            type="button"
                                                            variant="secondary"
                                                            onClick={() =>
                                                                memberAddresses.remove(
                                                                    index
                                                                )
                                                            }
                                                            className="absolute right-0 top-0 size-fit self-center rounded-full p-1"
                                                        >
                                                            <XIcon className="size-4" />
                                                        </Button>
                                                    </div>
                                                )
                                            )}
                                        </fieldset>
                                        <Button
                                            size="sm"
                                            type="button"
                                            variant="secondary"
                                            className="!mt-2"
                                            onClick={() =>
                                                memberAddresses.append({
                                                    label: '',
                                                    barangay: '',
                                                    city: '',
                                                    province: '',
                                                    postalCode: '',
                                                })
                                            }
                                        >
                                            <PlusIcon className="mr-2" /> Add
                                            Address
                                        </Button>
                                    </>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                hiddenFields={hiddenFields}
                                name="memberContactNumberReferences"
                                label="Member Contact Number References"
                                render={() => (
                                    <FormItem className="col-span-1 space-y-2">
                                        <Separator />
                                        <fieldset className="grid gap-4">
                                            {memberContactNumberReferences.fields.map(
                                                (contactField, index) => (
                                                    <div
                                                        key={contactField.id}
                                                        className="relative flex w-full flex-col gap-4 md:flex-row"
                                                    >
                                                        <FormFieldWrapper
                                                            control={
                                                                form.control
                                                            }
                                                            label="Name *"
                                                            hiddenFields={
                                                                hiddenFields
                                                            }
                                                            name={`memberContactNumberReferences.${index}.name`}
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        id={
                                                                            field.name
                                                                        }
                                                                        placeholder="Reference Name"
                                                                        disabled={isDisabled(
                                                                            field.name
                                                                        )}
                                                                        className="w-full"
                                                                    />
                                                                </FormControl>
                                                            )}
                                                        />
                                                        <FormFieldWrapper
                                                            control={
                                                                form.control
                                                            }
                                                            name={`memberContactNumberReferences.${index}.description`}
                                                            label="Description *"
                                                            hiddenFields={
                                                                hiddenFields
                                                            }
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        disabled={isDisabled(
                                                                            field.name
                                                                        )}
                                                                        multiple
                                                                        className="min-h-0"
                                                                        placeholder="Description Content"
                                                                    />
                                                                </FormControl>
                                                            )}
                                                        />
                                                        <FormFieldWrapper
                                                            control={
                                                                form.control
                                                            }
                                                            name={`memberContactNumberReferences.${index}.contactNumber`}
                                                            label="Contact Number *"
                                                            hiddenFields={
                                                                hiddenFields
                                                            }
                                                            render={({
                                                                field,
                                                                fieldState: {
                                                                    invalid,
                                                                    error,
                                                                },
                                                            }) => (
                                                                <FormControl>
                                                                    <div className="relative flex flex-1 items-center gap-x-2">
                                                                        <VerifiedPatchIcon
                                                                            className={cn(
                                                                                'absolute right-2 top-1/2 z-20 size-4 -translate-y-1/2 text-primary delay-300 duration-300 ease-in-out',
                                                                                (invalid ||
                                                                                    error) &&
                                                                                    'text-destructive'
                                                                            )}
                                                                        />
                                                                        <PhoneInput
                                                                            {...field}
                                                                            disabled={isDisabled(
                                                                                field.name
                                                                            )}
                                                                            className="w-full"
                                                                            defaultCountry="PH"
                                                                        />
                                                                    </div>
                                                                </FormControl>
                                                            )}
                                                        />
                                                        <Button
                                                            size="icon"
                                                            type="button"
                                                            variant="secondary"
                                                            onClick={() =>
                                                                memberContactNumberReferences.remove(
                                                                    index
                                                                )
                                                            }
                                                            className="absolute right-0 top-0 size-fit self-center rounded-full p-1"
                                                        >
                                                            <XIcon className="size-4" />
                                                        </Button>
                                                    </div>
                                                )
                                            )}
                                        </fieldset>
                                        <Button
                                            size="sm"
                                            type="button"
                                            variant="secondary"
                                            onClick={() =>
                                                memberContactNumberReferences.append(
                                                    {
                                                        name: '',
                                                        description: '',
                                                        contactNumber: '',
                                                    }
                                                )
                                            }
                                        >
                                            <PlusIcon className="mr-2" /> Add
                                            Contact Reference
                                        </Button>
                                    </FormItem>
                                )}
                            />
                        </>
                    )}

                    {step === 1 && (
                        <div className="space-y-4">
                            <FormFieldWrapper
                                name="memberGovernmentBenefits"
                                control={form.control}
                                hiddenFields={hiddenFields}
                                label="Government Benefits"
                                render={() => (
                                    <FormItem className="col-span-1 space-y-2">
                                        <Separator className="mt-4" />
                                        <fieldset
                                            disabled={isDisabled(
                                                'memberGovernmentBenefits'
                                            )}
                                            className="grid gap-4"
                                        >
                                            {govtFields.map(
                                                (benefitField, index) => (
                                                    <div
                                                        key={benefitField.id}
                                                        className="relative grid grid-cols-2 gap-x-2 gap-y-2 rounded-xl bg-secondary p-4 dark:bg-popover sm:grid-cols-4"
                                                    >
                                                        <FormFieldWrapper
                                                            name={`memberGovernmentBenefits.${index}.country`}
                                                            control={
                                                                form.control
                                                            }
                                                            label="Country"
                                                            hiddenFields={
                                                                hiddenFields
                                                            }
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormControl>
                                                                    <CountryCombobox
                                                                        {...field}
                                                                        defaultValue={
                                                                            field.value
                                                                        }
                                                                        onChange={(
                                                                            country
                                                                        ) =>
                                                                            field.onChange(
                                                                                country.name
                                                                            )
                                                                        }
                                                                    />
                                                                </FormControl>
                                                            )}
                                                        />
                                                        <FormFieldWrapper
                                                            name={`memberGovernmentBenefits.${index}.name`}
                                                            control={
                                                                form.control
                                                            }
                                                            label="Name"
                                                            hiddenFields={
                                                                hiddenFields
                                                            }
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormControl>
                                                                    <GovernmentBenefitsCombobox
                                                                        {...field}
                                                                        disabled={isDisabled(
                                                                            field.name
                                                                        )}
                                                                        governmentBenefitsList={
                                                                            philippinesCards
                                                                        }
                                                                    />
                                                                </FormControl>
                                                            )}
                                                        />
                                                        <FormFieldWrapper
                                                            name={`memberGovernmentBenefits.${index}.value`}
                                                            control={
                                                                form.control
                                                            }
                                                            label="Value/ID Number"
                                                            hiddenFields={
                                                                hiddenFields
                                                            }
                                                            className="col-span-2"
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        id={
                                                                            field.name
                                                                        }
                                                                        placeholder="Value"
                                                                        disabled={isDisabled(
                                                                            field.name
                                                                        )}
                                                                        className="w-full"
                                                                    />
                                                                </FormControl>
                                                            )}
                                                        />
                                                        <FormFieldWrapper
                                                            name={`memberGovernmentBenefits.${index}.frontMediaId`}
                                                            control={
                                                                form.control
                                                            }
                                                            hiddenFields={
                                                                hiddenFields
                                                            }
                                                            className="col-span-2"
                                                            label="ID Front Photo"
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormControl>
                                                                    <SingleImageUploadField
                                                                        placeholder="Government ID Front Picture"
                                                                        {...field}
                                                                        mediaImage={form.getValues(
                                                                            `memberGovernmentBenefits.${index}.frontMediaResource`
                                                                        )}
                                                                        uploaderModalTitle="ID Front Photo"
                                                                        uploaderModalDescription="Upload your ID front photo"
                                                                        onChange={(
                                                                            mediaUploaded
                                                                        ) => {
                                                                            field.onChange(
                                                                                mediaUploaded?.id
                                                                            )
                                                                            form.setValue(
                                                                                `memberGovernmentBenefits.${index}.frontMediaResource`,
                                                                                mediaUploaded
                                                                            )
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                            )}
                                                        />
                                                        <FormFieldWrapper
                                                            name={`memberGovernmentBenefits.${index}.backMediaId`}
                                                            control={
                                                                form.control
                                                            }
                                                            label="ID Back Photo"
                                                            className="col-span-2"
                                                            hiddenFields={
                                                                hiddenFields
                                                            }
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormControl>
                                                                    <SingleImageUploadField
                                                                        placeholder="Government ID Back Picture"
                                                                        {...field}
                                                                        mediaImage={form.getValues(
                                                                            `memberGovernmentBenefits.${index}.backMediaResource`
                                                                        )}
                                                                        uploaderModalTitle="ID Back Photo"
                                                                        uploaderModalDescription="Upload your ID back photo"
                                                                        onChange={(
                                                                            mediaUploaded
                                                                        ) => {
                                                                            field.onChange(
                                                                                mediaUploaded?.id
                                                                            )
                                                                            form.setValue(
                                                                                `memberGovernmentBenefits.${index}.backMediaResource`,
                                                                                mediaUploaded
                                                                            )
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                            )}
                                                        />
                                                        <FormFieldWrapper
                                                            name={`memberGovernmentBenefits.${index}.description`}
                                                            control={
                                                                form.control
                                                            }
                                                            label="Description"
                                                            className="col-span-4"
                                                            hiddenFields={
                                                                hiddenFields
                                                            }
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormControl>
                                                                    <Textarea
                                                                        {...field}
                                                                        id={
                                                                            field.name
                                                                        }
                                                                        placeholder="Description"
                                                                        disabled={isDisabled(
                                                                            field.name
                                                                        )}
                                                                        className="min-h-0"
                                                                    />
                                                                </FormControl>
                                                            )}
                                                        />
                                                        <Button
                                                            size="icon"
                                                            variant="secondary"
                                                            type="button"
                                                            onClick={() =>
                                                                removeGovtBenefit(
                                                                    index
                                                                )
                                                            }
                                                            disabled={isDisabled(
                                                                'memberGovernmentBenefits'
                                                            )}
                                                            className="absolute right-2 top-2 size-fit self-center rounded-full p-1"
                                                        >
                                                            <XIcon className="size-4" />
                                                        </Button>
                                                    </div>
                                                )
                                            )}
                                        </fieldset>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            type="button"
                                            onClick={() =>
                                                addGovtBenefit({
                                                    country: '',
                                                    name: '',
                                                    description: '',
                                                    value: '',
                                                    frontMediaId: undefined,
                                                    backMediaId: undefined,
                                                })
                                            }
                                            disabled={isDisabled(
                                                'memberGovernmentBenefits'
                                            )}
                                        >
                                            <PlusIcon className="mr-2" />
                                            Add Government Benefit
                                        </Button>
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}

                    {step === 2 && (
                        <>
                            <FormFieldWrapper
                                name="memberIncome"
                                label="Member Income"
                                control={form.control}
                                hiddenFields={hiddenFields}
                                render={() => (
                                    <FormItem className="col-span-1 space-y-2">
                                        <Separator />
                                        <fieldset
                                            disabled={isDisabled(
                                                'memberIncome'
                                            )}
                                            className="grid gap-4"
                                        >
                                            {incomeFields.map(
                                                (incomeField, index) => (
                                                    <div
                                                        key={incomeField.id}
                                                        className="relative flex w-full flex-col gap-4 md:flex-row"
                                                    >
                                                        <FormFieldWrapper
                                                            control={
                                                                form.control
                                                            }
                                                            name={`memberIncome.${index}.name`}
                                                            label="Name *"
                                                            hiddenFields={
                                                                hiddenFields
                                                            }
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        id={
                                                                            field.name
                                                                        }
                                                                        placeholder="Income Name"
                                                                        disabled={isDisabled(
                                                                            field.name
                                                                        )}
                                                                        className="w-full"
                                                                    />
                                                                </FormControl>
                                                            )}
                                                        />
                                                        <FormFieldWrapper
                                                            control={
                                                                form.control
                                                            }
                                                            name={`memberIncome.${index}.amount`}
                                                            label="Amount *"
                                                            hiddenFields={
                                                                hiddenFields
                                                            }
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        id={
                                                                            field.name
                                                                        }
                                                                        placeholder="0"
                                                                        disabled={isDisabled(
                                                                            field.name
                                                                        )}
                                                                        className="w-full"
                                                                        type="number"
                                                                    />
                                                                </FormControl>
                                                            )}
                                                        />
                                                        <FormFieldWrapper
                                                            control={
                                                                form.control
                                                            }
                                                            name={`memberIncome.${index}.date`}
                                                            label="Date *"
                                                            hiddenFields={
                                                                hiddenFields
                                                            }
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        id={
                                                                            field.name
                                                                        }
                                                                        placeholder="YYYY-MM-DD"
                                                                        disabled={isDisabled(
                                                                            field.name
                                                                        )}
                                                                        className="w-full"
                                                                        type="date"
                                                                    />
                                                                </FormControl>
                                                            )}
                                                        />
                                                        <FormFieldWrapper
                                                            control={
                                                                form.control
                                                            }
                                                            name={`memberIncome.${index}.description`}
                                                            label="Description *"
                                                            hiddenFields={
                                                                hiddenFields
                                                            }
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormControl>
                                                                    <Textarea
                                                                        {...field}
                                                                        id={
                                                                            field.name
                                                                        }
                                                                        placeholder="Description"
                                                                        className="min-h-0"
                                                                        disabled={isDisabled(
                                                                            field.name
                                                                        )}
                                                                    />
                                                                </FormControl>
                                                            )}
                                                        />
                                                        <Button
                                                            size="icon"
                                                            variant="secondary"
                                                            type="button"
                                                            onClick={() =>
                                                                removeIncome(
                                                                    index
                                                                )
                                                            }
                                                            disabled={isDisabled(
                                                                'memberIncome'
                                                            )}
                                                            className="absolute right-0 top-0 size-fit self-center rounded-full p-1"
                                                        >
                                                            <XIcon className="size-4" />
                                                        </Button>
                                                    </div>
                                                )
                                            )}
                                        </fieldset>
                                        <Button
                                            size="sm"
                                            type="button"
                                            variant="secondary"
                                            onClick={() =>
                                                addIncome({
                                                    name: '',
                                                    amount: 0,
                                                    date: '',
                                                    description: '',
                                                })
                                            }
                                            disabled={isDisabled(
                                                'memberIncome'
                                            )}
                                        >
                                            <PlusIcon className="mr-2" />
                                            Add Income
                                        </Button>
                                    </FormItem>
                                )}
                            />
                            <FormFieldWrapper
                                name="memberAssets"
                                control={form.control}
                                label="Member Assets"
                                hiddenFields={hiddenFields}
                                render={() => (
                                    <FormItem className="col-span-1 space-y-2">
                                        <Separator />
                                        <fieldset
                                            disabled={isDisabled(
                                                'memberAssets'
                                            )}
                                            className="grid gap-4"
                                        >
                                            {memberAssetsFields.map(
                                                (assetField, index) => (
                                                    <div
                                                        key={assetField.id}
                                                        className="relative flex w-full flex-col gap-4 md:flex-row"
                                                    >
                                                        <FormFieldWrapper
                                                            control={
                                                                form.control
                                                            }
                                                            name={`memberAssets.${index}.name`}
                                                            label="Name"
                                                            hiddenFields={
                                                                hiddenFields
                                                            }
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        id={
                                                                            field.name
                                                                        }
                                                                        placeholder="Name"
                                                                        disabled={isDisabled(
                                                                            field.name
                                                                        )}
                                                                        className="w-full"
                                                                    />
                                                                </FormControl>
                                                            )}
                                                        />
                                                        <FormFieldWrapper
                                                            control={
                                                                form.control
                                                            }
                                                            name={`memberAssets.${index}.entryDate`}
                                                            label="Entry Date"
                                                            hiddenFields={
                                                                hiddenFields
                                                            }
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        id={
                                                                            field.name
                                                                        }
                                                                        placeholder="Entry Date"
                                                                        disabled={isDisabled(
                                                                            field.name
                                                                        )}
                                                                        className="w-full"
                                                                        type="date"
                                                                    />
                                                                </FormControl>
                                                            )}
                                                        />
                                                        <FormFieldWrapper
                                                            control={
                                                                form.control
                                                            }
                                                            name={`memberAssets.${index}.description`}
                                                            label="Description"
                                                            hiddenFields={
                                                                hiddenFields
                                                            }
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormControl>
                                                                    <Textarea
                                                                        {...field}
                                                                        id={
                                                                            field.name
                                                                        }
                                                                        disabled={isDisabled(
                                                                            field.name
                                                                        )}
                                                                        className="min-h-0"
                                                                    />
                                                                </FormControl>
                                                            )}
                                                        />
                                                        <Button
                                                            size="icon"
                                                            type="button"
                                                            variant="secondary"
                                                            onClick={() =>
                                                                removeAsset(
                                                                    index
                                                                )
                                                            }
                                                            disabled={isDisabled(
                                                                'memberAssets'
                                                            )}
                                                            className="absolute right-0 top-0 size-fit self-center rounded-full p-1"
                                                        >
                                                            <XIcon className="size-4" />
                                                        </Button>
                                                    </div>
                                                )
                                            )}
                                        </fieldset>
                                        <Button
                                            size="sm"
                                            type="button"
                                            variant="secondary"
                                            onClick={() =>
                                                addAsset({
                                                    entryDate: '',
                                                    description: '',
                                                    name: '',
                                                })
                                            }
                                            disabled={isDisabled(
                                                'memberAssets'
                                            )}
                                        >
                                            <PlusIcon className="mr-2" />
                                            Add Asset
                                        </Button>
                                    </FormItem>
                                )}
                            />
                            <FormFieldWrapper
                                name="memberExpenses"
                                control={form.control}
                                label="Member Expenses"
                                hiddenFields={hiddenFields}
                                render={() => (
                                    <FormItem className="col-span-1 mt-8 space-y-2">
                                        <Separator />
                                        <fieldset
                                            disabled={isDisabled(
                                                'memberExpenses'
                                            )}
                                            className="grid gap-4"
                                        >
                                            {memberExpensesFields.map(
                                                (expenseField, index) => (
                                                    <div
                                                        key={expenseField.id}
                                                        className="relative flex w-full flex-col gap-4 md:flex-row"
                                                    >
                                                        <FormFieldWrapper
                                                            control={
                                                                form.control
                                                            }
                                                            name={`memberExpenses.${index}.name`}
                                                            label="Name"
                                                            hiddenFields={
                                                                hiddenFields
                                                            }
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        id={
                                                                            field.name
                                                                        }
                                                                        placeholder="Name"
                                                                        disabled={isDisabled(
                                                                            field.name
                                                                        )}
                                                                        className="w-full"
                                                                    />
                                                                </FormControl>
                                                            )}
                                                        />
                                                        <FormFieldWrapper
                                                            control={
                                                                form.control
                                                            }
                                                            name={`memberExpenses.${index}.date`}
                                                            label="Date"
                                                            hiddenFields={
                                                                hiddenFields
                                                            }
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        id={
                                                                            field.name
                                                                        }
                                                                        type="date"
                                                                        placeholder="Date"
                                                                        disabled={isDisabled(
                                                                            field.name
                                                                        )}
                                                                        className="w-full"
                                                                    />
                                                                </FormControl>
                                                            )}
                                                        />
                                                        <FormFieldWrapper
                                                            control={
                                                                form.control
                                                            }
                                                            name={`memberExpenses.${index}.amount`}
                                                            label="Amount"
                                                            hiddenFields={
                                                                hiddenFields
                                                            }
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormControl>
                                                                    <Input
                                                                        {...field}
                                                                        id={
                                                                            field.name
                                                                        }
                                                                        type="number"
                                                                        placeholder="0"
                                                                        disabled={isDisabled(
                                                                            field.name
                                                                        )}
                                                                        className="w-full"
                                                                    />
                                                                </FormControl>
                                                            )}
                                                        />
                                                        <FormFieldWrapper
                                                            control={
                                                                form.control
                                                            }
                                                            name={`memberExpenses.${index}.description`}
                                                            label="Description"
                                                            hiddenFields={
                                                                hiddenFields
                                                            }
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormControl>
                                                                    <Textarea
                                                                        {...field}
                                                                        id={
                                                                            field.name
                                                                        }
                                                                        placeholder="Description"
                                                                        disabled={isDisabled(
                                                                            field.name
                                                                        )}
                                                                        className="min-h-0"
                                                                    />
                                                                </FormControl>
                                                            )}
                                                        />
                                                        <Button
                                                            size="icon"
                                                            type="button"
                                                            variant="secondary"
                                                            onClick={() =>
                                                                removeExpense(
                                                                    index
                                                                )
                                                            }
                                                            disabled={isDisabled(
                                                                'memberExpenses'
                                                            )}
                                                            className="absolute right-0 top-0 size-fit self-center rounded-full p-1"
                                                        >
                                                            <XIcon className="size-4" />
                                                        </Button>
                                                    </div>
                                                )
                                            )}
                                        </fieldset>
                                        <Button
                                            size="sm"
                                            type="button"
                                            variant="secondary"
                                            onClick={() =>
                                                addExpense({
                                                    name: '',
                                                    date: '',
                                                    amount: 0,
                                                    description: '',
                                                })
                                            }
                                            disabled={isDisabled(
                                                'memberExpenses'
                                            )}
                                        >
                                            <PlusIcon className="mr-2" />
                                            Add Expense
                                        </Button>
                                    </FormItem>
                                )}
                            />
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <FormFieldWrapper
                                name="memberRelativeAccounts"
                                control={form.control}
                                label="Member Relative Accounts"
                                hiddenFields={hiddenFields}
                                render={() => (
                                    <FormItem className="col-span-1 mt-8 space-y-2">
                                        <Separator />
                                        <fieldset
                                            disabled={isDisabled(
                                                'memberRelativeAccounts'
                                            )}
                                            className="grid gap-4"
                                        >
                                            {relativeFields.map(
                                                (relField, index) => (
                                                    <div
                                                        key={relField.id}
                                                        className="relative flex w-full flex-col gap-4 md:flex-row"
                                                    >
                                                        <FormFieldWrapper
                                                            control={
                                                                form.control
                                                            }
                                                            name={`memberRelativeAccounts.${index}.relativeProfileMemberId`}
                                                            label="Relative Member"
                                                            hiddenFields={
                                                                hiddenFields
                                                            }
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormControl>
                                                                    <MemberPicker
                                                                        {...field}
                                                                        onSelect={(
                                                                            member
                                                                        ) => {
                                                                            if (
                                                                                !member.memberProfile
                                                                            )
                                                                                return toast.warning(
                                                                                    "Can't select a member that has no profile yet."
                                                                                )
                                                                            field.onChange(
                                                                                member
                                                                                    .memberProfile
                                                                                    .id
                                                                            )
                                                                        }}
                                                                        placeholder="Select relative member"
                                                                        disabled={isDisabled(
                                                                            field.name
                                                                        )}
                                                                    />
                                                                </FormControl>
                                                            )}
                                                        />
                                                        <FormFieldWrapper
                                                            control={
                                                                form.control
                                                            }
                                                            name={`memberRelativeAccounts.${index}.familyRelationship`}
                                                            label="Family Relationship"
                                                            hiddenFields={
                                                                hiddenFields
                                                            }
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormControl>
                                                                    <RelationshipCombobox
                                                                        {...field}
                                                                        id={
                                                                            field.name
                                                                        }
                                                                        value={
                                                                            field.value as unknown as TRelationship
                                                                        }
                                                                        placeholder="e.g. Spouse, Sibling"
                                                                        disabled={isDisabled(
                                                                            field.name
                                                                        )}
                                                                        className="w-full"
                                                                    />
                                                                </FormControl>
                                                            )}
                                                        />
                                                        <FormFieldWrapper
                                                            control={
                                                                form.control
                                                            }
                                                            name={`memberRelativeAccounts.${index}.description`}
                                                            label="Description"
                                                            hiddenFields={
                                                                hiddenFields
                                                            }
                                                            render={({
                                                                field,
                                                            }) => (
                                                                <FormControl>
                                                                    <Textarea
                                                                        {...field}
                                                                        id={
                                                                            field.name
                                                                        }
                                                                        placeholder="Additional details"
                                                                        disabled={isDisabled(
                                                                            field.name
                                                                        )}
                                                                        className="min-h-0"
                                                                    />
                                                                </FormControl>
                                                            )}
                                                        />
                                                        <Button
                                                            size="icon"
                                                            type="button"
                                                            variant="secondary"
                                                            onClick={() =>
                                                                removeRelative(
                                                                    index
                                                                )
                                                            }
                                                            disabled={isDisabled(
                                                                'memberRelativeAccounts'
                                                            )}
                                                            className="absolute right-0 top-0 size-fit self-center rounded-full p-1"
                                                        >
                                                            <XIcon className="size-4" />
                                                        </Button>
                                                    </div>
                                                )
                                            )}
                                        </fieldset>
                                        <Button
                                            size="sm"
                                            type="button"
                                            variant="secondary"
                                            onClick={() =>
                                                addRelative({
                                                    relativeProfileMemberId: '',
                                                    familyRelationship: '',
                                                    description: '',
                                                })
                                            }
                                            disabled={isDisabled(
                                                'memberRelativeAccounts'
                                            )}
                                        >
                                            <PlusIcon className="mr-2" />
                                            Add Relative
                                        </Button>
                                    </FormItem>
                                )}
                            />
                            <FormFieldWrapper
                                name="memberJointAccounts"
                                control={form.control}
                                label="Member Joint Accounts"
                                hiddenFields={hiddenFields}
                                render={() => (
                                    <FormItem className="col-span-1 space-y-2">
                                        <Separator />
                                        <fieldset
                                            disabled={isDisabled(
                                                'memberJointAccounts'
                                            )}
                                            className="grid gap-4"
                                        >
                                            {jointFields.map(
                                                (jointField, index) => (
                                                    <div
                                                        key={jointField.id}
                                                        className="relative flex w-full flex-col items-start gap-4 border-b pb-2 md:flex-row"
                                                    >
                                                        <div className="grid grow gap-x-4 gap-y-2 sm:grid-cols-2">
                                                            <div className="col-span-2 grid gap-4 sm:grid-cols-4">
                                                                <FormFieldWrapper
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name={`memberJointAccounts.${index}.firstName`}
                                                                    label="First Name"
                                                                    hiddenFields={
                                                                        hiddenFields
                                                                    }
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormControl>
                                                                            <Input
                                                                                {...field}
                                                                                id={
                                                                                    field.name
                                                                                }
                                                                                placeholder="e.g. John"
                                                                                disabled={isDisabled(
                                                                                    field.name
                                                                                )}
                                                                                className="w-full"
                                                                            />
                                                                        </FormControl>
                                                                    )}
                                                                />
                                                                <FormFieldWrapper
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name={`memberJointAccounts.${index}.lastName`}
                                                                    label="Last Name"
                                                                    hiddenFields={
                                                                        hiddenFields
                                                                    }
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormControl>
                                                                            <Input
                                                                                {...field}
                                                                                id={
                                                                                    field.name
                                                                                }
                                                                                placeholder="e.g. Doe"
                                                                                disabled={isDisabled(
                                                                                    field.name
                                                                                )}
                                                                                className="w-full"
                                                                            />
                                                                        </FormControl>
                                                                    )}
                                                                />
                                                                <FormFieldWrapper
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name={`memberJointAccounts.${index}.middleName`}
                                                                    label="Middle Name"
                                                                    hiddenFields={
                                                                        hiddenFields
                                                                    }
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormControl>
                                                                            <Input
                                                                                {...field}
                                                                                id={
                                                                                    field.name
                                                                                }
                                                                                placeholder="e.g. M."
                                                                                disabled={isDisabled(
                                                                                    field.name
                                                                                )}
                                                                                className="w-full"
                                                                            />
                                                                        </FormControl>
                                                                    )}
                                                                />
                                                                <FormFieldWrapper
                                                                    control={
                                                                        form.control
                                                                    }
                                                                    name={`memberJointAccounts.${index}.familyRelationship`}
                                                                    label="Family Relationship"
                                                                    hiddenFields={
                                                                        hiddenFields
                                                                    }
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <FormControl>
                                                                            <RelationshipCombobox
                                                                                {...field}
                                                                                id={
                                                                                    field.name
                                                                                }
                                                                                value={
                                                                                    field.value as unknown as TRelationship
                                                                                }
                                                                                placeholder="e.g. Cousin, Spouse"
                                                                                disabled={isDisabled(
                                                                                    field.name
                                                                                )}
                                                                                className="w-full"
                                                                            />
                                                                        </FormControl>
                                                                    )}
                                                                />
                                                            </div>
                                                            <FormFieldWrapper
                                                                name={`memberJointAccounts.${index}.mediaId`}
                                                                control={
                                                                    form.control
                                                                }
                                                                label="Picture"
                                                                className="col-span-1"
                                                                hiddenFields={
                                                                    hiddenFields
                                                                }
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormControl>
                                                                        <SingleImageUploadField
                                                                            placeholder="Upload Person Picture"
                                                                            {...field}
                                                                            mediaImage={form.getValues(
                                                                                `memberJointAccounts.${index}.media`
                                                                            )}
                                                                            uploaderModalTitle="Upload Person Photo"
                                                                            uploaderModalDescription="Upload a clear photo of the person linked to this joint account for identification purposes"
                                                                            onChange={(
                                                                                mediaUploaded
                                                                            ) => {
                                                                                field.onChange(
                                                                                    mediaUploaded?.id
                                                                                )
                                                                                form.setValue(
                                                                                    `memberJointAccounts.${index}.media`,
                                                                                    mediaUploaded
                                                                                )
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                )}
                                                            />
                                                            <FormFieldWrapper
                                                                name={`memberJointAccounts.${index}.signatureMediaId`}
                                                                control={
                                                                    form.control
                                                                }
                                                                label="Signature"
                                                                className="col-span-1"
                                                                hiddenFields={
                                                                    hiddenFields
                                                                }
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormControl>
                                                                        <SignatureUploadField
                                                                            placeholder="Upload Signature Photo"
                                                                            {...field}
                                                                            mediaImage={form.getValues(
                                                                                `memberJointAccounts.${index}.signatureMedia`
                                                                            )}
                                                                            DisplayIcon={
                                                                                SignatureLightIcon
                                                                            }
                                                                            onChange={(
                                                                                mediaUploaded
                                                                            ) => {
                                                                                field.onChange(
                                                                                    mediaUploaded?.id
                                                                                )
                                                                                form.setValue(
                                                                                    `memberJointAccounts.${index}.signatureMedia`,
                                                                                    mediaUploaded
                                                                                )
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                )}
                                                            />
                                                            <FormFieldWrapper
                                                                control={
                                                                    form.control
                                                                }
                                                                name={`memberJointAccounts.${index}.description`}
                                                                label="Description"
                                                                className="col-span-2"
                                                                hiddenFields={
                                                                    hiddenFields
                                                                }
                                                                render={({
                                                                    field,
                                                                }) => (
                                                                    <FormControl>
                                                                        <TextEditor
                                                                            {...field}
                                                                            placeholder="Description"
                                                                            disabled={isDisabled(
                                                                                field.name
                                                                            )}
                                                                            className="min-h-0 w-full"
                                                                        />
                                                                    </FormControl>
                                                                )}
                                                            />
                                                            <Button
                                                                size="sm"
                                                                type="button"
                                                                variant="secondary"
                                                                onClick={() =>
                                                                    removeJoint(
                                                                        index
                                                                    )
                                                                }
                                                                disabled={isDisabled(
                                                                    'memberJointAccounts'
                                                                )}
                                                                className="col-span-2 block p-2 sm:hidden"
                                                            >
                                                                Remove
                                                            </Button>
                                                        </div>
                                                        <Button
                                                            size="icon"
                                                            type="button"
                                                            variant="secondary"
                                                            onClick={() =>
                                                                removeJoint(
                                                                    index
                                                                )
                                                            }
                                                            disabled={isDisabled(
                                                                'memberJointAccounts'
                                                            )}
                                                            className="absolute right-0 top-0 hidden size-fit self-center rounded-full p-1 sm:block"
                                                        >
                                                            <XIcon className="size-4" />
                                                        </Button>
                                                    </div>
                                                )
                                            )}
                                        </fieldset>
                                        <Button
                                            size="sm"
                                            type="button"
                                            variant="secondary"
                                            onClick={() =>
                                                addJoint({
                                                    firstName: '',
                                                    lastName: '',
                                                    middleName: '',
                                                    familyRelationship: '',
                                                    description: '',
                                                })
                                            }
                                            disabled={isDisabled(
                                                'memberJointAccounts'
                                            )}
                                        >
                                            <PlusIcon className="mr-2" />
                                            Add Joint Account
                                        </Button>
                                    </FormItem>
                                )}
                            />
                        </>
                    )}

                    {step === 4 && (
                        <>
                            <div className="col-span-1 space-y-4">
                                <legend>Notes & Description</legend>
                                <Separator />
                                <fieldset className="grid gap-x-2 sm:grid-cols-2">
                                    <FormFieldWrapper
                                        name="notes"
                                        label="Notes *"
                                        control={form.control}
                                        hiddenFields={hiddenFields}
                                        render={({ field }) => (
                                            <FormControl>
                                                <TextEditor
                                                    {...field}
                                                    placeholder="Enter Notes"
                                                    className=""
                                                    textEditorClassName="!max-w-none"
                                                    disabled={isDisabled(
                                                        field.name
                                                    )}
                                                />
                                            </FormControl>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        name="description"
                                        control={form.control}
                                        label="Description *"
                                        hiddenFields={hiddenFields}
                                        render={({ field }) => (
                                            <FormControl>
                                                <TextEditor
                                                    {...field}
                                                    placeholder="Enter Description"
                                                    disabled={isDisabled(
                                                        field.name
                                                    )}
                                                />
                                            </FormControl>
                                        )}
                                    />
                                </fieldset>
                            </div>
                            <FormFieldWrapper
                                name="memberDescriptions"
                                control={form.control}
                                label="Descriptions"
                                hiddenFields={hiddenFields}
                                render={() => (
                                    <FormItem className="col-span-1 space-y-2">
                                        <Separator />
                                        <fieldset
                                            disabled={isDisabled(
                                                'memberDescriptions'
                                            )}
                                            className="grid gap-4 sm:grid-cols-2"
                                        >
                                            {fields.map((field, index) => (
                                                <div
                                                    key={field.id}
                                                    className="relative space-y-2 rounded-lg bg-popover p-4"
                                                >
                                                    <FormFieldWrapper
                                                        control={form.control}
                                                        name={`memberDescriptions.${index}.name`}
                                                        label="Name"
                                                        hiddenFields={
                                                            hiddenFields
                                                        }
                                                        render={({ field }) => (
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    id={
                                                                        field.name
                                                                    }
                                                                    placeholder="Description Name"
                                                                    disabled={isDisabled(
                                                                        field.name
                                                                    )}
                                                                    className="w-full"
                                                                />
                                                            </FormControl>
                                                        )}
                                                    />
                                                    <FormFieldWrapper
                                                        control={form.control}
                                                        name={`memberDescriptions.${index}.description`}
                                                        label="Description"
                                                        hiddenFields={
                                                            hiddenFields
                                                        }
                                                        render={({ field }) => (
                                                            <FormControl>
                                                                <TextEditor
                                                                    {...field}
                                                                    placeholder="Description Content"
                                                                    disabled={isDisabled(
                                                                        field.name
                                                                    )}
                                                                    className="min-h-0"
                                                                />
                                                            </FormControl>
                                                        )}
                                                    />
                                                    <Button
                                                        size="icon"
                                                        type="button"
                                                        variant="secondary"
                                                        onClick={() =>
                                                            remove(index)
                                                        }
                                                        disabled={isDisabled(
                                                            'memberDescriptions'
                                                        )}
                                                        className="absolute right-2 top-0 size-fit rounded-full p-2"
                                                    >
                                                        <TrashIcon className="size-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </fieldset>
                                        <Button
                                            size="sm"
                                            type="button"
                                            variant="secondary"
                                            onClick={() =>
                                                append({
                                                    name: '',
                                                    description: '',
                                                })
                                            }
                                            disabled={isDisabled(
                                                'memberDescriptions'
                                            )}
                                        >
                                            <PlusIcon className="mr-2" /> Add
                                            Description
                                        </Button>
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                </fieldset>

                <FormErrorMessage errorMessage={error} />
                <div>
                    <Separator className="my-2 sm:my-4" />
                    <div className="flex items-center justify-end gap-x-2">
                        <Button
                            type="button"
                            variant="ghost"
                            disabled={readOnly}
                            onClick={() => {
                                onOpen({
                                    title: 'Reset Form',
                                    description:
                                        'Are you sure to reset the form fields? Any changes will be lost.',
                                    onConfirm: () => {
                                        form.reset()
                                        setStep(0)
                                    },
                                })
                            }}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            Reset
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={step === 0}
                            onClick={() =>
                                setStep((prev) => (prev < 1 ? prev : prev - 1))
                            }
                        >
                            <ChevronLeftIcon /> Previous
                        </Button>
                        <Button
                            type="button"
                            disabled={step === Steps.length - 1}
                            variant="secondary"
                            onClick={onNext}
                        >
                            Next <ChevronRightIcon />
                        </Button>
                        <Button
                            type="submit"
                            disabled={isCreating || step !== Steps.length - 1}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isLoading ? (
                                <LoadingSpinner />
                            ) : defaultValues?.id ? (
                                'Save'
                            ) : (
                                'Create'
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export const MemberProfileCreateUpdateFormModal = ({
    title = 'Member Application Form',
    description = 'Fill out the form to setup member profile.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IMemberProfileCreateUpdateFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('!max-w-6xl', className)}
            {...props}
        >
            <MemberProfileCreateUpdateForm {...formProps} />
        </Modal>
    )
}

export default MemberProfileCreateUpdateForm
