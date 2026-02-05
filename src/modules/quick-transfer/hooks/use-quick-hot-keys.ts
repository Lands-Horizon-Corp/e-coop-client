import { UseFormReturn } from 'react-hook-form'

import { useHotkeys } from 'react-hotkeys-hook'

import { useTransactionBatchStore } from '../../transaction-batch/store/transaction-batch-store'
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
        accountPickerModalState,
        paymentTypeModalState,
        memberJointModalState,
        finalOR,
        setSelectedMember,
    } = useQuickTransferContext()
    const { hasNoTransactionBatch } = useTransactionBatchStore()
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
            handleSubmit()
        },
        {
            enableOnFormTags: true,
            enabled: !readOnly || !isQuickTransactionPending || isFormIsDirty,
        }
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
            accountPickerModalState.onOpenChange(!accountPickerModalState.open)
        },
        {
            enableOnFormTags: true,
        },
        [accountPickerModalState]
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

    // ALT + 5 — Member joint modal
    useHotkeys(
        'Alt + 5',
        (e) => {
            e.preventDefault()
            memberJointModalState.onOpenChange(!memberJointModalState.open)
        },
        {
            enableOnFormTags: true,
            enabled: hasNoTransactionBatch,
        },
        [memberJointModalState, hasNoTransactionBatch]
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
