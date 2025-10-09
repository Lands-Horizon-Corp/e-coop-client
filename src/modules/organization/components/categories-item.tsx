import { cn } from '@/helpers/tw-utils'
import { useCategoryStore } from '@/store/onboarding/category-store'

import { CloseIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

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
                    className="absolute right-1 top-1 max-h-6 cursor-pointer p-0 px-2 text-xs"
                    onClick={() => clearCategories()}
                    size={'sm'}
                    variant={'ghost'}
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
                            className="relative mx-[0.15rem] mt-2 px-2.5 py-1"
                            key={cat.id}
                        >
                            {cat.name}
                            <CloseIcon
                                className="absolute -right-1.5 -top-2 scale-105 cursor-pointer rounded-full bg-secondary font-bold"
                                onClick={() => {
                                    removeCategory(cat.id)
                                }}
                                size={18}
                            />
                        </Badge>
                    )
                })
            )}
        </ScrollArea>
    )
}

export default CategoriesItem
