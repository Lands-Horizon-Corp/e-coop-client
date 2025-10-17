import { useRef } from 'react'

import { FieldValues, UseFormReturn } from 'react-hook-form'

import { cn } from '@/helpers'

import { CheckFillIcon } from '@/components/icons'
import {
    Stepper,
    StepperDescription,
    StepperIndicator,
    StepperItem,
    StepperSeparator,
    StepperTitle,
    StepperTrigger,
} from '@/components/ui/stepper'

export type StepConfig = {
    title: string
    description?: string
    stepsNumber?: number
    isCheck?: boolean
}

export type StepValidation = {
    fields: string[]
    validator?: (form: UseFormReturn<any>) => Promise<boolean> | boolean
}

type FormStepperProps<T extends FieldValues = FieldValues> = {
    activeStep: number
    form: UseFormReturn<T>
    steps: StepConfig[]
    onStepChange: (step: number) => void
    stepValidations?: Record<number, StepValidation>
    disabled?: boolean
    showCheckIcon?: boolean
    className?: string
    orientation?: 'horizontal' | 'vertical'
    stepperItemClassName?: string
    stepperSeparatorClassName?: string
    stepperTriggerClassName?: string
    variant?: 'default' | 'minimal' | 'cards'
}

// Default style configurations
const getDefaultStyles = () => ({
    horizontal: {
        stepper: 'w-full grid  rounded-lg gap-2 p-4',
        stepperItem: 'flex text-justify w-full relative items-start',
        stepperTrigger:
            'items-start w-full flex justify-center cursor-pointer flex-col text-center p-2 rounded-md transition-colors',
        stepperSeparator:
            'absolute !w-[50px] !h-[3px] rounded-full left-[calc(12.5rem+0.125rem)] top-[calc(1.2rem+0.125rem)] m-0',
        stepperTitle: 'text-center w-full font-medium',
        stepperDescription: 'text-center text-sm text-muted-foreground mt-1',
        contentWrapper: 'mt-0.5 items-center space-y-1 px-2',
    },
    vertical: {
        stepper: 'w-full flex flex-col space-y-4',
        stepperItem: 'flex w-full relative items-start',
        stepperTrigger:
            'items-start cursor-pointer flex-row text-left p-3 hover:bg-muted/50 rounded-md transition-colors w-full',
        stepperSeparator:
            'absolute left-[1.29rem] top-[calc(3rem+0.25rem)] h-[calc(100%-3rem-0.5rem)] w-px bg-border',
        stepperTitle: 'text-left font-medium',
        stepperDescription: 'text-left text-sm text-muted-foreground mt-1',
        contentWrapper: 'ml-4 flex-1 space-y-1',
    },
})

export const FormStepper = <T extends FieldValues>({
    activeStep,
    form,
    steps,
    onStepChange,
    stepValidations = {},
    disabled = false,
    showCheckIcon = true,
    className,
    orientation = 'vertical',
    stepperItemClassName,
    stepperSeparatorClassName,
    stepperTriggerClassName,
    variant = 'default',
}: FormStepperProps<T>) => {
    const stepRefs = useRef<(HTMLHeadingElement | null)[]>([])

    const defaultStyles = getDefaultStyles()
    const styles = defaultStyles[orientation]

    const validateStep = async (stepIndex: number): Promise<boolean> => {
        const validation = stepValidations[stepIndex]
        if (!validation) return true

        // Use custom validator if provided
        if (validation.validator) {
            return await validation.validator(form)
        }

        // Use form field validation
        if (validation.fields.length > 0) {
            return await form.trigger(validation.fields as any)
        }

        return true
    }

    const handleStepperOnChange = async (value: number) => {
        if (disabled) return

        // Don't allow going to a step higher than the current step + 1
        // unless all previous steps are validated
        if (value > activeStep) {
            for (let i = 0; i < value; i++) {
                const isValid = await validateStep(i)
                if (!isValid) return
            }
        }

        onStepChange(value)
    }

    return (
        <Stepper
            className={cn(
                styles.stepper,
                variant === 'minimal' && 'border-none p-0',
                variant === 'cards' && 'bg-muted/20',
                className
            )}
            onValueChange={handleStepperOnChange}
            orientation={orientation}
            style={
                orientation === 'horizontal'
                    ? { gridTemplateColumns: `repeat(${steps.length}, 1fr)` }
                    : undefined
            }
            value={activeStep}
        >
            {steps.map(({ title, description }, i) => (
                <StepperItem
                    className={cn(
                        styles.stepperItem,
                        variant === 'cards' &&
                            'bg-background border rounded-lg p-2 shadow-sm',
                        stepperItemClassName
                    )}
                    key={i}
                    step={i}
                >
                    <StepperTrigger
                        className={cn(
                            styles.stepperTrigger,
                            disabled && 'cursor-not-allowed opacity-50',
                            stepperTriggerClassName
                        )}
                        disabled={disabled}
                        type="button"
                    >
                        <StepperIndicator
                            asChild
                            className={cn(
                                'self-center ',
                                orientation === 'vertical' ? 'mr-3' : 'mb-2'
                            )}
                        >
                            <div
                                className={cn(
                                    'flex items-center justify-center w-5 h-5 rounded-full border-1 transition-colors',
                                    activeStep === i &&
                                        'bg-primary text-primary-foreground border-primary',
                                    activeStep > i &&
                                        'bg-primary text-primary-foreground border-primary',
                                    activeStep < i &&
                                        'bg-background text-muted-foreground border-muted-foreground'
                                )}
                            >
                                {showCheckIcon && activeStep > i ? (
                                    <CheckFillIcon className="w-4 h-4" />
                                ) : (
                                    <span className="text-xs font-medium">
                                        {i + 1}
                                    </span>
                                )}
                            </div>
                        </StepperIndicator>

                        <div className={cn('w-full', styles.contentWrapper)}>
                            <StepperTitle
                                className={cn(
                                    styles.stepperTitle,
                                    activeStep === i && 'text-primary',
                                    activeStep > i && 'text-primary'
                                )}
                                ref={(el) => {
                                    stepRefs.current[i] = el
                                }}
                            >
                                {title}
                            </StepperTitle>
                            {description && (
                                <StepperDescription
                                    className={styles.stepperDescription}
                                >
                                    {description}
                                </StepperDescription>
                            )}
                        </div>
                    </StepperTrigger>

                    {i < steps.length - 1 && (
                        <StepperSeparator
                            className={cn(
                                styles.stepperSeparator,
                                stepperSeparatorClassName
                            )}
                            // style={getSeparatorStyle(i)}
                        />
                    )}
                </StepperItem>
            ))}
        </Stepper>
    )
}
