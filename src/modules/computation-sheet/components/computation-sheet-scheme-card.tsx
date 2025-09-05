import YesNoBadge from '@/components/badges/yes-no-badge'
import { BookOpenIcon, PencilFillIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { useModalState } from '@/hooks/use-modal-state'

import { IComputationSheet } from '../computation-sheet.types'
import { ComputationSheetCreateUpdateFormModal } from './forms/computation-sheet-create-update-form'

type Props = {
    computationSheet?: IComputationSheet
}

const ComputationSheetSchemeCard = ({ computationSheet }: Props) => {
    const editModal = useModalState()

    return (
        <div className="w-full relative bg-card rounded-xl p-4 hover:shadow-md transition-shadow">
            <ComputationSheetCreateUpdateFormModal
                {...editModal}
                formProps={{
                    computationSheetId: computationSheet?.id,
                    defaultValues: computationSheet,
                }}
            />
            {computationSheet?.id && (
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => editModal.onOpenChange(true)}
                    className="absolute size-fit p-2 rounded-xl text-muted-foreground/70 hober:text-foreground top-1 right-2"
                >
                    <PencilFillIcon />
                </Button>
            )}
            <div className="shrink-none space-y-2">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold truncate pr-2 relative">
                        <BookOpenIcon className="text-muted-foreground inline mr-2" />
                        <span className="text-sm mr-1 font-normal text-muted-foreground/70">
                            Scheme Title :
                        </span>
                        {computationSheet?.name ?? (
                            <span className="text-muted-foreground/70">
                                ...
                            </span>
                        )}
                    </CardTitle>
                </div>
                <p className="text-sm text-muted-foreground/70 line-clamp-2">
                    {computationSheet?.description &&
                    computationSheet?.description.length > 0
                        ? computationSheet.description
                        : 'no description'}
                </p>
            </div>
            <div className="border rounded-xl flex items-center mt-4 p-4 justify-evenly gap-x-4 bg-background/20">
                <div className="space-y-2 text-sm shrink-0">
                    <span className="font-medium">
                        {computationSheet?.comaker_account}
                    </span>
                    <p className="text-xs text-muted-foreground">CoMaker</p>
                </div>
                <Separator orientation="vertical" />
                <div className="space-y-2 text-sm shrink-0">
                    <span className="font-medium">
                        <YesNoBadge
                            value={!!computationSheet?.deliquent_account}
                        />
                    </span>
                    <p className="text-xs text-muted-foreground">
                        Deliquent Account
                    </p>
                </div>
                <Separator orientation="vertical" />
                <div className="space-y-2 text-sm shrink-0">
                    <span className="font-medium">
                        <YesNoBadge
                            value={!!computationSheet?.interest_account}
                        />
                    </span>
                    <p className="text-xs text-muted-foreground">
                        Interest Account
                    </p>
                </div>
                <Separator orientation="vertical" />
                <div className="space-y-2 text-sm shrink-0">
                    <span className="font-medium">
                        <YesNoBadge value={!!computationSheet?.fines_account} />
                    </span>
                    <p className="text-xs text-muted-foreground">
                        Fines Account
                    </p>
                </div>
                <Separator orientation="vertical" />
                <div className="space-y-2 text-sm shrink-0">
                    <span className="font-medium">
                        <YesNoBadge value={!!computationSheet?.exist_account} />
                    </span>
                    <p className="text-xs text-muted-foreground">
                        Exist Account
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ComputationSheetSchemeCard
