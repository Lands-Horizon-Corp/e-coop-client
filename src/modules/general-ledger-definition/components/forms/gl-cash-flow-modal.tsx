import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'

import {
    GLCloseBookSchema,
    IGLCloseBookFormValues,
} from '../../general-ledger-definition.validation'

interface Props extends IModalProps {
    onProcess?: (data: IGLCloseBookFormValues) => void
}

const GLCloseBookModal = ({ onProcess, ...props }: Props) => {
    const form = useForm<IGLCloseBookFormValues>({
        resolver: standardSchemaResolver(GLCloseBookSchema),
        defaultValues: {
            year: new Date().getFullYear(),
        },
    })

    const onSubmit = form.handleSubmit((data) => {
        onProcess?.(data)
        props.onOpenChange?.(false)
    })

    return (
        <Modal title="GL - Close Book" {...props}>
            <Form {...form}>
                <form className="space-y-4" onSubmit={onSubmit}>
                    <FormFieldWrapper
                        control={form.control}
                        label="Year"
                        name="year"
                        render={({ field }) => (
                            <Input {...field} type="number" />
                        )}
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

export default GLCloseBookModal
