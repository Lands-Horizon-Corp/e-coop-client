import { UseFormReturn } from 'react-hook-form'

import { TOrganizationFormValues } from '../organization.validation'
import { organizationStepValidations } from './organization-stepper-config'

export const useOrganizationFormStepperNavigation = (
    form: UseFormReturn<TOrganizationFormValues>,
    activeStep: number,
    setActiveStep: (step: number) => void,
    totalSteps: number
) => {
    const validateStep = async (stepIndex: number): Promise<boolean> => {
        const validation = organizationStepValidations[stepIndex]
        if (!validation) return true

        if (validation.validator) {
            return await validation.validator(form)
        }

        if (validation.fields.length > 0) {
            return await form.trigger(validation.fields as any)
        }

        return true
    }

    const goToNextStep = async (): Promise<boolean> => {
        // Validate current step before proceeding
        const isValid = await validateStep(activeStep)
        if (!isValid) return false

        if (activeStep < totalSteps - 1) {
            setActiveStep(activeStep + 1)
            return true
        }
        return false
    }

    const goToPreviousStep = (): boolean => {
        if (activeStep <= 0) return false
        setActiveStep(activeStep - 1)
        return true
    }

    const goToStep = async (targetStep: number): Promise<boolean> => {
        if (targetStep < 0 || targetStep >= totalSteps) return false

        // If going forward, validate all steps up to target
        if (targetStep > activeStep) {
            for (let i = activeStep; i < targetStep; i++) {
                const isValid = await validateStep(i)
                if (!isValid) return false
            }
        }

        setActiveStep(targetStep)
        return true
    }

    const validateCurrentStep = async (): Promise<boolean> => {
        return await validateStep(activeStep)
    }

    const isFirstStep = activeStep === 0
    const isFinalStep = activeStep === totalSteps - 1

    return {
        goToNextStep,
        goToPreviousStep,
        goToStep,
        validateCurrentStep,
        validateStep,
        isFirstStep,
        isFinalStep,
    }
}
