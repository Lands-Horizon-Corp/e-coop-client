import { PhoneInput } from '@/components/contact-input/contact-input'
import { GradientBackground } from '@/components/gradient-background/gradient-background'
import PlainTextEditor from '@/components/plain-text-editor'
import SubscriptionPlanPicker from '@/components/subscription-plan/subscription'
import TextEditor from '@/components/text-editor'
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

import { useSinglePictureUpload } from '@/hooks/api-hooks/use-media'
import { useCreateOrganization } from '@/hooks/api-hooks/use-organization'

import { IOrganizationCategoryRequest } from '@/types/lands-types/organization-category'
import { IUserOrganizationResponse, TEntityId } from '@/types'

import { useCategoryStore } from '@/store/onboarding/category-store'
import {
    Organization,
    OrganizationSchema,
} from '@/validations/form-validation/onboarding/create-organization-schema'

import {
    LoadingSpinnerIcon,
    NextIcon,
    UnavailableIcon,
    VerifiedPatchIcon,
} from '@/components/icons'

import { base64ImagetoFile } from '@/helpers'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { cn } from '@/lib'
import CategoriesItem from '@/components/category-pickers/categories-item'
import { toast } from 'sonner'

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
    const [activeStep, setActiveStep] = useState(0)
    const { selectedCategories, clearCategories, setOnOpenCategoryPicker } =
        useCategoryStore()

    const navigate = useNavigate()

    const form = useForm<Organization>({
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
        },
    })

    const {
        error,
        isPending: isLoading,
        mutateAsync: createOrganization,
    } = useCreateOrganization({
        onSuccess: (data: IUserOrganizationResponse) => {
            navigate({
                to: `/onboarding/create-branch/${data.user_organization.id}/${data.organization.id}`,
            })
            clearCategories()
        },
        onError: (error) => {
            console.error('Error creating organization:', error)
        },
    })

    const { isPending: isUploadingPhoto, mutateAsync: uploadPhoto } =
        useSinglePictureUpload({})

    const handleSubmit = async (data: Organization) => {
        let mediaId = ''

        if (data.media_id) {
            const uploadedPhoto = await uploadPhoto(
                base64ImagetoFile(data.media_id, `bg-banner.jpg`) as File
            )
            mediaId = uploadedPhoto.id
        }

        const requestData = {
            ...data,
            media_id: mediaId,
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

        const isValid = await form.trigger(
            activeStep === 0 ? 'name' : 'subscription_plan_id'
        )

        if (!isValid) {
            const fieldName = activeStep === 0 ? 'name' : 'subscription_plan_id'
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
                                    className="md:col-span-4"
                                    control={form.control}
                                    name="media_id"
                                    label="Upload Banner Background"
                                    render={({ field }) => (
                                        <div>
                                            <GradientBackground
                                                className="w-full"
                                                mediaUrl={field.value}
                                            >
                                                <div className="flex min-h-32 cursor-pointer items-center justify-between rounded-2xl border-0 p-4 hover:bg-secondary/50 hover:no-underline">
                                                    <div className="flex flex-col">
                                                        <p className="touch-pan-up text-start text-2xl font-bold">
                                                            {HeaderTitleDisplay}
                                                        </p>
                                                        <p className="text-start text-xs text-white/80">
                                                            <PlainTextEditor
                                                                className="overflow max-h-7 min-w-96 max-w-[30rem] overflow-y-hidden"
                                                                content={
                                                                    DescriptionDisplay
                                                                }
                                                            />
                                                        </p>
                                                    </div>
                                                </div>
                                            </GradientBackground>
                                            <div className="flex w-full justify-end py-2">
                                                <FileUploader
                                                    maxFiles={1}
                                                    buttonOnly
                                                    accept={{
                                                        'image/png': ['.png'],
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
                                    )}
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
                                                defaultCountry="PH"
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
                                    render={({ field }) => (
                                        <FormControl>
                                            <TextEditor
                                                {...field}
                                                className="w-full"
                                                textEditorClassName="!max-w-none"
                                                placeholder="Write some description about your Organization..."
                                            />
                                        </FormControl>
                                    )}
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
                        <FormErrorMessage errorMessage={error} />
                        {/* {hasFormError && (
                            <FormErrorMessage
                                errorMessage={
                                    'Form has error on Field. Please provide necessary details'
                                }
                            />
                        )} */}
                        <div className="flex w-full items-center justify-end gap-x-2">
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
                                    isLoading ||
                                    isUploadingPhoto
                                }
                                variant={isFinalStep ? 'default' : 'outline'}
                                className="w-full"
                            >
                                {isLoading ? (
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
