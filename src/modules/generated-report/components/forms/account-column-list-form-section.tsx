import { useRef, useState } from 'react'

import { DndProvider, DropTargetMonitor, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import z from 'zod'

import { cn } from '@/helpers/tw-utils'
import { IAccount } from '@/modules/account'
import { AccountMultiPickerModal } from '@/modules/account/components/picker/account-multi-picker'
import { entityIdSchema } from '@/validation'

import { DragHandleIcon, XIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { FormLabel } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import { useInternalState } from '@/hooks/use-internal-state'

const DND_TYPE = 'ACCOUNT_COLUMN_ITEM'

export const AccountColumnEntrySchema = z.object({
    account_id: entityIdSchema,
    account: z.any().optional(), // FOR UI only
    display_entry_type: z.enum(['CR', 'DR']),
})

export const WithAccountColumnListSchema = z
    .object({
        account_column_list: z
            .array(AccountColumnEntrySchema)
            .min(1, 'Must have minimum of 1 account column to display')
            .default([]),
        account_column_list_showable_first: z.coerce
            .number()
            .min(1, 'Require to show at least 1 account from list')
            .default(1),
    })
    .refine(
        (data) =>
            data.account_column_list_showable_first <=
            data.account_column_list.length,
        {
            message:
                'Cannot show more accounts than what is available in the list',
            path: ['account_column_list_showable_first'],
        }
    )

export type TAccountEntry = z.infer<typeof AccountColumnEntrySchema>

const reindex = (cols: TAccountEntry[]): TAccountEntry[] =>
    cols.map((c, i) => ({ ...c, index: i }))

export const AccountListOrder = ({
    account_column,
    onApply,
}: {
    account_column: TAccountEntry[]
    onApply: (newAccountColumns: TAccountEntry[]) => void
}) => {
    const [items, setItems] = useState<TAccountEntry[]>(account_column)

    const handleConfirm = (accounts: IAccount[]) => {
        const selectedIds = new Set(accounts.map((a) => a.id))
        const kept = items.filter((c) => selectedIds.has(c.account_id))
        const existingIds = new Set(kept.map((c) => c.account_id))
        const added: TAccountEntry[] = accounts
            .filter((a) => !existingIds.has(a.id))
            .map((a) => ({
                account_id: a.id,
                account: a,
                display_entry_type: 'CR',
            }))
        setItems(reindex([...kept, ...added]))
    }

    const removeAt = (i: number) => {
        const next = items.slice()
        next.splice(i, 1)
        setItems(reindex(next))
    }

    const moveItem = (from: number, to: number) => {
        if (from === to) return
        setItems((prev) => {
            const next = prev.slice()
            const [moved] = next.splice(from, 1)
            next.splice(to, 0, moved)
            return reindex(next)
        })
    }

    const updateEntryType = (index: number, type: 'CR' | 'DR') => {
        setItems((prev) => {
            const next = prev.slice()
            next[index] = {
                ...next[index],
                display_entry_type: type,
            }
            return next
        })
    }

    const defaultSelected = items
        .map((c) => (c.account ? c.account : { id: c.account_id }))
        .filter(Boolean) as IAccount[]

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-col h-full min-h-0">
                <div className="flex items-center justify-between gap-2">
                    <div>
                        <h4 className="text-base font-medium">
                            Define Account Column
                        </h4>
                        <p className="text-muted-foreground text-sm">
                            Drag and Drop to re-order
                        </p>
                    </div>
                    <div className="flex flex-col gap-y-2">
                        <AccountMultiPickerModal
                            pickerProps={{
                                defaultSelected,
                                onConfirm: handleConfirm,
                            }}
                            trigger={
                                <Button type="button" variant="outline">
                                    {items.length === 0
                                        ? 'Select account'
                                        : `${items.length} Accounts Selected`}
                                </Button>
                            }
                        />
                    </div>
                </div>

                <Separator className="my-3" />

                <div className="overflow-y-scroll ecoop-scroll min-h-0 max-h-full flex-1">
                    {items.length === 0 ? (
                        <p className="py-6 text-center text-sm text-muted-foreground">
                            No accounts selected. Click + to add.
                        </p>
                    ) : (
                        <ul className="flex flex-col gap-2">
                            {items.map((col, i) => (
                                <AccountRow
                                    entry={col}
                                    index={i}
                                    key={`${col.account_id}-${i}`}
                                    moveItem={moveItem}
                                    onChangeType={updateEntryType}
                                    removeAt={removeAt}
                                />
                            ))}
                        </ul>
                    )}
                </div>

                <div className="mt-4 flex justify-end">
                    <Button onClick={() => onApply(items)} type="button">
                        Apply
                    </Button>
                </div>
            </div>
        </DndProvider>
    )
}

const AccountRow = ({
    entry,
    index,
    moveItem,
    removeAt,
    onChangeType,
}: {
    entry: TAccountEntry
    index: number
    moveItem: (from: number, to: number) => void
    removeAt: (i: number) => void
    onChangeType: (index: number, type: 'CR' | 'DR') => void
}) => {
    const ref = useRef<HTMLLIElement>(null)

    const [{ isDragging }, drag, preview] = useDrag({
        type: DND_TYPE,
        item: { index },
        collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    })

    const [{ isOver }, drop] = useDrop({
        accept: DND_TYPE,
        collect: (monitor: DropTargetMonitor) => ({
            isOver: monitor.isOver(),
        }),
        hover: (item: { index: number }) => {
            if (item.index !== index) {
                moveItem(item.index, index)
                item.index = index
            }
        },
    })

    preview(drop(ref))

    const label = entry.account?.name ?? entry.account?.name ?? entry.account_id

    return (
        <li
            className="flex items-center gap-2 rounded-md border bg-card p-2 text-card-foreground data-[dragging]:opacity-50 data-[over]:border-primary"
            data-dragging={isDragging || undefined}
            data-over={isOver || undefined}
            ref={ref}
        >
            <Button
                aria-label="Drag to reorder"
                className="cursor-grab active:cursor-grabbing"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ref={drag as any}
                size="icon"
                type="button"
                variant="ghost"
            >
                <DragHandleIcon />
            </Button>

            <span className="w-6 text-center text-xs text-muted-foreground tabular-nums">
                {index + 1}
            </span>

            <div className="flex-1 truncate text-sm">{label}</div>

            <ButtonGroup>
                <Button
                    onClick={() => onChangeType(index, 'CR')}
                    size="xs"
                    type="button"
                    variant={
                        entry.display_entry_type === 'CR'
                            ? 'default'
                            : 'secondary'
                    }
                >
                    CR
                </Button>
                <Button
                    onClick={() => onChangeType(index, 'DR')}
                    size="xs"
                    type="button"
                    variant={
                        entry.display_entry_type === 'DR'
                            ? 'default'
                            : 'secondary'
                    }
                >
                    DR
                </Button>
            </ButtonGroup>

            <Button
                aria-label="Remove account"
                onClick={() => removeAt(index)}
                size="icon"
                type="button"
                variant="ghost"
            >
                <XIcon />
            </Button>
        </li>
    )
}

export const AccountListOrderModal = ({
    account_column,
    onApply,
    open,
    onOpenChange,
    ...props
}: {
    account_column: TAccountEntry[]
    onApply: (newAccountColumns: TAccountEntry[]) => void
} & IModalProps) => {
    const [state, setState] = useInternalState(false, open, onOpenChange)

    return (
        <Modal
            {...props}
            className="!max-w-xl flex flex-col max-h-[80vh]"
            closeButtonClassName="sr-only"
            description="Arrange and select accounts"
            onOpenChange={setState}
            open={state}
            title="Define Account Column"
            titleHeaderContainerClassName="sr-only"
        >
            <div className="flex flex-col h-full min-h-0">
                <AccountListOrder
                    account_column={account_column}
                    onApply={(data) => {
                        onApply(data)
                        setState(false)
                    }}
                />
            </div>
        </Modal>
    )
}

export const AccountColumnListFormSection = <TForm extends FieldValues>({
    form,
    rootClassName,
    contentClassName,
}: {
    form: UseFormReturn<TForm>
    rootClassName?: string
    contentClassName?: string
}) => {
    return (
        <div
            className={cn(
                'bg-popover p-4 rounded-2xl space-y-2',
                rootClassName
            )}
        >
            <div>
                <FormLabel className="text-sm">
                    Report Detailed Column Account
                </FormLabel>
                <p className="text-xs text-muted-foreground">
                    Setup Column/Accounts to be displayed in the report table
                </p>
            </div>
            <div className={cn('flex gap-x-4', contentClassName)}>
                <FormFieldWrapper
                    className="flex-1"
                    control={form.control}
                    description="Define what accounts will be included in the report column"
                    label="Account Column List"
                    name={'account_column_list' as Path<TForm>}
                    render={({ field }) => {
                        const accounts =
                            form.getValues(
                                'account_column_list' as Path<TForm>
                            ) ?? []

                        return (
                            <div className="flex flex-col gap-y-2">
                                <AccountListOrderModal
                                    account_column={accounts as TAccountEntry[]}
                                    onApply={(items) => {
                                        const ids = items.map(
                                            (i) => i.account_id
                                        )
                                        const fullAccounts = items.map((i) => i)

                                        field.onChange(ids)
                                        form.setValue(
                                            'account_column_list' as Path<TForm>,
                                            fullAccounts as TForm[Path<TForm>]
                                        )
                                    }}
                                    trigger={
                                        <Button type="button" variant="outline">
                                            {(field.value ?? []).length === 0
                                                ? 'Define Report Account Columns'
                                                : `${(field.value ?? []).length} Column Defined`}
                                        </Button>
                                    }
                                />
                            </div>
                        )
                    }}
                />
                <FormFieldWrapper
                    className="w-fit"
                    control={form.control}
                    description="Will show first number of account in the table"
                    label="Show First"
                    name={'account_column_list_showable_first' as Path<TForm>}
                    render={({ field }) => <Input {...field} />}
                />
            </div>
        </div>
    )
}
