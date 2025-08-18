import { ICategory } from '@/types/lands-types/category'
import { UseNavigateResult } from '@tanstack/react-router'
import { create } from 'zustand'

import { TEntityId } from '@/types'

export interface CategoryDataStore {
    selectedCategories: ICategory[]
    onOpenCategoryPicker: boolean

    setOnOpenCategoryPicker: (open: boolean) => void
    addCategory: (category: ICategory) => void
    removeCategory: (id: TEntityId) => void
    clearCategories: () => void
    handleProceedToSetupOrg: (navigate: UseNavigateResult<string>) => void
}

export const useCategoryStore = create<CategoryDataStore>((set, get) => ({
    selectedCategories: [],
    onOpenCategoryPicker: false,

    setOnOpenCategoryPicker: (open) => set({ onOpenCategoryPicker: open }),
    addCategory: (category) => {
        const current = get().selectedCategories
        const alreadyExists = current.some((cat) => cat.id === category.id)
        if (alreadyExists) return
        set({ selectedCategories: [...current, category] })
    },
    handleProceedToSetupOrg: (navigate) => {
        const hasSelectedCategories = get().selectedCategories.length >= 1
        if (hasSelectedCategories) {
            navigate({ to: '/onboarding/setup-org' as string })
            set({ onOpenCategoryPicker: false })
        } else {
            set({ onOpenCategoryPicker: true })
        }
    },
    removeCategory: (id) => {
        const filtered = get().selectedCategories.filter((cat) => cat.id !== id)
        set({ selectedCategories: filtered })
    },
    clearCategories: () => {
        set({ selectedCategories: [] })
    },
}))
