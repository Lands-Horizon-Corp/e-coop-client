import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'

import { zodResolver } from '@hookform/resolvers/zod'

import { orgBannerList } from '@/assets/pre-organization-banner-background'
import { base64ImagetoFile } from '@/helpers/picture-crop-helper'
import { cn } from '@/helpers/tw-utils'
import { useUploadMedia } from '@/modules/media'
import {
    ICreateOrganizationResponse,
    OrganizationSchema,
    TOrganizationFormValues,
} from '@/modules/organization'
import { useCreateOrganization } from '@/modules/organization'
import { IOrganizationCategoryRequest } from '@/modules/organization-category'
import SubscriptionPlanPicker from '@/modules/subscription-plan/components/subscription-plan/subscription'
import UserAvatar from '@/modules/user/components/user-avatar'
import { useCategoryStore } from '@/store/onboarding/category-store'
import { PlusIcon, ReplaceIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { GradientBackground } from '@/components/gradient-background/gradient-background'
import {
    LoadingSpinnerIcon,
    NextIcon,
    UnavailableIcon,
    VerifiedPatchIcon,
} from '@/components/icons'
import { SinglePictureUploadModal } from '@/components/single-image-uploader/single-picture-uploader'
import TextEditor from '@/components/text-editor'
import ActionTooltip from '@/components/tooltips/action-tooltip'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import FileUploader from '@/components/ui/file-uploader'
import { Form, FormControl } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import { PlainTextEditor } from '@/components/ui/text-editor'

import { useAlertBeforeClosing } from '@/hooks/use-alert-before-closing'
import { useLocationInfo } from '@/hooks/use-location-info'

import { TEntityId } from '@/types'

import CategoriesItem from '../category-pickers/categories-item'

const steps = [
    {
        title: 'Organization Details',
        description: 'Add your organization details',
    },
    {
        title: 'Choose your plan',
        description: 'Select a subscription plan',
    },
    {
        title: 'Billing',
        description: 'Add a payment',
    },
]

const OrganizationForm = () => {
    const { countryCode } = useLocationInfo()

    const [activeStep, setActiveStep] = useState(0)
    const [openImagePicker, setOpenImagePicker] = useState(false)

    const { selectedCategories, clearCategories, setOnOpenCategoryPicker } =
        useCategoryStore()

    const navigate = useNavigate()

    const form = useForm<TOrganizationFormValues>({
        resolver: zodResolver(OrganizationSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            email: '',
            contact_number: '',
            address: '',
            description: '',
            subscription_plan_id: '',
            media_id: '',
            cover_media_id: '',
        },
    })

    const {
        error,
        isPending: isCreating,
        mutateAsync: createOrganization,
    } = useCreateOrganization({
        options: {
            onSuccess: (data: ICreateOrganizationResponse) => {
                const organizationId = data.organization.id

                navigate({
                    to: `/onboarding/create-branch/${organizationId}`,
                })

                clearCategories()
            },
            onError: (error) => {
                console.error('Error creating organization:', error)
                toast.error('Failed to create organization. Please try again.')
            },
        },
    })

    const { isPending: isUploadingPhoto, mutateAsync: uploadPhoto } =
        useUploadMedia({
            options: {
                onError: (error) => {
                    console.error('Error uploading photo:', error)
                    toast.error('Failed to upload photo. Please try again.')
                },
                onSuccess: (data) => {
                    toast.success('Photo uploaded successfully!')
                    return data
                },
            },
        })

    const handleSubmit = async (data: TOrganizationFormValues) => {
        let logoMedia = ''
        let CoverMedia = ''

        if (data.media_id || data.cover_media_id) {
            const media = base64ImagetoFile(
                data.media_id,
                `bg-banner.jpg`
            ) as File
            const uploadedPhoto = await uploadPhoto({ file: media })
            if (data.cover_media_id) {
                const coverMeddia = base64ImagetoFile(
                    data.cover_media_id,
                    `bg-banner.jpg`
                ) as File
                const uploadedCoverPhoto = await uploadPhoto({
                    file: coverMeddia,
                })
                CoverMedia = uploadedCoverPhoto.id
            }
            logoMedia = uploadedPhoto.id
        }

        const requestData = {
            ...data,
            media_id: logoMedia,
            cover_media_id: CoverMedia,
            organization_categories: selectedCategories.map((catItem) => ({
                category_id: catItem.id,
            })) as IOrganizationCategoryRequest[],
        }

        await createOrganization(requestData)
    }

    const handleGoBack = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault()
        if (activeStep <= 0) return
        setActiveStep((prev) => prev - 1)
    }

    const isFinalStep = activeStep === steps.length - 1

    const handleNextStep = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault()
        if (isFinalStep) return
        const isActiveStep = activeStep === 0

        const isValid = await form.trigger(
            isActiveStep
                ? ['name', 'media_id', 'email']
                : 'subscription_plan_id'
        )

        if (!isValid) {
            const fieldName = isActiveStep ? 'name' : 'subscription_plan_id'
            const error = form.formState.errors[fieldName]

            if (error) {
                toast.error(error.message)
            }
            return
        }

        setActiveStep((prev) => prev + 1)
    }

    const HeaderTitleDisplay =
        form.watch('name') === ''
            ? 'Sample Organization Title'
            : form.watch('name')

    const DescriptionDisplay =
        form.watch('description') === ''
            ? 'This is sample description for your banner'
            : form.watch('description')

    const isDirty = Object.keys(form.formState.dirtyFields).length > 0

    useAlertBeforeClosing(isDirty)
    console.log(form.formState.errors)
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <Card
                    className={cn(
                        'min-h-full w-full min-w-full rounded-none border-none bg-transparent'
                    )}
                >
                    <CardHeader className="text-lg">
                        <CardTitle>{steps[activeStep].title}</CardTitle>
                        <CardDescription>
                            {steps[activeStep].description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent
                        className={cn('w-full min-w-full bg-transparent')}
                    >
                        {activeStep === 0 && (
                            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-4">
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Upload Organization Logo"
                                    name="media_id"
                                    className="col-span-4"
                                    render={({ field }) => {
                                        return (
                                            <FormControl>
                                                <div className="relative mx-auto size-fit">
                                                    <SinglePictureUploadModal
                                                        open={openImagePicker}
                                                        onOpenChange={
                                                            setOpenImagePicker
                                                        }
                                                        onPhotoChoose={(
                                                            newImage
                                                        ) => {
                                                            field.onChange(
                                                                newImage
                                                            )
                                                        }}
                                                        defaultImage={
                                                            field.value ?? ''
                                                        }
                                                    />

                                                    <UserAvatar
                                                        fallback={`-`}
                                                        fallbackClassName="!text-3xl"
                                                        src={field.value ?? ''}
                                                        className={cn(
                                                            'size-36 !rounded-none'
                                                        )}
                                                    />
                                                    <ActionTooltip
                                                        tooltipContent={
                                                            field.value
                                                                ? 'Replace'
                                                                : 'Insert'
                                                        }
                                                        align="center"
                                                        side="right"
                                                    >
                                                        <Button
                                                            variant="secondary"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                setOpenImagePicker(
                                                                    true
                                                                )
                                                            }}
                                                            className="absolute bottom-2 right-2 size-fit w-fit rounded-full border border-transparent p-1"
                                                        >
                                                            {field.value ? (
                                                                <ReplaceIcon />
                                                            ) : (
                                                                <PlusIcon />
                                                            )}
                                                        </Button>
                                                    </ActionTooltip>
                                                </div>
                                            </FormControl>
                                        )
                                    }}
                                />
                                <FormFieldWrapper
                                    className="md:col-span-4"
                                    control={form.control}
                                    name="cover_media_id"
                                    label="Upload Banner Background"
                                    render={({ field }) => {
                                        const hasNoImageSelected =
                                            form.watch('media_id') === ''
                                        return (
                                            <div>
                                                <GradientBackground
                                                    className="w-full"
                                                    mediaUrl={field.value}
                                                >
                                                    <div className="flex min-h-32 cursor-pointer items-center justify-between gap-x-2 rounded-2xl border-0 p-4 hover:bg-secondary/50 hover:no-underline">
                                                        <img
                                                            style={{
                                                                opacity:
                                                                    hasNoImageSelected
                                                                        ? 0.1
                                                                        : 1,
                                                            }}
                                                            className={`size-24 rounded-lg`}
                                                            src={
                                                                form.watch(
                                                                    'media_id'
                                                                ) ||
                                                                orgBannerList[0]
                                                            }
                                                        />
                                                        <div className="flex grow flex-col">
                                                            <p className="touch-pan-up text-start text-2xl font-bold">
                                                                {
                                                                    HeaderTitleDisplay
                                                                }
                                                            </p>
                                                            <PlainTextEditor
                                                                className="overflow max-h-7 min-w-96 max-w-[30rem] overflow-y-hidden"
                                                                content={
                                                                    DescriptionDisplay
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </GradientBackground>
                                                <div className="flex w-full justify-end py-2">
                                                    <FileUploader
                                                        maxFiles={1}
                                                        buttonOnly
                                                        accept={{
                                                            'image/png': [
                                                                '.png',
                                                            ],
                                                            'image/jpeg': [
                                                                '.jpg',
                                                                '.jpeg',
                                                            ],
                                                        }}
                                                        selectedPhotos={(
                                                            selectedPhoto
                                                        ) => {
                                                            field.onChange(
                                                                selectedPhoto
                                                            )
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    }}
                                />
                                <div className="col-span-4 flex w-full items-center gap-x-2">
                                    <CategoriesItem className="grow" />
                                    <Button
                                        className="grid-cols-1"
                                        variant={'ghost'}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            setOnOpenCategoryPicker(true)
                                        }}
                                    >
                                        Edit Categories
                                    </Button>
                                </div>
                                <FormFieldWrapper
                                    control={form.control}
                                    name="name"
                                    label="Organization Name"
                                    className="col-span-3"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id={field.name}
                                            autoComplete="org-name"
                                            placeholder="enter organization name"
                                        />
                                    )}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    name="email"
                                    label="Organization Email"
                                    className="col-span-1"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id={field.name}
                                            autoComplete="organization email"
                                            placeholder="enter email"
                                        />
                                    )}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    name="contact_number"
                                    label="Organization Contact Number"
                                    className="col-span-2"
                                    render={({
                                        field,
                                        fieldState: { invalid, error },
                                    }) => (
                                        <div className="relative flex flex-1 items-center gap-x-2">
                                            <VerifiedPatchIcon
                                                className={cn(
                                                    'absolute right-2 top-1/2 z-20 size-4 -translate-y-1/2 text-primary delay-300 duration-300 ease-in-out',
                                                    (invalid || error) &&
                                                        'text-destructive'
                                                )}
                                            />
                                            <PhoneInput
                                                {...field}
                                                className="w-full"
                                                defaultCountry={countryCode}
                                            />
                                        </div>
                                    )}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    name="address"
                                    label="Organization Address"
                                    className="col-span-2"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id={field.name}
                                            autoComplete="organization address"
                                            placeholder="enter organization address"
                                        />
                                    )}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Organization Description"
                                    name="description"
                                    className="col-span-4"
                                    render={({ field }) => {
                                        const { ref: _ref, ...rest } = field
                                        return (
                                            <FormControl>
                                                <TextEditor
                                                    {...rest}
                                                    className="w-full"
                                                    textEditorClassName="!max-w-none"
                                                    placeholder="Write some description about your Organization..."
                                                />
                                            </FormControl>
                                        )
                                    }}
                                />
                            </div>
                        )}
                        {activeStep === 1 && (
                            <FormFieldWrapper
                                control={form.control}
                                label="Organization Description"
                                name="subscription_plan_id"
                                className="col-span-4"
                                render={({ field }) => (
                                    <div className="flex flex-col gap-2">
                                        <SubscriptionPlanPicker
                                            value={field.value}
                                            onChange={(id: TEntityId) => {
                                                form.setValue(
                                                    'subscription_plan_id',
                                                    id
                                                )
                                                field.onChange(id)
                                            }}
                                        />
                                    </div>
                                )}
                            />
                        )}
                        {activeStep === 2 && (
                            <div className="flex min-h-[50vh] w-full min-w-[800px] flex-col items-center justify-center gap-2 gap-y-2 rounded-lg border">
                                <UnavailableIcon
                                    className="items-center"
                                    size={100}
                                />
                                <p className="items-center text-sm text-muted-foreground">
                                    Payment is currently unavailable, You may
                                    proceed to submission.
                                </p>
                                {/* Add your payment method selection logic here */}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <FormErrorMessage
                            errorMessage={error ? error.message : null}
                        />
                        <div className="flex w-full items-center justify-end gap-x-2">
                            <Button
                                variant="ghost"
                                onClick={(e) => {
                                    e.preventDefault()
                                    form.reset()
                                }}
                            >
                                reset
                            </Button>
                            <div className="flex items-center gap-x-2 text-card-foreground/70">
                                <span className="text-accent-foreground">
                                    {' '}
                                    {activeStep + 1}
                                </span>{' '}
                                of {steps.length}
                            </div>
                            <Button
                                variant="ghost"
                                onClick={handleGoBack}
                                disabled={activeStep === 0}
                            >
                                <NextIcon
                                    size={18}
                                    className="mr-2 rotate-180"
                                />
                                Go Back
                            </Button>

                            <Button
                                variant="ghost"
                                disabled={isFinalStep}
                                onClick={(e) => {
                                    handleNextStep(e)
                                }}
                            >
                                next step
                                <NextIcon size={18} className="ml-2" />
                            </Button>
                        </div>
                        {isFinalStep && (
                            <Button
                                type="submit"
                                disabled={
                                    !isFinalStep ||
                                    isCreating ||
                                    isUploadingPhoto
                                }
                                variant={isFinalStep ? 'default' : 'outline'}
                                className="w-full"
                            >
                                {isCreating ? (
                                    <LoadingSpinnerIcon
                                        size={18}
                                        className="mr-2 animate-spin"
                                    />
                                ) : (
                                    'Submit'
                                )}
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </form>
        </Form>
    )
}

export default OrganizationForm
