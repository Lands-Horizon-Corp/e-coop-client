import { useCallback, useEffect, useRef } from 'react'

import {
    DefaultValues,
    FieldPath,
    FieldValues,
    Path,
    UseFormReturn,
} from 'react-hook-form'

import useConfirmModalStore from '@/store/confirm-modal-store'

import { usePreventExit } from './use-prevent-exit'

interface UseFormHelperProps<T extends FieldValues> {
    readOnly?: boolean
    form: UseFormReturn<T>
    hiddenFields?: Path<T>[]
    resetOnDefaultChange?: boolean
    disabledFields?: Path<T>[]
    defaultValues?: DefaultValues<T>

    autoSave?: boolean
    autoSaveDelay?: number
    focusOnError?: boolean
    preventExitOnDirty?: boolean
    // onNewDefaulValueNotice?: { title: string; description: string }
}

export const useFormHelper = <T extends FieldValues>({
    readOnly = false,
    hiddenFields = [],
    disabledFields = [],
    form,
    defaultValues,
    autoSave = false,
    autoSaveDelay = 1000,
    // onNewDefaulValueNotice,
    resetOnDefaultChange = false,
    focusOnError = true,
    preventExitOnDirty = true,
}: UseFormHelperProps<T>) => {
    const { onOpen } = useConfirmModalStore()

    useEffect(() => {
        if (
            resetOnDefaultChange &&
            defaultValues &&
            !form.formState.isSubmitting
        ) {
            if (form.formState.isDirty) {
                onOpen({
                    title: 'Data Changed',
                    description:
                        'The data you are currently editting has changed, but you have unsaved changes. Do you want to keep editting or update to newest data?',
                    confirmString: 'Newest',
                    cancelString: 'Keep Editting',
                    onConfirm: () => form.reset(defaultValues as unknown as T),
                })
            } else {
                form.reset(defaultValues as T)
            }
        }
    }, [form, onOpen, defaultValues, resetOnDefaultChange])

    const { isDisabled } = useFormDisabled<T>({ readOnly, disabledFields })

    const isHidden = useCallback(
        (field: Path<T>) => hiddenFields.includes(field),
        [hiddenFields]
    )

    const getDisableHideFieldProps = useCallback(
        (field: Path<T>) => {
            const prop: { disabled?: boolean; hidden?: boolean } = {}

            if (readOnly || hiddenFields.includes(field)) prop.hidden = true
            if (disabledFields.includes(field)) prop.disabled = true

            return prop
        },
        [hiddenFields, readOnly, disabledFields]
    )

    const firstError = Object.values(form.formState.errors)[0]?.message

    const formRef = useFormAutoSave<T>({
        form,
        delay: autoSaveDelay,
        enabled: autoSave,
    })

    const handleFocusError = useFocusOnErrorField({
        form,
        enabled: focusOnError,
    })

    useFormPreventExit({ form, enabled: preventExitOnDirty })

    return {
        formRef,
        isHidden,
        firstError,
        isDisabled,
        handleFocusError,
        getDisableHideFieldProps,
    }
}

export const useFormDisabled = <T extends FieldValues>({
    readOnly = false,
    disabledFields = [],
}: {
    readOnly?: boolean
    disabledFields?: Path<T>[]
}) => {
    const isDisabled = useCallback(
        (field: Path<T>) => readOnly || disabledFields.includes(field),
        [readOnly, disabledFields]
    )

    return { isDisabled }
}

export const useFocusOnErrorField = <T extends FieldValues>({
    form,
    enabled = true,
}: {
    form: UseFormReturn<T>
    enabled?: boolean
}) => {
    return useCallback(() => {
        if (!enabled) return

        const errors = form.formState.errors

        const firstErrorField = Object.keys(errors)[0] as
            | FieldPath<T>
            | undefined

        if (firstErrorField) {
            form.setFocus(firstErrorField)
        }
    }, [form, enabled])
}

export const useFormPreventExit = <T extends FieldValues>({
    form,
    enabled = true,
}: {
    form: UseFormReturn<T>
    enabled?: boolean
}) => {
    const { onOpen } = useConfirmModalStore()
    const hasDirtyFields = Object.keys(form.formState.dirtyFields).length > 0

    const onExitPrevented = useCallback(
        (proceed: () => void) => {
            onOpen({
                title: 'Unsaved changes',
                description:
                    "Seem's like there are unsaved changes, are you sure to discard?",
                onConfirm: () => proceed(),
            })
        },
        [onOpen]
    )

    usePreventExit({
        shouldPrevent: hasDirtyFields && enabled,
        onExitPrevented,
    })
}

type AutoSaveProps<T extends FieldValues> = {
    delay?: number
    enabled?: boolean
    form: UseFormReturn<T>
}

// EXPERIMENTAL - SUBMITTED DISCUSSION SINCE WITHOUTUSING USECALLBACK WILL CAUSE A BUG
// https://github.com/orgs/react-hook-form/discussions/13062
export const useFormAutoSave = <T extends FieldValues>({
    delay = 1000,
    form,
    enabled,
    // onSave,
}: AutoSaveProps<T>) => {
    const formRef = useRef<HTMLFormElement | null>(null)
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

    // const handleSave = useCallback(() => {
    // onSave()
    // }, []) // illegal

    useEffect(() => {
        const subscription = form.watch(() => {
            if (!enabled) return

            if (timer.current) clearTimeout(timer.current)

            timer.current = setTimeout(() => {
                const { dirtyFields } = form.formState

                const hasNoChanges = Object.keys(dirtyFields).length === 0

                if (hasNoChanges) return

                // handleSave()
                formRef.current?.requestSubmit()
            }, delay)
        })

        return () => {
            subscription.unsubscribe()
            if (timer.current) {
                clearTimeout(timer.current)
            }
        }
    }, [delay, form, enabled])

    return formRef
}
