import { useEffect } from 'react'

import { FieldValues, UseFormReturn } from 'react-hook-form'

import { getIDB, useIndexedDB } from '../../hooks/use-indexdb-storage'

// THIS ONLY USE FOR PERSISTING FORM VALUES
// THIS IS HEADLESS
export const PeristFormHeadless = <T extends FieldValues>({
    key,
    form,
}: {
    key: string
    form: UseFormReturn<T>
}) => {
    const [_, setPersistFormData] = useIndexedDB<T | undefined>(
        `form-${key}`,
        form.getValues()
    )

    const values = form.watch()

    useEffect(() => {
        setPersistFormData(values)
    }, [setPersistFormData, form, values])

    return null
}

export const getFormPersistedData = async <T>(key: string) => {
    const result = (await getIDB<T>(key)) ?? {}
    return result as T
}
