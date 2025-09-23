import { IMemberProfile } from '@/modules/member-profile'
import { IQRMemberProfile } from '@/modules/qr-crypto'
import { create } from 'zustand'

interface MemberPickerStoreProps {
    isOpen: boolean
    decodedMemberProfile?: IQRMemberProfile
    openMemberPicker: boolean
    startScanner: boolean

    onOpenMemberPicker: (open: boolean) => void
    selectedMember: IMemberProfile | null
    setSelectedMember: (member: IMemberProfile | null) => void
    setDecodedMemberProfile: (profile?: IQRMemberProfile) => void
    setStartScanner: (start: boolean) => void
}

export const useMemberPickerStore = create<MemberPickerStoreProps>((set) => ({
    isOpen: false,
    decodedMemberProfile: undefined,
    openMemberPicker: false,
    startScanner: false,

    setStartScanner: (start) => set({ startScanner: start }),
    onOpenMemberPicker: (open) => set({ openMemberPicker: open }),
    selectedMember: null,
    setSelectedMember: (member) => set({ selectedMember: member }),
    setDecodedMemberProfile: (profile) =>
        set({ decodedMemberProfile: profile }),
}))
