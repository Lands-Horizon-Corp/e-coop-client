import { useCategoryStore } from '@/store/onboarding/category-store'
import { ICategory } from '@/types/lands-types/category'
import { useNavigate } from '@tanstack/react-router'

import { TEntityId } from '@/types'

import { CloseIcon, NextIcon } from '../icons'
import Modal, { IModalProps } from '../modals/modal'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from '../ui/command'
import { ScrollArea } from '../ui/scroll-area'

interface OrganizationCategoryPickerProps extends IModalProps {
    onChange?: (categoryData: ICategory) => void
    data?: ICategory[]
}

const OrganizationCategoryPicker = ({
    data,
    ...props
}: OrganizationCategoryPickerProps) => {
    const { addCategory, selectedCategories, removeCategory, clearCategories } =
        useCategoryStore()

    const handleSelectCategory = (category: ICategory) => {
        addCategory(category)
    }

    const handleDeleteSelectedCategory = (categoryId: TEntityId) => {
        removeCategory(categoryId)
    }

    const isSelectedCategoryEmmpty = selectedCategories.length === 0

    const { handleProceedToSetupOrg } = useCategoryStore()
    const navigate = useNavigate()

    return (
        <div>
            <Modal
                {...props}
                title="Select Category"
                description="select a category to proceed on creating organization"
                descriptionClassName="!mb-0"
                footer={
                    <div className="flex w-full items-end justify-end">
                        <Button
                            disabled={isSelectedCategoryEmmpty}
                            variant={'ghost'}
                            onClick={() => {
                                handleProceedToSetupOrg(navigate)
                            }}
                        >
                            Next
                            <NextIcon className="ml-2" />
                        </Button>
                    </div>
                }
            >
                <ScrollArea className="relative flex max-h-32 gap-2 overflow-auto overflow-y-hidden rounded-2xl border py-3">
                    {!isSelectedCategoryEmmpty && (
                        <Button
                            variant={'ghost'}
                            size={'sm'}
                            onClick={() => clearCategories()}
                            className="absolute right-1 top-1 max-h-6 cursor-pointer p-0 px-2 text-xs"
                        >
                            clear all
                        </Button>
                    )}
                    {isSelectedCategoryEmmpty ? (
                        <div className="flex flex-col items-center justify-center gap-y-2 text-center text-xs text-secondary-foreground/30">
                            Select a Category
                            <span>🍃 </span>
                        </div>
                    ) : (
                        selectedCategories.map((cat) => {
                            return (
                                <Badge
                                    key={cat.id}
                                    className="relative mx-[0.15rem] mt-2 px-2.5 py-1"
                                >
                                    {cat.name}
                                    <CloseIcon
                                        size={18}
                                        onClick={() => {
                                            handleDeleteSelectedCategory(cat.id)
                                        }}
                                        className="absolute -right-1.5 -top-2 scale-105 cursor-pointer rounded-full bg-secondary font-bold"
                                    />
                                </Badge>
                            )
                        })
                    )}
                </ScrollArea>
                <Command className="rounded-lg border shadow-md md:min-w-[450px]">
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        {data?.map((category: ICategory) => {
                            return (
                                <CommandItem
                                    key={category.id}
                                    onSelect={() => {
                                        handleSelectCategory(category)
                                    }}
                                    className="cursor-pointer"
                                >
                                    {category.name}
                                </CommandItem>
                            )
                        })}
                    </CommandList>
                </Command>
            </Modal>
        </div>
    )
}

export default OrganizationCategoryPicker
