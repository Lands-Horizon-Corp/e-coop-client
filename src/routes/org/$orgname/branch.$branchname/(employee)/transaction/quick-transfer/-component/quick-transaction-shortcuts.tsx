import { useShortcut } from '@/hooks/shortcut-hooks/use-shorcuts'

type UsePaymentsShortcutsTypes = {
    canSelectMember: () => void
    canResetAll: () => void
    canUnselectMember: () => void
}

export const useTransactionShortcuts = (props: UsePaymentsShortcutsTypes) => {
    const { canResetAll, canSelectMember, canUnselectMember } = props

    useShortcut('enter', canSelectMember, {
        disableTextInputs: true,
        disableActiveButton: true,
    })
    useShortcut('Escape', canResetAll, {
        disableActiveButton: true,
        disableTextInputs: true,
    })
    useShortcut(
        'd',
        (e) => {
            e.preventDefault()
            canUnselectMember()
        },
        { disableActiveButton: true, disableTextInputs: true }
    )
}
