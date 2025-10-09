'use client'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { PaperPlaneIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import { Textarea } from '@/components/ui/textarea'

import UseCooldown from '@/hooks/use-cooldown'
import { useLocationInfo } from '@/hooks/use-location-info'

import { useCreate } from '../../contact-us.service'
import { IContactUs } from '../../contact-us.types'
import { contactUsSchema } from '../../contact-use.validation'

const ContactForm = () => {
    const { countryCode } = useLocationInfo()
    const form = useForm<IContactUs>({
        resolver: standardSchemaResolver(contactUsSchema),
        reValidateMode: 'onChange',
        mode: 'onChange',
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            contact_number: countryCode ?? '',
            description: '',
        },
    })

    const { cooldownCount, startCooldown } = UseCooldown({
        cooldownDuration: 12,
        counterInterval: 1000,
    })

    const { mutate: sendContactMessage, isPending } = useCreate({
        options: {
            onSuccess: (data) => {
                toast.success(
                    `Thank you ${data.first_name} ${data.last_name}. Expect a call or email from us personally :)`
                )
                startCooldown()
                form.reset()
            },
        },
    })

    const onSubmitContactForm = (data: IContactUs) => {
        sendContactMessage(data)
    }

    return (
        <Form {...form}>
            <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmitContactForm)}
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Your first name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Your last name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="your.email@example.com"
                                    type="email"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="contact_number"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contact Number</FormLabel>
                            <FormControl>
                                <PhoneInput
                                    defaultCountry={countryCode}
                                    placeholder="Enter a phone number"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell us more about your cooperative and how we can help..."
                                    rows={6}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    className="w-full"
                    disabled={isPending || cooldownCount > 0}
                    type="submit"
                >
                    {cooldownCount > 0 ? (
                        `Please wait ${cooldownCount}s`
                    ) : (
                        <>
                            <PaperPlaneIcon className="mr-2 h-4 w-4" />
                            {isPending ? 'Sending...' : 'Send Message'}
                        </>
                    )}
                </Button>
            </form>
        </Form>
    )
}

export default ContactForm
