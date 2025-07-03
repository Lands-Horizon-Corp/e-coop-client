import { useCallback, useEffect } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'
import {
    DefaultValues,
    FieldValues,
    Path,
    UseFormReturn,
} from 'react-hook-form'

interface UseFormHelperProps<T, TForm extends FieldValues> {
    readOnly?: boolean
    form: UseFormReturn<TForm>
    hiddenFields?: Array<Path<T>>
    resetOnDefaultChange?: boolean
    disabledFields?: Array<Path<T>>
    defaultValues?: DefaultValues<T>
    onNewDefaulValueNotice?: { title: string; description: string }
}

export const useFormHelper = <T, TForm extends FieldValues>({
    readOnly = false,
    hiddenFields = [],
    disabledFields = [],
    form,
    defaultValues,
    resetOnDefaultChange = false,
}: UseFormHelperProps<T, TForm>) => {
    const { onOpen } = useConfirmModalStore()

    useEffect(() => {
        if (resetOnDefaultChange && defaultValues) {
            if (form.formState.isDirty) {
                onOpen({
                    title: 'Data Changed',
                    description:
                        'The data you are currently editting has changed, but you have unsaved changes. Do you want to keep editting or update to newest data?',
                    confirmString: 'Newest',
                    cancelString: 'Keep Editting',
                    onConfirm: () =>
                        form.reset(defaultValues as unknown as TForm),
                })
            } else {
                form.reset(defaultValues as TForm)
            }
        }
    }, [form, onOpen, defaultValues, resetOnDefaultChange])

    const isDisabled = useCallback(
        (field: Path<T>) => readOnly || disabledFields.includes(field),
        [readOnly, disabledFields]
    )

    const isHidden = useCallback(
        (field: Path<T>) => hiddenFields.includes(field),
        [hiddenFields]
    )

    return {
        isHidden,
        isDisabled,
    }
}
