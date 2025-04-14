import { create } from 'zustand'

interface MemberPickerState {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    toggle: () => void
}

export const useMemberPickerStore = create<MemberPickerState>((set) => ({
    isOpen: false,
    setIsOpen: (open) => set({ isOpen: open }),
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}))
