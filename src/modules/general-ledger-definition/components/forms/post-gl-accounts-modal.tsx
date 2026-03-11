import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { CalendarDays, RotateCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

const GLPostSchema = z.object({
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().min(1, 'End date is required'),
    is_unpost: z.boolean(),
})

type GLPostFormValues = z.infer<typeof GLPostSchema>

interface GLPostModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onProcess?: (data: GLPostFormValues) => void
}

const GLPostModal = ({ open, onOpenChange, onProcess }: GLPostModalProps) => {
    const form = useForm<GLPostFormValues>({
        resolver: zodResolver(GLPostSchema),
        defaultValues: {
            start_date: '',
            end_date: '',
            is_unpost: false,
        },
    })

    const isUnpost = form.watch('is_unpost')

    const onSubmit = form.handleSubmit((data) => {
        onProcess?.(data)
        onOpenChange(false)
    })

    return (
        <Dialog onOpenChange={onOpenChange} open={open}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CalendarDays className="h-5 w-5 text-muted-foreground" />
                        {isUnpost
                            ? 'Unpost General Ledger'
                            : 'Post General Ledger'}
                    </DialogTitle>
                    <DialogDescription>
                        {isUnpost
                            ? 'Reverse posted entries for the selected date range.'
                            : 'Post journal entries to the general ledger for the selected period.'}
                    </DialogDescription>
                </DialogHeader>

                <Separator />

                <Form {...form}>
                    <form className="space-y-5" onSubmit={onSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="start_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="end_date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="is_unpost"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-sm font-medium">
                                            Unpost Mode
                                        </FormLabel>
                                        <p className="text-xs text-muted-foreground">
                                            Reverse previously posted entries
                                        </p>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <Separator />

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button
                                onClick={() => form.reset()}
                                size="sm"
                                type="button"
                                variant="outline"
                            >
                                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                                Reset
                            </Button>
                            <Button size="sm" type="submit">
                                {isUnpost ? 'Unpost' : 'Process'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default GLPostModal
