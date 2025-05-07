import z from 'zod'
import { useForm } from 'react-hook-form'
import { createFileRoute, Link } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'

import {
    EmailIcon,
    FacebookIcon,
    TelephoneIcon,
    LoadingCircleIcon,
    MessageOutlineIcon,
} from '@/components/icons'
import {
    Form,
    FormItem,
    FormLabel,
    FormField,
    FormControl,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import FormErrorMessage from '@/components/ui/form-error-message'

import { PhoneInput } from '@/components/contact-input/contact-input'
import { contactFormSchema } from '@/routes/(landing)/-validations/contact-form'

import { cn } from '@/lib/utils'
import UseCooldown from '@/hooks/use-cooldown'
import { useCreateContactUs } from '@/hooks/api-hooks/use-contact-us'

type TContact = z.infer<typeof contactFormSchema>

const contactInputClasses =
    'rounded-[10px] border border-[#4D4C4C]/20 bg-white/50 dark:bg-secondary/70 focus:border-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 placeholder:text-[#838383]'

const ContactPage = () => {
    const defaultValues = {
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: '',
        description: '',
    }

    const form = useForm<TContact>({
        resolver: zodResolver(contactFormSchema),
        reValidateMode: 'onChange',
        mode: 'onChange',
        defaultValues,
    })
    const { startCooldown } = UseCooldown({
        cooldownDuration: 12,
        counterInterval: 1000,
    })

    const { mutate: sendContactMessage, isPending } = useCreateContactUs({
        onSuccess: () => {
            startCooldown()
            form.reset()
        },
    })

    const onSubmitContactForm = async (data: TContact) => {
        const parsedData = contactFormSchema.parse(data)
        sendContactMessage(parsedData)
    }

    const showFieldError = Object.values(form.formState.errors)[0]?.message

    return (
        <div className="flex justify-center px-6 py-5 font-inter sm:px-8 lg:px-[60px] lg:py-10 xl:px-[124px]">
            <div className="mt-3 flex max-w-[1300px] flex-col items-center justify-center space-y-4 md:mt-5 lg:mt-16 lg:space-y-7 xl:space-y-10">
                <h1 className="max-w-[1100px] text-center text-[min(64px,5.5vw)] font-bold">
                    Contact our Team
                </h1>
                <h2 className="max-w-[1100px] text-center text-[min(24px,3.5vw)] font-medium">
                    Got any questions about the product or scaling on our
                    platform? We’re here to help. Chat our friendly team 24/7
                    and get onboard in less than 5 minutes.
                </h2>
                <div className="flex w-full flex-col justify-evenly md:flex-row">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmitContactForm)}
                            className="max-w-[456px] space-y-2"
                        >
                            <div className="flex flex-col gap-[26px] md:flex-row">
                                <FormField
                                    name="first_name"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <div className="flex flex-col justify-start">
                                                <FormLabel
                                                    htmlFor={field.name}
                                                    className="h-[38px] w-full max-w-[90px] text-[15px] font-semibold"
                                                >
                                                    First Name
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="flex-1 space-y-2">
                                                        <Input
                                                            id={field.name}
                                                            className={cn(
                                                                contactInputClasses
                                                            )}
                                                            placeholder="First Name"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="last_name"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <div className="flex flex-col justify-start">
                                                <FormLabel
                                                    htmlFor={field.name}
                                                    className="h-[38px] w-full max-w-[90px] text-[15px] font-semibold"
                                                >
                                                    Last Name
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="flex-1 space-y-2">
                                                        <Input
                                                            id={field.name}
                                                            className={cn(
                                                                contactInputClasses
                                                            )}
                                                            placeholder="Last Name"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                name="email"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="">
                                        <div className="flex flex-col justify-start">
                                            <FormLabel
                                                htmlFor={field.name}
                                                className="h-[38px] w-full max-w-[90px] text-[15px] font-semibold"
                                            >
                                                Email
                                            </FormLabel>
                                            <FormControl>
                                                <div className="flex-1 space-y-2">
                                                    <Input
                                                        id={field.name}
                                                        className={cn(
                                                            contactInputClasses
                                                        )}
                                                        placeholder="you@company.com"
                                                        {...field}
                                                        autoComplete="email"
                                                    />
                                                </div>
                                            </FormControl>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="contact_number"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="">
                                        <div className="flex flex-col justify-start">
                                            <FormLabel
                                                htmlFor={field.name}
                                                className="h-[38px] w-full max-w-[90px] text-[15px] font-semibold"
                                            >
                                                Phone
                                            </FormLabel>
                                            <FormControl>
                                                <div className="flex-1 space-y-2">
                                                    <PhoneInput
                                                        placeholder="Enter a phone number"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="description"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="">
                                        <div className="flex flex-col justify-start">
                                            <FormLabel
                                                htmlFor={field.name}
                                                className="h-[38px] w-full max-w-[90px] text-[15px] font-semibold"
                                            >
                                                Message
                                            </FormLabel>
                                            <FormControl>
                                                <div className="flex-1 space-y-2">
                                                    <Textarea
                                                        id={field.name}
                                                        className={cn(
                                                            contactInputClasses
                                                        )}
                                                        placeholder="Leave us message..."
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            {showFieldError && (
                                <FormErrorMessage
                                    className="w-fit text-[12px]"
                                    errorMessage={showFieldError}
                                />
                            )}
                            <div className="bg- flex flex-col space-y-2">
                                <Button
                                    disabled={isPending}
                                    type="submit"
                                    className="mt-6 bg-[#34C759] hover:bg-[#38b558]"
                                >
                                    {isPending ? (
                                        <LoadingCircleIcon className="animate-spin" />
                                    ) : (
                                        'Send Message'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>

                    <div className="flex h-full flex-col justify-evenly">
                        <div className="space-y-2">
                            <div>
                                <h1 className="text-[18px] font-bold">
                                    Chat with us
                                </h1>
                                <p className="text-sm font-semibold text-[#686868]">
                                    Speak to our friendly team via live chat.
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <MessageOutlineIcon className="self-center" />
                                <Link className="text-sm font-semibold" to="/">
                                    start a live chat
                                </Link>
                            </div>
                            <div className="flex space-x-2">
                                <EmailIcon className="self-center" />
                                <Link className="text-sm font-semibold" to="/">
                                    shoot us an email
                                </Link>
                            </div>
                            <div className="flex space-x-2">
                                <FacebookIcon className="self-center" />
                                <Link className="text-sm font-semibold" to="/">
                                    Message us on Facebook
                                </Link>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div>
                                <h1 className="text-[18px] font-bold">
                                    Call us
                                </h1>
                                <p className="text-sm font-semibold text-[#686868]">
                                    Call our team on Mon-Fri 8am to 5pm.
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <TelephoneIcon className="self-center" />
                                <Link
                                    className="text-sm font-semibold underline"
                                    to="/"
                                >
                                    +639321784911
                                </Link>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div>
                                <h1 className="text-[18px] font-bold">
                                    Visit Us
                                </h1>
                                <p className="text-sm font-semibold text-[#686868]">
                                    Reach our team on Mon-Fri 8am to 5pm.
                                </p>
                            </div>
                            <div className="flex space-x-2">
                                <p className="text-sm font-semibold underline">
                                    Bagong Street, Norway VC 3066
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const Route = createFileRoute('/(landing)/contact')({
    component: ContactPage,
})

export default ContactPage
