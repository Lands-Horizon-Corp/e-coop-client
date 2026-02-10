import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

import { useHotkeys } from 'react-hotkeys-hook'

import { useQuickTransferContext } from '../context/quick-transfer-context'
import { TQuickWithdrawSchemaFormValues } from '../quick-transfer.validation'

interface QuickTransferHotkeyProps {
    form: UseFormReturn<TQuickWithdrawSchemaFormValues>
    handleSubmit: () => void
    handleResetAll: () => void
    readOnly?: boolean
    isQuickTransactionPending: boolean
    isFormIsDirty: boolean
}

export const useQuickTransferHotKeys = ({
    form,
    handleSubmit,
    handleResetAll,
    readOnly,
    isQuickTransactionPending,
    isFormIsDirty,
}: QuickTransferHotkeyProps) => {
    const {
        othersState,
        accountPickerState,
        paymentTypeModalState,
        finalOR,
        setSelectedMember,
        selectedMember,
        openMemberPicker,
    } = useQuickTransferContext()
    // CTRL + 1 — Toggle Others modal

    useHotkeys(
        'f1',
        (e) => {
            e.preventDefault()
            othersState.onOpenChange(!othersState.open)
        },
        {
            enableOnFormTags: true,
            keydown: true,
        },
        [othersState]
    )

    // CTRL + ENTER — Submit
    useHotkeys(
        'ctrl + Enter',
        (e) => {
            e.preventDefault()
            if (!selectedMember) {
                toast.warning('Please select a member before submitting.')
                return
            }
            if (
                readOnly ||
                isQuickTransactionPending ||
                !isFormIsDirty ||
                !selectedMember ||
                openMemberPicker.open
            )
                return
            handleSubmit()
        },
        {
            enableOnFormTags: ['INPUT'],
        },
        [
            readOnly,
            isFormIsDirty,
            selectedMember,
            openMemberPicker.open,
            isQuickTransactionPending,
            handleSubmit,
        ]
    )

    // ALT + 1 — Focus OR
    useHotkeys(
        'Alt + 1',
        (e) => {
            e.preventDefault()
            form.setFocus('reference_number')
        },
        {
            enableOnFormTags: true,
        },
        [form]
    )

    // ALT + 2 — Account picker
    useHotkeys(
        'Alt + 2',
        (e) => {
            e.preventDefault()
            accountPickerState.onOpenChange(!accountPickerState.open)
        },
        {
            enableOnFormTags: true,
        },
        [accountPickerState]
    )

    // ALT + 3 — Focus amount
    useHotkeys(
        'Alt + 3',
        (e) => {
            e.preventDefault()
            form.setFocus('amount')
        },
        {
            enableOnFormTags: true,
        },
        [form]
    )

    // ALT + 4 — Payment type modal
    useHotkeys(
        'Alt + 4',
        (e) => {
            e.preventDefault()
            paymentTypeModalState.onOpenChange(!paymentTypeModalState.open)
        },
        {
            enableOnFormTags: true,
        },
        [paymentTypeModalState]
    )
    // ALT + E — Toggle auto OR
    useHotkeys(
        'Alt + E',
        (e) => {
            e.preventDefault()
            const isAuto = !form.getValues('is_reference_number_checked')

            form.setValue('is_reference_number_checked', isAuto)

            if (isAuto) {
                form.setValue('reference_number', finalOR, {
                    shouldDirty: true,
                })
            }
        },
        {
            enableOnFormTags: true,
        },
        [form, finalOR]
    )

    // ESC — Reset everything
    useHotkeys(
        'esc',
        (e) => {
            e.preventDefault()
            handleResetAll()
            setSelectedMember(null)
        },
        {
            enableOnFormTags: true,
        },
        [handleResetAll, setSelectedMember]
    )
}
