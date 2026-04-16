import { useEffect, useRef, useState } from 'react'

import { Path, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

import { cn } from '@/helpers'
import { IMedia } from '@/modules/media'
import { SignatureSchema } from '@/validation'
import { useHotkeys } from 'react-hotkeys-hook'

import {
    CheckFillIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import SignatureField from '@/components/ui/signature-field'
import {
    Stepper,
    StepperDescription,
    StepperIndicator,
    StepperItem,
    StepperSeparator,
    StepperTitle,
    StepperTrigger,
} from '@/components/ui/stepper'

import { useInternalState } from '@/hooks/use-internal-state'

import Modal, { IModalProps } from '../modals/modal'

type TSignatureFormValues = z.infer<typeof SignatureSchema>

export type TWithSignatureSchema = {
    signatures: TSignatureFormValues
}

type Step = {
    title: string
    description?: string
    longDescription?: string
    fields: Path<TWithSignatureSchema>[]
}

const Steps: Step[] = [
    {
        title: 'Prepared By',
        description: 'Prepared the report',
        longDescription: 'Responsible for compiling records',
        fields: [
            'signatures.prepared_by_name',
            'signatures.prepared_by_position',
            'signatures.prepared_by_signature_media_id',
        ],
    },
    {
        title: 'Certified By',
        description: 'Certified the report',
        longDescription: 'Verifies correctness',
        fields: [
            'signatures.certified_by_name',
            'signatures.certified_by_position',
            'signatures.certified_by_signature_media_id',
        ],
    },
    {
        title: 'Checked By',
        description: 'Checked the report',
        longDescription: 'Reviews for discrepancies',
        fields: [
            'signatures.check_by_name',
            'signatures.check_by_position',
            'signatures.check_by_signature_media_id',
        ],
    },
    {
        title: 'Approved By',
        description: 'Approved the report',
        longDescription: 'Final approval',
        fields: [
            'signatures.approved_by_name',
            'signatures.approved_by_position',
            'signatures.approved_by_signature_media_id',
        ],
    },
    {
        title: 'Verified By',
        description: 'Verified completion',
        longDescription: 'Ensures compliance',
        fields: [
            'signatures.verified_by_name',
            'signatures.verified_by_position',
            'signatures.verified_by_signature_media_id',
        ],
    },
    {
        title: 'Acknowledge By',
        description: 'Acknowledged',
        longDescription: 'Confirms completion',
        fields: [
            'signatures.acknowledge_by_name',
            'signatures.acknowledge_by_position',
            'signatures.acknowledge_by_signature_media_id',
        ],
    },
    {
        title: 'Noted By',
        description: 'Noted for records',
        longDescription: 'Ensures documentation',
        fields: [
            'signatures.noted_by_name',
            'signatures.noted_by_position',
            'signatures.noted_by_signature_media_id',
        ],
    },
    {
        title: 'Posted By',
        description: 'Posted the report',
        longDescription: 'System entry',
        fields: [
            'signatures.posted_by_name',
            'signatures.posted_by_position',
            'signatures.posted_by_signature_media_id',
        ],
    },
    {
        title: 'Paid By',
        description: 'Processed payment',
        longDescription: 'Handles settlement',
        fields: [
            'signatures.paid_by_name',
            'signatures.paid_by_position',
            'signatures.paid_by_signature_media_id',
        ],
    },
]

export interface ISignatureSectionProps {
    form: UseFormReturn<TWithSignatureSchema>
}

const SignatureSection = ({ form }: ISignatureSectionProps) => {
    const [step, setStep] = useState(0)
    const stepRefs = useRef<(HTMLHeadingElement | null)[]>([])

    useEffect(() => {
        const node = stepRefs.current[step]
        if (node) {
            node.scrollIntoView({ behavior: 'smooth', block: 'center' })
            node.focus()
        }
    }, [step])

    const onNext = async () => {
        const valid = await form.trigger(Steps[step].fields, {
            shouldFocus: true,
        })
        if (valid) setStep((p) => p + 1)
    }

    const onPrev = () => setStep((p) => Math.max(p - 1, 0))

    useHotkeys(
        ['arrowright', 'arrowdown'],
        (e) => {
            e.preventDefault()
            if (step < Steps.length - 1) onNext()
        },
        [step]
    )

    useHotkeys(
        ['arrowleft', 'arrowup'],
        (e) => {
            e.preventDefault()
            onPrev()
        },
        [step]
    )

    return (
        <Form {...form}>
            <div className="flex w-full gap-x-4">
                <div className="ecoop-scroll max-h-[90vh] w-[30%] overflow-auto">
                    <Stepper
                        onValueChange={setStep}
                        orientation="vertical"
                        value={step}
                    >
                        {Steps.map(({ title, description }, i) => (
                            <StepperItem
                                className="not-last:flex-1 relative items-start"
                                key={i}
                                step={i}
                            >
                                <StepperTrigger
                                    className="items-start cursor-pointer rounded pb-8 last:pb-0"
                                    type="button"
                                >
                                    <StepperIndicator asChild>
                                        <p>{i + 1}</p>
                                    </StepperIndicator>
                                    <div className="mt-0.5 space-y-1 px-2 text-left">
                                        <StepperTitle
                                            ref={(el) => {
                                                stepRefs.current[i] = el
                                            }}
                                        >
                                            {title}{' '}
                                            {!!form.getValues(
                                                Steps[i].fields[0]
                                            ) && (
                                                <CheckFillIcon className="inline ml-1 text-primary" />
                                            )}
                                        </StepperTitle>
                                        <StepperDescription>
                                            {description}
                                        </StepperDescription>
                                    </div>
                                </StepperTrigger>
                                {i < Steps.length - 1 && (
                                    <StepperSeparator className="absolute inset-y-0 left-3 top-[calc(1.5rem+0.125rem)] -order-1 m-0 -translate-x-1/2" />
                                )}
                            </StepperItem>
                        ))}
                    </Stepper>
                </div>

                <fieldset className="ecoop-scroll max-h-[90vh] flex-1 space-y-4 overflow-auto px-2">
                    <fieldset className="space-y-3" key={step}>
                        <legend className="font-semibold">
                            {Steps[step].title}
                        </legend>
                        <sub className="text-sm text-muted-foreground">
                            {Steps[step].longDescription}
                        </sub>
                        <Separator />

                        <FormFieldWrapper
                            control={form.control}
                            label="Name"
                            name={Steps[step].fields[0]}
                            render={({ field }) => (
                                <Input {...field} autoComplete="off" />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Position"
                            name={Steps[step].fields[1]}
                            render={({ field }) => (
                                <Input {...field} autoComplete="off" />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Signature"
                            name={Steps[step].fields[2]}
                            render={({ field }) => {
                                const value = form.watch(
                                    Steps[step].fields[2].replace(
                                        '_id',
                                        ''
                                    ) as Path<TWithSignatureSchema>
                                )

                                return (
                                    <SignatureField
                                        {...field}
                                        onChange={(img) => {
                                            field.onChange(
                                                img ? img.id : undefined
                                            )

                                            form.setValue(
                                                Steps[step].fields[2].replace(
                                                    '_id',
                                                    ''
                                                ) as Path<TWithSignatureSchema>,
                                                img
                                            )
                                        }}
                                        value={
                                            value
                                                ? (value as IMedia).download_url
                                                : value
                                        }
                                    />
                                )
                            }}
                        />
                    </fieldset>
                </fieldset>
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-x-1">
                <div className="flex items-center gap-x-2">
                    <Button
                        disabled={step === 0}
                        onClick={onPrev}
                        size="icon"
                        type="button"
                        variant="secondary"
                    >
                        <ChevronLeftIcon />
                    </Button>

                    <Button
                        disabled={step === Steps.length - 1}
                        onClick={onNext}
                        size="icon"
                        type="button"
                        variant="secondary"
                    >
                        <ChevronRightIcon />
                    </Button>
                </div>
            </div>
        </Form>
    )
}

export default SignatureSection

export const SignatureSectionModal = ({
    form,
    className,
    ...props
}: IModalProps & {
    form: UseFormReturn<TWithSignatureSchema>
}) => {
    const [open, onOpenChange] = useInternalState(
        false,
        props.open,
        props.onOpenChange
    )

    return (
        <Modal
            className={cn('!max-w-5xl', className)}
            onOpenChange={onOpenChange}
            open={open}
            {...props}
        >
            <SignatureSection form={form} />
        </Modal>
    )
}
