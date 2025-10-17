import {
    StepConfig,
    StepValidation,
} from '../../../components/form-stepper/form-stepper'

export const organizationSteps: StepConfig[] = [
    {
        title: 'Organization Details',
        description: 'Add your organization details',
        stepsNumber: 1,
        isCheck: false,
    },
    {
        title: 'Choose your plan',
        description: 'Select a subscription plan',
        stepsNumber: 2,
        isCheck: false,
    },
    {
        title: 'Billing',
        description: 'Add a payment',
        stepsNumber: 3,
        isCheck: false,
    },
    {
        title: 'Finishing Up',
        description: 'Confirm your details.',
        stepsNumber: 4,
        isCheck: false,
    },
]

export const organizationStepValidations: Record<number, StepValidation> = {
    0: {
        fields: ['name', 'media_id', 'email', 'cover_media_id', 'description'],
        // validator: async (form) => {
        //     // Example: Check if organization name is unique
        //     const name = form.getValues('name')
        //     if (name && name.length < 3) {
        //         form.setError('name', {
        //             message: 'Organization name must be at least 3 characters'
        //         })
        //         return false
        //     }
        //     return true
        // }
    },
    1: {
        fields: ['subscription_plan_id'],
        // validator: async (form) => {
        //     const planId = form.getValues('subscription_plan_id')
        //     if (!planId) {
        //         // You could show a toast or set a custom error
        //         return false
        //     }
        //     return true
        // }
    },
    2: {
        fields: [],
    },
    3: {
        fields: [],
    },
}
