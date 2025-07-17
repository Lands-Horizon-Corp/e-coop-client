import { create } from 'zustand'

interface MemberPickerStoreProps {
    isOpen: boolean
    onOpenMemberPicker: (open: boolean) => void
}

export const useMemberPickerStore = create<MemberPickerStoreProps>((set) => ({
    isOpen: false,
    onOpenMemberPicker: (open) => set({ isOpen: open }),
}))
