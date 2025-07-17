import logger from '@/helpers/loggers/logger'

import contactNumberVerificationRaw from '../assets/sms-templates/message.json'

// Define the types of templates available
type Templates = 'contactNumber' | 'changePassword'

// Precompile the Handlebars templates
const TEMPLATE_MAP: Record<Templates, string> = {
    contactNumber: contactNumberVerificationRaw['ContactNumber'],
    changePassword: contactNumberVerificationRaw['ChangePassword'],
}

/**
 * Retrieves and generates the SMS content based on the template type.
 * @param template - The type of template to use ('contactVerification').
 * @param params - An object containing parameters to inject into the template.
 * @returns The generated SMS content as a string.
 * @throws Will throw an error if the template type is invalid or generation fails.
 */
export const getSMSContent = (template: Templates): string => {
    const compiledTemplate = TEMPLATE_MAP[template]
    if (!compiledTemplate) {
        throw new Error(`"${template}" is not a valid template type.`)
    }
    try {
        return compiledTemplate
    } catch (error) {
        logger.error('Error generating SMS content:', error)
        throw new Error('Failed to generate SMS content.')
    }
}
