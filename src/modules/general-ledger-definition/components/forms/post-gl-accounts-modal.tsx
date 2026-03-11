import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

import {
    GLPostSchema,
    IGLPostFormValues,
} from '../../general-ledger-definition.validation'

interface Props extends IModalProps {
    onProcess?: (data: IGLPostFormValues) => void
}

const GLPostModal = ({ onProcess, ...props }: Props) => {
    const form = useForm<IGLPostFormValues>({
        resolver: standardSchemaResolver(GLPostSchema),
        defaultValues: {
            start_date: '',
            end_date: '',
            is_unpost: false,
        },
    })

    const isUnpost = form.watch('is_unpost')

    const onSubmit = form.handleSubmit((data) => {
        onProcess?.(data)
        props.onOpenChange?.(false)
    })

    return (
        <Modal
            title={isUnpost ? 'UN-POST to GL Accounts' : 'POST to GL Accounts'}
            {...props}
        >
            <Form {...form}>
                <form className="space-y-4" onSubmit={onSubmit}>
                    <FormFieldWrapper
                        control={form.control}
                        label="Mode"
                        name="is_unpost"
                        render={({ field }) => (
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Start Date"
                        name="start_date"
                        render={({ field }) => <Input {...field} type="date" />}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="End Date"
                        name="end_date"
                        render={({ field }) => <Input {...field} type="date" />}
                    />

                    <FormFooterResetSubmit
                        onReset={() => form.reset()}
                        submitText="Process"
                    />
                </form>
            </Form>
        </Modal>
    )
}

export default GLPostModal
