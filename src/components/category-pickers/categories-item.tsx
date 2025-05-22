import { ScrollArea } from '../ui/scroll-area'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

import { CloseIcon } from '../icons'
import { useCategoryStore } from '@/store/onboarding/category-store'

import { cn } from '@/lib'

type CategoriesItemProps = {
    className?: string
}

const CategoriesItem = ({ className }: CategoriesItemProps) => {

    const { clearCategories, selectedCategories, removeCategory } =
        useCategoryStore()

    const isSelectedCategoryEmmpty = selectedCategories.length === 0

    return (
        <ScrollArea
            className={cn(
                'relative flex max-h-32 gap-2 overflow-auto overflow-y-hidden rounded-2xl border py-3',
                className
            )}
        >
            {!isSelectedCategoryEmmpty && (
                <Button
                    variant={'ghost'}
                    size={'sm'}
                    onClick={() => clearCategories()}
                    className="absolute right-1 top-1 max-h-6 cursor-pointer p-0 px-2 text-xs"
                >
                    clear
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
                                    removeCategory(cat.id)
                                }}
                                className="absolute -right-1.5 -top-2 scale-105 cursor-pointer rounded-full bg-secondary font-bold"
                            />
                        </Badge>
                    )
                })
            )}
        </ScrollArea>
    )
}

export default CategoriesItem
