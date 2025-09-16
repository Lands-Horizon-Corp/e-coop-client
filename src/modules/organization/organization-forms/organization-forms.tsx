import { useState } from 'react'

import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers/tw-utils'
import { IMedia } from '@/modules/media'
import {
    ICreateOrganizationResponse,
    OrganizationSchema,
    TOrganizationFormValues,
} from '@/modules/organization'
import { useCreateOrganization } from '@/modules/organization'
import { IOrganizationCategoryRequest } from '@/modules/organization-category'
import SubscriptionPlanPicker from '@/modules/subscription-plan/components/subscription-plan/subscription'
import { useCategoryStore } from '@/store/onboarding/category-store'

import {
    LoadingSpinnerIcon,
    NextIcon,
    UnavailableIcon,
    VerifiedPatchIcon,
} from '@/components/icons'
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
import { Form, FormControl } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import ImageField from '@/components/ui/image-field'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'

import { useAlertBeforeClosing } from '@/hooks/use-alert-before-closing'
import { useLocationInfo } from '@/hooks/use-location-info'

import { TEntityId } from '@/types'

import CategoriesItem from '../components/categories-item'

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
    const { selectedCategories, clearCategories, setOnOpenCategoryPicker } =
        useCategoryStore()

    const navigate = useNavigate()

    const form = useForm<TOrganizationFormValues>({
        resolver: standardSchemaResolver(OrganizationSchema),
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
            onSuccess: (data) => {
                const value = data as unknown as ICreateOrganizationResponse
                navigate({
                    to: `/onboarding/create-branch/${value.organization.id}`,
                })
                toast.success('Organization created successfully')
                clearCategories()
            },
            onError: (error) => {
                console.error('Error creating organization:', error)
                toast.error('Failed to create organization. Please try again.')
            },
        },
    })

    const handleSubmit = async (data: TOrganizationFormValues) => {
        const requestData = {
            ...data,
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

    // const HeaderTitleDisplay =
    //     form.watch('name') === ''
    //         ? 'Sample Organization Title'
    //         : form.watch('name')

    // const DescriptionDisplay =
    //     form.watch('description') === ''
    //         ? 'This is sample description for your banner'
    //         : form.watch('description')

    const isDirty = Object.keys(form.formState.dirtyFields).length > 0

    useAlertBeforeClosing(isDirty)

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <Card
                    className={cn(
                        'min-h-full w-full min-w-full shadow-none rounded-none border-none bg-transparent'
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
                                <div className="md:col-span-4 flex gap-2 w-full">
                                    <FormFieldWrapper
                                        control={form.control}
                                        name="media_id"
                                        label="Organization Photo"
                                        className=" "
                                        render={({ field }) => {
                                            const value = form.watch('media')
                                            return (
                                                <ImageField
                                                    {...field}
                                                    placeholder="Upload Organization Photo"
                                                    className=""
                                                    value={
                                                        value
                                                            ? (value as IMedia)
                                                                  .download_url
                                                            : value
                                                    }
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
                                                            'media',
                                                            newImage
                                                        )
                                                    }}
                                                />
                                            )
                                        }}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name="cover_media_id"
                                        label="Organization Cover Photo"
                                        render={({ field }) => {
                                            const value =
                                                form.watch('cover_media')
                                            return (
                                                <ImageField
                                                    {...field}
                                                    placeholder="Upload Organization Photo"
                                                    value={
                                                        value
                                                            ? (value as IMedia)
                                                                  .download_url
                                                            : value
                                                    }
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
                                                            'cover_media',
                                                            newImage
                                                        )
                                                    }}
                                                />
                                            )
                                        }}
                                    />
                                </div>
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
                                <span className=""> {activeStep + 1}</span> of{' '}
                                {steps.length}
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
                                disabled={!isFinalStep || isCreating}
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
