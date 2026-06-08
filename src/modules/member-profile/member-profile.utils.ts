import { TMemberPassbookGenerateSettings } from '.'
import { buildOR } from '../or-builder'

export const isAllowedInputMemberProfilePB = (
    pbOptions?: TMemberPassbookGenerateSettings
) => {
    if (!pbOptions) return true

    return pbOptions.member_profile_passbook_allow_user_input
}

export const buildMemberProfilePB = (
    pbOptions: TMemberPassbookGenerateSettings
) => {
    const padding = pbOptions.member_profile_passbook_padding
    const currentNumber = pbOptions.member_profile_passbook_or_current
    const prefix = pbOptions.member_profile_passbook_prefix

    return buildOR({
        currentOr: currentNumber,
        prefix,
        padding,
    })
}

export const maskName = (name: string) => {
    return name
        .split(' ')
        .map((part) => {
            if (part.length <= 2) return part
            return part[0] + '*'.repeat(part.length - 2) + part[part.length - 1]
        })
        .join(' ')
}

export const maskPassbook = (value: string) => {
    if (value.length <= 4) return value

    return (
        value.substring(0, 2) +
        '*'.repeat(value.length - 4) +
        value.substring(value.length - 2)
    )
}
