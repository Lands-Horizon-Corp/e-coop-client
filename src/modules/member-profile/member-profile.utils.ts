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
