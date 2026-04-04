import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { GradientBackground } from '@/components/gradient-background/gradient-background'
import { MoneyBagIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Checkbox } from '@/components/ui/checkbox'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import {
    FSAccountSchema,
    IFSAccountFormValues,
} from '../../general-ledger-definition.validation'

interface Props extends IModalProps {
    onSubmit?: (data: IFSAccountFormValues) => void
}

const FSAccountModal = ({ onSubmit, ...props }: Props) => {
    const form = useForm<IFSAccountFormValues>({
        resolver: standardSchemaResolver(FSAccountSchema),
        defaultValues: {
            account_code: '',
            account_title: '',
            type: 'standard',
            title_margin: 'indent1',
            exclude_consolidated: false,
        },
    })

    const submit = form.handleSubmit((data) => {
        onSubmit?.(data)
        props.onOpenChange?.(false)
    })

    return (
        <Modal title="Update FS Accounts" {...props}>
            <Form {...form}>
                <form className="space-y-4" onSubmit={submit}>
                    <FormFieldWrapper
                        control={form.control}
                        label="Account Code"
                        name="account_code"
                        render={({ field }) => <Input {...field} />}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Account Title"
                        name="account_title"
                        render={({ field }) => <Input {...field} />}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Types"
                        name="type"
                        render={({ field }) => {
                            const options = [
                                {
                                    value: 'standard',
                                    label: 'Standard',
                                    description:
                                        'Regular financial statement account.',
                                },
                                {
                                    value: 'group_title',
                                    label: 'Group Title',
                                    description:
                                        'Header used to group related accounts.',
                                },
                                {
                                    value: 'group_total',
                                    label: 'Group Total',
                                    description:
                                        'Displays the total for the grouped accounts.',
                                },
                                {
                                    value: 'sub_group_title',
                                    label: 'Sub Group Title',
                                    description:
                                        'Sub-category header within a group.',
                                },
                                {
                                    value: 'sub_group_total',
                                    label: 'Sub Group Total',
                                    description:
                                        'Total of accounts inside a sub-group.',
                                },
                                {
                                    value: 'header_total',
                                    label: 'Header Total',
                                    description:
                                        'Top-level total for a section of the report.',
                                },
                            ]

                            return (
                                <RadioGroup
                                    className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {options.map((option) => (
                                        <div
                                            className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-3 outline-none duration-200 ease-out has-checked:border-primary/30 has-checked:bg-primary/40"
                                            key={option.value}
                                        >
                                            <RadioGroupItem
                                                className="order-1 after:absolute after:inset-0"
                                                id={`type-${option.value}`}
                                                value={option.value}
                                            />

                                            <div className="flex grow items-center gap-3">
                                                <div className="grid gap-1">
                                                    <Label
                                                        htmlFor={`type-${option.value}`}
                                                    >
                                                        {option.label}
                                                    </Label>

                                                    <p className="text-xs text-muted-foreground">
                                                        {option.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </RadioGroup>
                            )
                        }}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Title Margin"
                        name="title_margin"
                        render={({ field }) => {
                            const options = [
                                {
                                    value: 'indent1',
                                    label: 'Indented #1',
                                    description:
                                        'First level indentation for titles.',
                                },
                                {
                                    value: 'indent2',
                                    label: 'Indented #2',
                                    description:
                                        'Second level indentation for titles.',
                                },
                                {
                                    value: 'left',
                                    label: 'Left Justify',
                                    description:
                                        'Align title to the left side.',
                                },
                                {
                                    value: 'center',
                                    label: 'Centered',
                                    description:
                                        'Center the title in the report.',
                                },
                                {
                                    value: 'left_right',
                                    label: 'Left/Right Indented',
                                    description:
                                        'Indent title from both left and right.',
                                },
                            ]

                            return (
                                <RadioGroup
                                    className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {options.map((option) => (
                                        <div
                                            className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-3 outline-none duration-200 ease-out has-checked:border-primary/30 has-checked:bg-primary/40"
                                            key={option.value}
                                        >
                                            <RadioGroupItem
                                                className="order-1 after:absolute after:inset-0"
                                                id={`title-margin-${option.value}`}
                                                value={option.value}
                                            />

                                            <div className="flex grow items-center gap-3">
                                                <div className="grid gap-1">
                                                    <Label
                                                        htmlFor={`title-margin-${option.value}`}
                                                    >
                                                        {option.label}
                                                    </Label>

                                                    <p className="text-xs text-muted-foreground">
                                                        {option.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </RadioGroup>
                            )
                        }}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="exclude_consolidated"
                        render={({ field }) => {
                            return (
                                <GradientBackground
                                    className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-checked:border-primary/30 has-checked:bg-primary/40"
                                    gradientOnly
                                >
                                    <Checkbox
                                        aria-describedby={`${field.name}-description`}
                                        checked={field.value || false}
                                        className="order-1 after:absolute after:inset-0"
                                        id={field.name}
                                        name={field.name}
                                        onCheckedChange={field.onChange}
                                    />

                                    <div className="flex grow items-center gap-3">
                                        <div className="size-fit rounded-full bg-secondary p-2">
                                            {/* you can change icon if you want */}
                                            <MoneyBagIcon className="size-5" />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor={field.name}>
                                                Exclude from Consolidated Total
                                            </Label>

                                            <p
                                                className="text-xs text-muted-foreground"
                                                id={`${field.name}-description`}
                                            >
                                                Enable this option if the
                                                account should not be included
                                                in the consolidated financial
                                                statement totals.
                                            </p>
                                        </div>
                                    </div>
                                </GradientBackground>
                            )
                        }}
                    />

                    <FormFooterResetSubmit
                        onReset={() => form.reset()}
                        submitText="OK"
                    />
                </form>
            </Form>
        </Modal>
    )
}

export default FSAccountModal
