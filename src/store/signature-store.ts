import { create } from 'zustand'

interface SignatureState {
    file?: File
}

interface SignatureActions {
    setFile: (file: File | undefined) => void
}

interface SignatureProps extends SignatureState, SignatureActions {}

export const useSignature = create<SignatureProps>()((set) => ({
    file: undefined,
    setFile: (file) => set({ file }),
}))
