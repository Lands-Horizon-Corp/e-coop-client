import { useNavigate } from '@tanstack/react-router'

import { ICategory } from '@/modules/category'
import { useCategoryStore } from '@/store/onboarding/category-store'

import { CloseIcon, NextIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import { ScrollArea } from '@/components/ui/scroll-area'

import { TEntityId } from '@/types'

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
                description="select a category to proceed on creating organization"
                descriptionClassName="!mb-0"
                footer={
                    <div className="flex w-full items-end justify-end">
                        <Button
                            disabled={isSelectedCategoryEmmpty}
                            onClick={() => {
                                handleProceedToSetupOrg(navigate)
                            }}
                            variant={'ghost'}
                        >
                            Next
                            <NextIcon className="ml-2" />
                        </Button>
                    </div>
                }
                title="Select Category"
            >
                <ScrollArea className="relative flex ecoop-scroll max-h-32 gap-2 overflow-auto overflow-y-hidden rounded-2xl border py-3">
                    {isSelectedCategoryEmmpty ? (
                        <div className="flex flex-col items-center justify-center gap-y-2 text-center text-xs text-secondary-foreground/30">
                            Select a Category
                            <span>🍃 </span>
                        </div>
                    ) : (
                        selectedCategories.map((cat) => {
                            return (
                                <Badge
                                    className="relative mx-[0.15rem] mt-2 px-2.5 py-1"
                                    key={cat.id}
                                >
                                    {cat.name}
                                    <CloseIcon
                                        className="absolute -right-1.5 -top-2 scale-105 cursor-pointer rounded-full bg-secondary font-bold"
                                        onClick={() => {
                                            handleDeleteSelectedCategory(cat.id)
                                        }}
                                        size={18}
                                    />
                                </Badge>
                            )
                        })
                    )}
                </ScrollArea>
                {!isSelectedCategoryEmmpty && (
                    <Button
                        className="max-h-6 cursor-pointer p-0 px-2 text-xs"
                        onClick={() => clearCategories()}
                        size={'sm'}
                        variant={'secondary'}
                    >
                        clear all
                    </Button>
                )}
                <Command className="rounded-lg border shadow-md md:min-w-[450px]">
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList className="ecoop-scroll">
                        <CommandEmpty>No results found.</CommandEmpty>
                        {data?.map((category: ICategory) => {
                            return (
                                <CommandItem
                                    className="cursor-pointer"
                                    key={category.id}
                                    onSelect={() => {
                                        handleSelectCategory(category)
                                    }}
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
