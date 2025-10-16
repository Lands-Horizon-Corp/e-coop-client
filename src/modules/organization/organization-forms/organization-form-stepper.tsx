import { useEffect, useState } from 'react'

import { UseFormReturn } from 'react-hook-form'

import { cn } from '@/helpers'

import { FormStepper } from '../../../components/form-stepper/form-stepper'
import { TOrganizationFormValues } from '../organization.validation'
import {
    organizationStepValidations,
    organizationSteps,
} from './organization-stepper-config'

const useMediaQuery = (query: string) => {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        const media = window.matchMedia(query)
        if (media.matches !== matches) {
            setMatches(media.matches)
        }
        const listener = () => setMatches(media.matches)
        media.addEventListener('change', listener)
        return () => media.removeEventListener('change', listener)
    }, [matches, query])

    return matches
}

type OrganizationFormStepperProps = {
    form: UseFormReturn<TOrganizationFormValues>
    activeStep: number
    onStepChange?: (step: number) => void
    disabled?: boolean
    className?: string
    orientation?: 'horizontal' | 'vertical'
    variant?: 'default' | 'minimal' | 'cards'
}

export const OrganizationFormStepper = ({
    form,
    activeStep,
    onStepChange,
    disabled = false,
    className,
    orientation,
    variant = 'default',
}: OrganizationFormStepperProps) => {
    const isMobile = useMediaQuery('(max-width: 640px)')

    const responsiveOrientation =
        orientation || (isMobile ? 'vertical' : 'horizontal')

    const responsiveVariant = isMobile ? 'minimal' : variant

    const handleStepChange = (step: number) => {
        onStepChange?.(step)
    }

    return (
        <div
            className={cn(
                'py-5',
                'px-2 sm:px-4 lg:px-6',
                responsiveOrientation === 'horizontal' && 'overflow-x-auto',
                className
            )}
        >
            <FormStepper
                activeStep={activeStep}
                disabled={disabled}
                form={form}
                onStepChange={handleStepChange}
                orientation={responsiveOrientation}
                showCheckIcon={true}
                stepperSeparatorClassName={cn('block hidden xl:block')}
                steps={organizationSteps}
                stepValidations={organizationStepValidations}
                variant={responsiveVariant}
            />
        </div>
    )
}
