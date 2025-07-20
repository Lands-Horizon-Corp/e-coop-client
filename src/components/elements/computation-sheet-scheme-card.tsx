import { ComputationSheetCreateUpdateFormModal } from '@/components/forms/loan/computation-sheet-create-update-form'
import { PencilFillIcon, UserIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { useModalState } from '@/hooks/use-modal-state'

import { IComputationSheet } from '@/types'

type Props = {
    computationSheet?: IComputationSheet
}

const ComputationSheetSchemeCard = ({ computationSheet }: Props) => {
    const editModal = useModalState()

    return (
        <Card className="w-full hover:shadow-md transition-shadow">
            <ComputationSheetCreateUpdateFormModal
                {...editModal}
                formProps={{
                    computationSheetId: computationSheet?.id,
                    defaultValues: computationSheet,
                }}
            />
            <CardHeader className="pb-3 relative">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold truncate pr-2">
                        {computationSheet?.name ?? (
                            <span className="text-muted-foreground/70">
                                ...
                            </span>
                        )}
                    </CardTitle>
                </div>
                <p className="text-sm text-muted-foreground/70 line-clamp-2">
                    {computationSheet?.description ?? 'no description'}
                </p>
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
            </CardHeader>
            <CardContent className="space-y-4">
                {(computationSheet?.comaker_account ?? 0) > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                        <UserIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            Required Comakers:
                        </span>
                        <span className="font-medium">
                            {computationSheet?.comaker_account}
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default ComputationSheetSchemeCard
