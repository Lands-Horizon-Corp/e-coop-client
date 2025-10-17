import { UseFormReturn } from 'react-hook-form'

import { StepConfig, StepValidation } from './form-stepper'

/**
 * Utility function to create step validation config
 */
export const createStepValidation = (
    fields: string[],
    customValidator?: (form: UseFormReturn<any>) => Promise<boolean> | boolean
): StepValidation => ({
    fields,
    validator: customValidator,
})

/**
 * Utility function to create step config
 */
export const createStepConfig = (
    title: string,
    description?: string,
    stepsNumber?: number
): StepConfig => ({
    title,
    description,
    stepsNumber,
    isCheck: false,
})

/**
 * Example of how to use the FormStepper with custom steps:
 *
 * ```tsx
 * import { FormStepper, createStepConfig, createStepValidation } from './form-stepper-utils'
 *
 * const customSteps = [
 *   createStepConfig('Basic Info', 'Enter your basic information'),
 *   createStepConfig('Contact Details', 'Provide contact information'),
 *   createStepConfig('Review', 'Review and confirm your details'),
 * ]
 *
 * const customValidations = {
 *   0: createStepValidation(['firstName', 'lastName']),
 *   1: createStepValidation(['email', 'phone'], async (form) => {
 *     // Custom validation logic
 *     const email = form.getValues('email')
 *     return email.includes('@')
 *   }),
 * }
 *
 * function MyFormStepper() {
 *   const [activeStep, setActiveStep] = useState(0)
 *
 *   return (
 *     <FormStepper
 *       activeStep={activeStep}
 *       form={form}
 *       steps={customSteps}
 *       onStepChange={setActiveStep}
 *       stepValidations={customValidations}
 *       disabled={isSubmitting}
 *       showCheckIcon={true}
 *     />
 *   )
 * }
 * ```
 */
