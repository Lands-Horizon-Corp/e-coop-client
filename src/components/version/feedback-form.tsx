import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import TextEditor from '@/components/text-editor'
import { LoadingCircleIcon } from '@/components/icons'
import FormErrorMessage from '@/components/ui/form-error-message'

import { cn } from '@/lib/utils'
import { UpdateStatus } from '@/types/constants'
import { FeedbackFormSchema } from './validations'
import { useCreateFeedback } from '@/hooks/api-hooks/use-feedback'

type TFeedBack = z.infer<typeof FeedbackFormSchema>

const FeedbackForm = () => {
    const defaultValues = {
        feedbackType: '',
        email: '',
        description: '',
    }

    const feedbackForm = useForm<TFeedBack>({
        resolver: zodResolver(FeedbackFormSchema),
        reValidateMode: 'onChange',
        mode: 'onChange',
        defaultValues,
    })

    const { mutate: sendFeedbackMessage, isPending } = useCreateFeedback({
        onSuccess: () => feedbackForm.reset(),
    })

    const handleFeedBackSubmit = (data: TFeedBack) => {
        const parsedData = FeedbackFormSchema.parse(data)
        sendFeedbackMessage(parsedData)
    }

    const showFieldError = Object.values(feedbackForm.formState.errors)[0]
        ?.message
    return (
        <div className="space-y-2 px-2">
            <Form {...feedbackForm}>
                <form
                    onSubmit={feedbackForm.handleSubmit(handleFeedBackSubmit)}
                    className="space-y-3"
                >
                    <FormField
                        name="feedbackType"
                        control={feedbackForm.control}
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-col justify-start">
                                    <FormLabel
                                        htmlFor={field.name}
                                        className="h-[24px] w-full text-[14px]"
                                    >
                                        Feedback type
                                    </FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            name={field.name}
                                        >
                                            <SelectTrigger
                                                className={cn(
                                                    'max-w-80 rounded-[10px] bg-transparent placeholder:text-[#838383]'
                                                )}
                                                id={field.name}
                                            >
                                                <SelectValue placeholder="Choose feedback type" />
                                            </SelectTrigger>
                                            <SelectContent id="helo">
                                                <SelectItem
                                                    value={UpdateStatus.FEATURE}
                                                >
                                                    {UpdateStatus.FEATURE}
                                                </SelectItem>
                                                <SelectItem
                                                    value={UpdateStatus.BUG}
                                                >
                                                    {UpdateStatus.BUG}
                                                </SelectItem>
                                                <SelectItem
                                                    value={UpdateStatus.GENERAL}
                                                >
                                                    {UpdateStatus.GENERAL}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="description"
                        control={feedbackForm.control}
                        render={({ field }) => (
                            <FormItem className="">
                                <FormLabel
                                    htmlFor={field.name}
                                    className="h-[24px] w-full text-[14px]"
                                >
                                    Description
                                </FormLabel>
                                <FormControl>
                                    <TextEditor
                                        content={field.value}
                                        onChange={field.onChange}
                                    ></TextEditor>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="email"
                        control={feedbackForm.control}
                        render={({ field }) => (
                            <FormItem className="max-w-80">
                                <div className="flex flex-col justify-start">
                                    <FormLabel
                                        htmlFor={field.name}
                                        className="h-[24px] w-full text-[14px]"
                                    >
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <div className="flex-1 space-y-2">
                                            <Input
                                                id={field.name}
                                                className={cn(
                                                    'rounded-[10px] bg-transparent placeholder:text-[#838383]'
                                                )}
                                                placeholder="ecoop@email.com"
                                                {...field}
                                                autoComplete="email"
                                            />
                                        </div>
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormErrorMessage
                        className="w-fit text-[12px]"
                        errorMessage={showFieldError}
                    />
                    <Button className={cn('w-full')}>
                        {isPending ? (
                            <LoadingCircleIcon className="animate-spin" />
                        ) : (
                            'Send Feedback'
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default FeedbackForm
