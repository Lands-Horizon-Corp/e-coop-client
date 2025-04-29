import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouterState } from '@tanstack/react-router'

import {
    Form,
    FormItem,
    FormLabel,
    FormField,
    FormControl,
    FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import TextEditor from '@/components/text-editor'
import { Separator } from '@/components/ui/separator'
import FormErrorMessage from '@/components/ui/form-error-message'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import InputDatePicker from '@/components/date-time-pickers/input-date-picker'

import {
    lastNameSchema,
    birthDateSchema,
    firstNameSchema,
    middleNameSchema,
} from '@/validations/common'

import { cn } from '@/lib'
import { IUserData } from '@/types/coop-types'
import { useUpdateAccountSettings } from '@/hooks/api-hooks/use-account'

const AccountSettingsFormSchema = z.object({
    lastName: lastNameSchema,
    birthDate: birthDateSchema,
    firstName: firstNameSchema,
    middleName: middleNameSchema,
    description: z.string().optional(),
    permanentAddress: z
        .string({ required_error: 'Address is required' })
        .min(1, 'Address is required'),
})

type TAccountSettings = z.infer<typeof AccountSettingsFormSchema>

interface Props {
    currentUser: IUserData
    onSave: (newUserData: IUserData) => void
}

const AccountSettings = ({ currentUser, onSave }: Props) => {
    const {
        lastName,
        firstName,
        birthDate,
        middleName,
        description,
        permanentAddress,
    } = currentUser

    const hash = useRouterState({
        select: ({ location }) => location.hash,
    })

    const form = useForm<TAccountSettings>({
        resolver: zodResolver(AccountSettingsFormSchema),
        values: {
            firstName,
            lastName,
            middleName,
            description,
            permanentAddress: permanentAddress ?? '',
            birthDate: new Date(birthDate),
        },
    })

    const {
        error,
        isPending,
        mutate: updateAccountSettings,
    } = useUpdateAccountSettings({
        onSuccess: onSave,
    })

    if (hash !== 'account-settings') return null

    const hasChanges = form.formState.isDirty

    const firstError = Object.values(form.formState.errors)[0]?.message

    return (
        <div>
            <p className="text-lg font-medium">Account Settings</p>
            <p className="mt-1 text-xs text-foreground/60">
                Update your account settings
            </p>
            <Separator className="my-4" />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit((data) =>
                        updateAccountSettings(data)
                    )}
                    className={cn('flex w-full flex-col gap-y-4')}
                >
                    <fieldset
                        disabled={isPending}
                        className="grid gap-x-4 gap-y-6 sm:grid-cols-2"
                    >
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem className="space-y-0">
                                    <FormLabel
                                        htmlFor={field.name}
                                        className="text-right text-sm font-normal text-foreground/60"
                                    >
                                        Firstname
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            placeholder="Firstname"
                                            autoComplete="off"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="middleName"
                            render={({ field }) => (
                                <FormItem className="space-y-0">
                                    <FormLabel
                                        htmlFor={field.name}
                                        className="text-right font-normal text-foreground/60"
                                    >
                                        Middlename
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            placeholder="Middlename"
                                            autoComplete="off"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />{' '}
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem className="space-y-0">
                                    <FormLabel
                                        htmlFor={field.name}
                                        className="text-right font-normal text-foreground/60"
                                    >
                                        Lastname
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            placeholder="Lastname"
                                            autoComplete="off"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="birthDate"
                            render={({ field }) => (
                                <FormItem className="space-y-0">
                                    <FormLabel
                                        htmlFor={field.name}
                                        className="text-right text-sm font-normal text-foreground/60"
                                    >
                                        BirthDate
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
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="permanentAddress"
                            render={({ field }) => (
                                <FormItem className="space-y-0 sm:col-span-2">
                                    <FormLabel
                                        htmlFor={field.name}
                                        className="text-right text-sm font-normal text-foreground/60"
                                    >
                                        Permanent Address
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            id={field.name}
                                            placeholder="Permanent Address"
                                            autoComplete="off"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="space-y-1 sm:col-span-2">
                                    <div>
                                        <FormLabel
                                            htmlFor={field.name}
                                            className="text-right text-sm font-normal text-foreground/60"
                                        >
                                            Description
                                        </FormLabel>
                                        <FormDescription className="text-xs">
                                            Write a short description about
                                            yourself
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <TextEditor
                                            content={field.value}
                                            onChange={field.onChange}
                                            className="!max-w-none"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </fieldset>
                    <FormErrorMessage errorMessage={firstError || error} />
                    {hasChanges && (
                        <>
                            <Separator className="my-2 sm:my-4" />
                            <div className="flex items-center justify-end gap-x-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => form.reset()}
                                    className="w-full self-end px-8 sm:w-fit"
                                >
                                    Reset
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full self-end px-8 sm:w-fit"
                                >
                                    {isPending ? <LoadingSpinner /> : 'Save'}
                                </Button>
                            </div>
                        </>
                    )}
                </form>
            </Form>
        </div>
    )
}

export default AccountSettings
