import { describe, expect, it } from 'vitest'

import { buildMemberProfilePB } from './member-profile.utils'

describe('buildMemberProfilePB', () => {
    const baseSettings = {
        member_profile_passbook_allow_user_input: false,
        member_profile_passbook_or_unique: true,
        member_profile_passbook_prefix: 'PB-',
        member_profile_passbook_or_start: 1,
        member_profile_passbook_or_current: 12,
        member_profile_passbook_padding: 5,
    }

    it('builds passbook number using current number, prefix, and padding', () => {
        const result = buildMemberProfilePB(baseSettings)

        // current = 12, padding = 5 → 00012
        expect(result).toBe('PB-00012')
    })

    it('respects custom prefix', () => {
        const result = buildMemberProfilePB({
            ...baseSettings,
            member_profile_passbook_prefix: 'MPB-',
        })

        expect(result.startsWith('MPB-')).toBe(true)
    })

    it('respects different padding values', () => {
        const result = buildMemberProfilePB({
            ...baseSettings,
            member_profile_passbook_or_current: 7,
            member_profile_passbook_padding: 3,
        })

        expect(result).toBe('PB-007')
    })

    it('handles zero passbook number correctly', () => {
        const result = buildMemberProfilePB({
            ...baseSettings,
            member_profile_passbook_or_current: 0,
            member_profile_passbook_padding: 4,
        })

        expect(result).toBe('PB-0000')
    })

    it('does not depend on allow_user_input flag', () => {
        const result = buildMemberProfilePB({
            ...baseSettings,
            member_profile_passbook_allow_user_input: true,
        })

        expect(result).toBe('PB-00012')
    })

    it('does not break when prefix is empty', () => {
        const result = buildMemberProfilePB({
            ...baseSettings,
            member_profile_passbook_prefix: '',
        })

        expect(result).toBe('00012')
    })
})
