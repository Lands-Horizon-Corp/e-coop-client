import { useState } from 'react'

import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
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
    RocketIcon,
    UnavailableIcon,
    VerifiedPatchIcon,
} from '@/components/icons'
import TextEditor from '@/components/text-editor'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
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
import { BranchInfoItem } from './branch-card-info'
import { OrganizationFormStepper } from './organization-form-stepper'
import { organizationSteps } from './organization-stepper-config'
import { useOrganizationFormStepperNavigation } from './use-form-stepper-navigation'

type handleStepChange = {
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    activeStep: number
}

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

    const stepperNavigation = useOrganizationFormStepperNavigation(
        form,
        activeStep,
        setActiveStep,
        organizationSteps.length
    )

    const handleNextStep = async ({ e }: handleStepChange) => {
        e?.preventDefault()
        await stepperNavigation.goToNextStep()
    }

    const handleGoBack = ({ e }: handleStepChange) => {
        e.preventDefault()
        stepperNavigation.goToPreviousStep()
    }

    const isDirty = Object.keys(form.formState.dirtyFields).length > 0

    useAlertBeforeClosing(isDirty)

    const errorMessage = serverRequestErrExtractor({ error })

    return (
        <Form {...form}>
            <form
                className=" flex flex-col"
                onSubmit={form.handleSubmit(handleSubmit)}
            >
                <Card
                    className={cn(
                        'flex-1 w-full max-w-full shadow-none rounded-none sm:rounded-lg border-none sm:border bg-transparent sm:bg-card/50  flex flex-col'
                    )}
                >
                    <CardHeader className="text-lg px-4 sm:px-6"></CardHeader>
                    <OrganizationFormStepper
                        activeStep={activeStep}
                        className="px-2 sm:px-0 block md:hidden xl:block"
                        form={form}
                        onStepChange={setActiveStep}
                        variant="minimal"
                    />
                    <CardContent className={cn('flex flex-1')}>
                        <OrganizationFormStepper
                            activeStep={activeStep}
                            className="px-2 sm:px-0 hidden md:block xl:hidden"
                            form={form}
                            onStepChange={setActiveStep}
                            orientation="vertical"
                            variant="minimal"
                        />
                        <div className="w-full bg-transparent px-4 sm:px-6 pb-4">
                            {activeStep === 0 && (
                                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="col-span-full flex flex-col sm:flex-row gap-4 w-full">
                                        <FormFieldWrapper
                                            className="flex-1"
                                            control={form.control}
                                            label="Organization Photo"
                                            name="media_id"
                                            render={({ field }) => {
                                                const value =
                                                    form.watch('media')
                                                return (
                                                    <ImageField
                                                        {...field}
                                                        className="w-full"
                                                        onChange={(
                                                            newImage
                                                        ) => {
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
                                                        placeholder="Upload Organization Photo"
                                                        value={
                                                            value
                                                                ? (
                                                                      value as IMedia
                                                                  ).download_url
                                                                : value
                                                        }
                                                    />
                                                )
                                            }}
                                        />
                                        <FormFieldWrapper
                                            className="flex-1"
                                            control={form.control}
                                            label="Organization Cover Photo"
                                            name="cover_media_id"
                                            render={({ field }) => {
                                                const value =
                                                    form.watch('cover_media')
                                                return (
                                                    <ImageField
                                                        {...field}
                                                        className="w-full"
                                                        onChange={(
                                                            newImage
                                                        ) => {
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
                                                        placeholder="Upload Organization Cover Photo"
                                                        value={
                                                            value
                                                                ? (
                                                                      value as IMedia
                                                                  ).download_url
                                                                : value
                                                        }
                                                    />
                                                )
                                            }}
                                        />
                                    </div>
                                    <div className="col-span-full flex flex-col sm:flex-row w-full items-start sm:items-center gap-2">
                                        <CategoriesItem className="w-full flex-1 " />
                                        <Button
                                            className="w-full sm:w-auto"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                setOnOpenCategoryPicker(true)
                                            }}
                                            variant={'ghost'}
                                        >
                                            Edit Categories
                                        </Button>
                                    </div>
                                    <FormFieldWrapper
                                        className="col-span-full sm:col-span-2 lg:col-span-3"
                                        control={form.control}
                                        label="Organization Name"
                                        name="name"
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                autoComplete="org-name"
                                                id={field.name}
                                                placeholder="enter organization name"
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        className="col-span-full sm:col-span-2 lg:col-span-1"
                                        control={form.control}
                                        label="Organization Email"
                                        name="email"
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                autoComplete="organization email"
                                                id={field.name}
                                                placeholder="enter email"
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        className="col-span-full sm:col-span-1 lg:col-span-2"
                                        control={form.control}
                                        label="Organization Contact Number"
                                        name="contact_number"
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
                                        className="col-span-full sm:col-span-1 lg:col-span-2"
                                        control={form.control}
                                        label="Organization Address"
                                        name="address"
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                autoComplete="organization address"
                                                id={field.name}
                                                placeholder="enter organization address"
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        className="col-span-full"
                                        control={form.control}
                                        label="Organization Description"
                                        name="description"
                                        render={({ field }) => {
                                            const { ref: _ref, ...rest } = field
                                            return (
                                                <FormControl>
                                                    <TextEditor
                                                        {...rest}
                                                        className="w-full"
                                                        placeholder="Write some description about your Organization..."
                                                        textEditorClassName="!max-w-none"
                                                    />
                                                </FormControl>
                                            )
                                        }}
                                    />
                                </div>
                            )}
                            {activeStep === 1 && (
                                <FormFieldWrapper
                                    className="col-span-4"
                                    control={form.control}
                                    name="subscription_plan_id"
                                    render={({ field }) => (
                                        <div className="flex flex-col gap-2">
                                            <SubscriptionPlanPicker
                                                disabled={isCreating}
                                                onChange={(id: TEntityId) => {
                                                    form.setValue(
                                                        'subscription_plan_id',
                                                        id
                                                    )
                                                    field.onChange(id)
                                                }}
                                                onSelect={(plan) => {
                                                    form.setValue(
                                                        'subscription_plan',
                                                        plan.name
                                                    )
                                                }}
                                                value={field.value}
                                            />
                                        </div>
                                    )}
                                />
                            )}
                            {activeStep === 2 && (
                                <div className="flex min-h-[40vh] sm:min-h-[50vh] w-full flex-col items-center justify-center gap-4 p-4 sm:p-6 rounded-lg border">
                                    <UnavailableIcon
                                        className="items-center"
                                        size={60}
                                    />
                                    <p className="items-center text-sm sm:text-base text-muted-foreground text-center max-w-md">
                                        Payment is currently unavailable, You
                                        may proceed to submission.
                                    </p>
                                    {/* Add your payment method selection logic here */}
                                </div>
                            )}
                            {activeStep === 3 && (
                                <div className="space-y-4">
                                    <div className="text-center sm:text-left">
                                        <h1 className="inline-flex items-center justify-center sm:justify-start text-xl sm:text-2xl font-semibold mb-2">
                                            Almost done!
                                            <RocketIcon className="text-primary ml-1" />
                                        </h1>
                                        <p className="text-sm sm:text-base text-muted-foreground">
                                            Please review your information
                                            before submitting.
                                        </p>
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        <div className="space-y-2 sm:space-y-1">
                                            <BranchInfoItem
                                                content={form.getValues('name')}
                                                textAlign="right"
                                                title="Organization Name"
                                            />
                                            <BranchInfoItem
                                                content={form.getValues(
                                                    'email'
                                                )}
                                                textAlign="right"
                                                title="Email"
                                            />
                                            <BranchInfoItem
                                                content={form.getValues(
                                                    'contact_number'
                                                )}
                                                textAlign="right"
                                                title="Contact Number"
                                            />
                                            <BranchInfoItem
                                                content={form.getValues(
                                                    'address'
                                                )}
                                                textAlign="right"
                                                title="Address"
                                            />
                                            <BranchInfoItem
                                                content={form.getValues(
                                                    'description'
                                                )}
                                                textAlign="right"
                                                title="Description"
                                            />
                                            <BranchInfoItem
                                                content={
                                                    <Badge variant="secondary">
                                                        {form.getValues(
                                                            'subscription_plan'
                                                        ) || 'No plan selected'}
                                                    </Badge>
                                                }
                                                textAlign="right"
                                                title="Selected Plan"
                                            />
                                            <BranchInfoItem
                                                content={
                                                    selectedCategories.length >
                                                    0 ? (
                                                        <div>
                                                            {selectedCategories.map(
                                                                (catItem) => {
                                                                    return (
                                                                        <Badge
                                                                            className="mr-1 mb-1"
                                                                            key={
                                                                                catItem.id
                                                                            }
                                                                        >
                                                                            {
                                                                                catItem.name
                                                                            }
                                                                        </Badge>
                                                                    )
                                                                }
                                                            )}
                                                        </div>
                                                    ) : (
                                                        'No categories selected'
                                                    )
                                                }
                                                contentClassName="flex flex-wrap justify-end"
                                                textAlign="right"
                                                title="Categories"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3 px-4 sm:px-6 py-4 bg-background/95 backdrop-blur-sm border-t z-10">
                        {stepperNavigation.isFinalStep && (
                            <Button
                                className="w-full"
                                disabled={
                                    !stepperNavigation.isFinalStep || isCreating
                                }
                                type="submit"
                                variant={
                                    stepperNavigation.isFinalStep
                                        ? 'default'
                                        : 'outline'
                                }
                            >
                                {isCreating ? (
                                    <LoadingSpinnerIcon
                                        className="mr-2 animate-spin"
                                        size={18}
                                    />
                                ) : (
                                    'Submit'
                                )}
                            </Button>
                        )}
                        <FormErrorMessage errorMessage={errorMessage} />

                        {/* Mobile-first responsive navigation */}
                        <div className="flex sticky bottom-0 flex-col justify-end sm:flex-row w-full items-center gap-3 sm:gap-2">
                            <div className="flex items-center gap-x-2 text-card-foreground/70 order-1 sm:order-2">
                                <span className="font-medium">
                                    {activeStep + 1}
                                </span>
                                <span className="text-xs sm:text-sm">
                                    of {organizationSteps.length}
                                </span>
                            </div>

                            {/* Navigation buttons */}
                            <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-2 order-2 sm:order-3">
                                <Button
                                    className="text-xs sm:text-sm"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        form.reset()
                                    }}
                                    size="sm"
                                    variant="ghost"
                                >
                                    Reset
                                </Button>

                                <div className="flex gap-2">
                                    <Button
                                        className="text-xs sm:text-sm"
                                        disabled={stepperNavigation.isFirstStep}
                                        onClick={(e) =>
                                            handleGoBack({ e, activeStep })
                                        }
                                        size="sm"
                                        variant="ghost"
                                    >
                                        <NextIcon
                                            className="mr-1 sm:mr-2 rotate-180"
                                            size={16}
                                        />
                                        <span className="hidden sm:inline">
                                            Go{' '}
                                        </span>
                                        Back
                                    </Button>

                                    <Button
                                        className="text-xs sm:text-sm"
                                        disabled={stepperNavigation.isFinalStep}
                                        onClick={(e) => {
                                            handleNextStep({ e, activeStep })
                                        }}
                                        size="sm"
                                        variant="ghost"
                                    >
                                        Next
                                        <span className="hidden sm:inline">
                                            {' '}
                                            Step
                                        </span>
                                        <NextIcon
                                            className="ml-1 sm:ml-2"
                                            size={16}
                                        />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    )
}

export default OrganizationForm
