import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Checkbox } from '@/components/ui/checkbox'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
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
                        render={({ field }) => (
                            <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <RadioGroupItem value="standard">
                                    Standard
                                </RadioGroupItem>
                                <RadioGroupItem value="group_title">
                                    Group Title
                                </RadioGroupItem>
                                <RadioGroupItem value="group_total">
                                    Group Total
                                </RadioGroupItem>
                                <RadioGroupItem value="sub_group_title">
                                    Sub Group Title
                                </RadioGroupItem>
                                <RadioGroupItem value="sub_group_total">
                                    Sub Group Total
                                </RadioGroupItem>
                                <RadioGroupItem value="header_total">
                                    Header Total
                                </RadioGroupItem>
                            </RadioGroup>
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Title Margin"
                        name="title_margin"
                        render={({ field }) => (
                            <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                            >
                                <RadioGroupItem value="indent1">
                                    Indented #1
                                </RadioGroupItem>
                                <RadioGroupItem value="indent2">
                                    Indented #2
                                </RadioGroupItem>
                                <RadioGroupItem value="left">
                                    Left Justify
                                </RadioGroupItem>
                                <RadioGroupItem value="center">
                                    Centered
                                </RadioGroupItem>
                                <RadioGroupItem value="left_right">
                                    Left/Right Indented
                                </RadioGroupItem>
                            </RadioGroup>
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        name="exclude_consolidated"
                        render={({ field }) => (
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                                Exclude on consolidated total
                            </div>
                        )}
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
