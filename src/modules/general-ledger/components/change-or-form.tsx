import { ReactNode } from 'react'

import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { TicketIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button, ButtonProps } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useInternalState } from '@/hooks/use-internal-state'

import { useChangeOR } from '../general-ledger.service'
import { ChangeORSchema } from '../general-ledger.validation'

type TChangeORValues = z.infer<typeof ChangeORSchema>

interface IChangeORFormProps {
    className?: string
    onSuccess?: () => void
    readOnly?: boolean
}

const ChangeORForm = ({ className, onSuccess }: IChangeORFormProps) => {
    const form = useForm<TChangeORValues>({
        resolver: standardSchemaResolver(ChangeORSchema),
        defaultValues: {
            or_from: '',
            or_to: '',
        },
    })

    const mutation = useChangeOR()

    const { formRef, handleFocusError } = useFormHelper({
        form,
    })

    const onSubmit = form.handleSubmit((formData) => {
        mutation.mutate(formData, {
            ...withToastCallbacks({
                textSuccess: 'OR Successfully Changed',
                onSuccess,
            }),
        })
    }, handleFocusError)

    const error = serverRequestErrExtractor({
        error: mutation.error,
    })

    return (
        <Form {...form}>
            <form
                className={cn('flex flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset className="grid gap-4" disabled={mutation.isPending}>
                    <FormFieldWrapper
                        control={form.control}
                        label="OR From"
                        name="or_from"
                        render={({ field }) => (
                            <Input {...field} placeholder="Enter OR Number" />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="OR To"
                        name="or_to"
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Enter new OR Number"
                            />
                        )}
                    />
                </fieldset>

                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty}
                    error={error}
                    isLoading={mutation.isPending}
                    onReset={() => form.reset()}
                    submitText="Change OR"
                />
            </form>
        </Form>
    )
}

interface IChangeORFormModalProps
    extends IModalProps, Omit<ButtonProps, 'title'> {
    buttonProps?: Omit<ButtonProps, 'title'>
    buttonText?: string | ReactNode
}

export const ChangeORFormModal = ({
    title = 'Change OR Number',
    description = 'Update an existing OR number in the general ledger.',
    className,
    open: controlledOpen,
    onOpenChange,
    buttonProps,
    buttonText = 'Change OR',

    ...props
}: IChangeORFormModalProps) => {
    const [open, setOpen] = useInternalState(
        false,
        controlledOpen,
        onOpenChange
    )
    return (
        <>
            <Button
                {...buttonProps}
                hoverVariant="primary"
                className={cn(className)}
                onClick={() => setOpen(true)}
            >
                <TicketIcon /> {buttonText}
            </Button>

            <Modal
                className={cn(className)}
                description={description}
                onOpenChange={setOpen}
                open={open}
                title={title}
                {...props}
            >
                <ChangeORForm
                    onSuccess={() => {
                        onOpenChange?.(false)
                        setOpen(false)
                    }}
                />
            </Modal>
        </>
    )
}
