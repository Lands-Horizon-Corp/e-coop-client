import { FieldValues, UseFormReturn, useFieldArray } from 'react-hook-form'
import z from 'zod'

import { cn } from '@/helpers/tw-utils'
import { useHotkeys } from 'react-hotkeys-hook'

import { TrashIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { useInternalState } from '@/hooks/use-internal-state'

export const WithAgeRangesSchema = z.object({
    age_ranges: z
        .array(
            z.object({
                from: z.coerce.number().min(1).default(0),
                to: z.coerce.number().min(1).default(0),
            })
        )
        .optional()
        .default([]),
})

type TWithAgeRanges = z.infer<typeof WithAgeRangesSchema>

export const AgeRangeListFormSection = <
    TFieldValues extends FieldValues & TWithAgeRanges,
>({
    form,
    title = 'Age Ranges',
    description = 'Define age ranges',
    className,
    trigger,
    open,
    onOpenChange,
    ...props
}: IModalProps & {
    form: UseFormReturn<TFieldValues>
}) => {
    const [state, setState] = useInternalState(false, open, onOpenChange)

    const { fields, append, remove } = useFieldArray({
        control: form.control as never,
        name: 'age_ranges' as never,
    })

    useHotkeys(
        'ctrl+enter',
        (e) => {
            e.preventDefault()
            append({ from: 0, to: 0 } as never)
        },
        { keydown: true, enableOnFormTags: true }
    )

    return (
        <Modal
            className={cn('!max-w-lg border-muted w-full', className)}
            closeButtonClassName="sr-only"
            description={description}
            onOpenChange={setState}
            open={state}
            title={title}
            titleHeaderContainerClassName="sr-only"
            trigger={trigger}
            {...props}
        >
            <div className="flex justify-between">
                <div>
                    <p className="text-lg font-medium">{title}</p>
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                        <KbdGroup>
                            <Kbd>Ctrl</Kbd>
                            <Kbd>Enter</Kbd>
                        </KbdGroup>
                    </p>
                    <Button
                        onClick={() => append({ from: 0, to: 0 } as never)}
                        size="xs"
                        type="button"
                        variant="secondary"
                    >
                        Add Entry
                    </Button>
                </div>
            </div>

            <Table
                className="border-separate border-spacing-0"
                wrapperClassName="border-none ring-2 ring-muted h-[60vh] rounded-xl bg-muted/30 ecoop-scroll overflow-auto"
            >
                <TableHeader className="bg-popover/80 sticky top-0">
                    <TableRow>
                        <TableHead className="w-[60px] text-center">
                            #
                        </TableHead>
                        <TableHead className="text-center">From</TableHead>
                        <TableHead className="text-center">To</TableHead>
                        <TableHead className="w-[60px]" />
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {fields.map((field, index) => (
                        <TableRow key={field.id}>
                            <TableCell className="text-center py-2">
                                {index + 1}
                            </TableCell>

                            <TableCell className="py-2 px-2">
                                <Input
                                    type="text"
                                    {...form.register(
                                        `age_ranges.${index}.from` as never,
                                        { valueAsNumber: true }
                                    )}
                                />
                            </TableCell>

                            <TableCell className="py-2 px-2">
                                <Input
                                    type="text"
                                    {...form.register(
                                        `age_ranges.${index}.to` as never,
                                        { valueAsNumber: true }
                                    )}
                                />
                            </TableCell>

                            <TableCell className="py-2 px-2">
                                <Button
                                    onClick={() => remove(index)}
                                    size="icon"
                                    type="button"
                                    variant="ghost"
                                >
                                    <TrashIcon className="size-4 text-destructive" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Modal>
    )
}
