import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
    Form,
    FormItem,
    FormLabel,
    FormField,
    FormControl,
    FormMessage,
} from '@/components/ui/form'
import {
    Select,
    SelectItem,
    SelectValue,
    SelectTrigger,
    SelectContent,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import EcoopLogo from '@/components/ecoop-logo'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { VerifiedPatchIcon } from '@/components/icons'
import PasswordInput from '@/components/ui/password-input'
import FormErrorMessage from '@/components/ui/form-error-message'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import {
    ChecklistTemplate,
    ValueChecklistMeter,
} from '@/components/value-checklist-indicator'
import InputDatePicker from '@/components/date-time-pickers/input-date-picker'

import { cn } from '@/lib/utils'
import { PhoneInput } from '@/components/contact-input/contact-input'
import { signUpSchema } from '@/validations/form-validation/sign-up-schema'

import { IClassProps } from '@/types'
import { IForm } from '@/types/components'
import { ISignUpRequest, IUserData } from '@/server'
import { useSignUp } from '@/hooks/api-hooks/use-auth'

type TSignUpForm = z.infer<typeof signUpSchema>

interface ISignUpFormProps
    extends IClassProps,
        IForm<Partial<ISignUpRequest>, IUserData, string> {}

const SignUpForm = ({
    readOnly,
    className,
    defaultValues,
    onError,
    onSuccess,
}: ISignUpFormProps) => {
    const form = useForm<TSignUpForm>({
        resolver: zodResolver(signUpSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            acceptTerms: false,
            confirmPassword: '',
            password: '',
            contactNumber: '',
            email: '',
            permanentAddress: '',
            birthDate: new Date(),
            firstName: '',
            lastName: '',
            middleName: '',
            username: '',
            accountType: 'Member',
            ...defaultValues,
        },
    })

    const {
        error,
        isPending: isLoading,
        mutate: signUp,
    } = useSignUp({ onSuccess, onError })

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((formData) => signUp(formData))}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <div className="flex items-center justify-center gap-x-2 pb-8 font-medium">
                    <EcoopLogo className="size-14 sm:size-24" />
                    <p className="text-lg sm:text-2xl">Create your profile</p>
                </div>
                <fieldset
                    disabled={isLoading || readOnly}
                    className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3 sm:gap-y-3"
                >
                    <fieldset className="space-y-3">
                        <legend>Account Information</legend>
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="col-span-1 space-y-1">
                                    <FormLabel
                                        htmlFor={field.name}
                                        className="w-full text-right text-sm font-medium"
                                    >
                                        Username
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            autoComplete="username"
                                            placeholder="Username"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="col-span-1 space-y-1">
                                    <FormLabel
                                        htmlFor={field.name}
                                        className="w-full text-right text-sm font-medium"
                                    >
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            {...field}
                                            maxLength={50}
                                            id={field.name}
                                            placeholder="Password"
                                            autoComplete="new-password"
                                        />
                                    </FormControl>
                                    <ValueChecklistMeter
                                        value={field.value}
                                        checkList={ChecklistTemplate[
                                            'password-checklist'
                                        ].concat([
                                            {
                                                regex: /^.{0,50}$/,
                                                text: 'No more than 50 characters',
                                            },
                                        ])}
                                    />
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="confirmPassword"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="col-span-1 space-y-1">
                                    <FormLabel
                                        htmlFor={field.name}
                                        className="w-full text-right text-sm font-medium"
                                    >
                                        Confirm Password
                                    </FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            {...field}
                                            id={field.name}
                                            autoComplete="off"
                                            placeholder="Confirm Password"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="accountType"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="col-span-1 space-y-1">
                                    <FormLabel
                                        htmlFor="account-type"
                                        className="w-full text-right text-sm font-medium"
                                    >
                                        Account Type
                                    </FormLabel>
                                    <Select
                                        name={field.name}
                                        defaultValue={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <FormControl id="account-type">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Member">
                                                Member
                                            </SelectItem>
                                            <SelectItem value="Owner">
                                                Owner
                                            </SelectItem>
                                            <SelectItem value="Admin">
                                                Admin
                                            </SelectItem>
                                            <SelectItem value="Employee">
                                                Employee
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                    </fieldset>

                    <fieldset className="space-y-3">
                        <legend>Personal Information</legend>
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem className="col-span-1 space-y-1">
                                    <FormLabel
                                        htmlFor={field.name}
                                        className="w-full text-right text-sm font-medium"
                                    >
                                        First Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            autoComplete="given-name"
                                            placeholder="First Name"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="middleName"
                            render={({ field }) => (
                                <FormItem className="col-span-1 space-y-1">
                                    <FormLabel
                                        htmlFor={field.name}
                                        className="w-full text-right text-sm font-medium"
                                    >
                                        Middle Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            placeholder="Middle Name"
                                            autoComplete="additional-name"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem className="col-span-1 space-y-1">
                                    <FormLabel
                                        htmlFor={field.name}
                                        className="w-full text-right text-sm font-medium"
                                    >
                                        Last Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            placeholder="Last Name"
                                            autoComplete="family-name"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="birthDate"
                            render={({ field }) => (
                                <FormItem className="col-span-1 space-y-1">
                                    <FormLabel
                                        htmlFor={field.name}
                                        className="w-full text-right text-sm font-medium"
                                    >
                                        Birth Date
                                    </FormLabel>
                                    <FormControl>
                                        <InputDatePicker
                                            id={field.name}
                                            value={field.value}
                                            onChange={field.onChange}
                                            captionLayout="dropdown-buttons"
                                            disabled={(date) =>
                                                date > new Date()
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                    </fieldset>

                    <fieldset className="space-y-3">
                        <legend>Contact Information</legend>
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="col-span-1 space-y-1">
                                    <FormLabel
                                        htmlFor={field.name}
                                        className="w-full text-right text-sm font-medium"
                                    >
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            autoComplete="email"
                                            placeholder="Email"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="contactNumber"
                            control={form.control}
                            render={({
                                field,
                                fieldState: { invalid, error },
                            }) => (
                                <FormItem className="col-span-1 space-y-1">
                                    <FormLabel
                                        htmlFor={field.name}
                                        className="w-full text-right text-sm font-medium"
                                    >
                                        Contact Number
                                    </FormLabel>
                                    <FormControl>
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
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="permanentAddress"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className="col-span-1 space-y-1">
                                    <FormLabel
                                        htmlFor={field.name}
                                        className="w-full text-right text-sm font-medium"
                                    >
                                        Permanent Address
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            autoComplete="street-address"
                                            placeholder="Permanent Address"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />
                    </fieldset>
                </fieldset>

                <FormField
                    name="acceptTerms"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="col-span-3">
                            <div className="flex items-center space-y-0">
                                <FormControl>
                                    <Checkbox
                                        id={field.name}
                                        name={field.name}
                                        checked={field.value}
                                        disabled={isLoading || readOnly}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormLabel
                                    htmlFor={field.name}
                                    className="m-0 ml-2 cursor-pointer p-0 font-medium"
                                >
                                    Accept terms and conditions
                                </FormLabel>
                            </div>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />
                <div className="mt-4 flex flex-col space-y-2">
                    <FormErrorMessage errorMessage={error} />
                    <Button type="submit" disabled={isLoading || readOnly}>
                        {isLoading ? <LoadingSpinner /> : 'Submit'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default SignUpForm
